/**
 * Client-Side Google Docs & Google Drive REST API integration
 * Adheres strictly to workspace integration guidelines:
 * - Uses Bearer access token obtained via Firebase Google Auth
 * - In-memory tokens only
 * - Client-side fetch only (no server redirect flows)
 * - Explicit user confirmation dialogs for destructive operations (delete/update)
 */

export interface GoogleDocSummary {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  createdTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface GoogleDocContent {
  documentId: string;
  title: string;
  bodyText: string;
  revisionId?: string;
}

/**
 * Lists Google Docs documents from the user's Google Drive
 */
export async function listGoogleDocs(
  accessToken: string,
  query: string = '',
  pageSize: number = 20
): Promise<GoogleDocSummary[]> {
  const url = new URL('https://www.googleapis.com/drive/v3/files');
  // Only query files that are Google Docs documents and not in trash
  let q = "mimeType = 'application/vnd.google-apps.document' and trashed = false";
  if (query.trim()) {
    // Escape single quotes in search query
    const safeQuery = query.replace(/'/g, "\\'");
    q += ` and name contains '${safeQuery}'`;
  }

  url.searchParams.set('q', q);
  url.searchParams.set('pageSize', pageSize.toString());
  url.searchParams.set('fields', 'files(id, name, mimeType, modifiedTime, createdTime, webViewLink, iconLink)');
  url.searchParams.set('orderBy', 'modifiedTime desc');

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Drive API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return (data.files || []) as GoogleDocSummary[];
}

/**
 * Retrieves a Google Doc by its ID and parses plain text from its StructuralElements
 */
export async function getGoogleDoc(
  accessToken: string,
  documentId: string
): Promise<GoogleDocContent> {
  const res = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Docs API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const title = data.title || 'Untitled Document';

  // Extract text from structural elements
  let bodyText = '';
  if (data.body && data.body.content && Array.isArray(data.body.content)) {
    for (const elem of data.body.content) {
      if (elem.paragraph && elem.paragraph.elements) {
        for (const pe of elem.paragraph.elements) {
          if (pe.textRun && pe.textRun.content) {
            bodyText += pe.textRun.content;
          }
        }
      } else if (elem.table && elem.table.tableRows) {
        for (const row of elem.table.tableRows) {
          if (row.tableCells) {
            for (const cell of row.tableCells) {
              if (cell.content) {
                for (const cellElem of cell.content) {
                  if (cellElem.paragraph && cellElem.paragraph.elements) {
                    for (const cpe of cellElem.paragraph.elements) {
                      if (cpe.textRun && cpe.textRun.content) {
                        bodyText += cpe.textRun.content + ' ';
                      }
                    }
                  }
                }
              }
            }
          }
          bodyText += '\n';
        }
      }
    }
  }

  return {
    documentId: data.documentId,
    title,
    bodyText: bodyText.trim(),
    revisionId: data.revisionId
  };
}

/**
 * Creates a new blank or initialized Google Doc in user's Google Drive
 */
export async function createGoogleDoc(
  accessToken: string,
  title: string,
  initialContent?: string
): Promise<{ documentId: string; title: string }> {
  // Step 1: Create the document using Google Docs API
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title.trim() || 'New Document'
    })
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create Google Doc (${createRes.status}): ${errorText}`);
  }

  const createdDoc = await createRes.json();
  const documentId = createdDoc.documentId;

  // Step 2: If initial content is provided, insert it via batchUpdate
  if (initialContent && initialContent.trim().length > 0) {
    try {
      const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                location: {
                  index: 1 // Insertion starts at index 1 for initial blank body
                },
                text: initialContent
              }
            }
          ]
        })
      });

      if (!updateRes.ok) {
        console.warn('Initial text insert failed, but document was created successfully.');
      }
    } catch (err) {
      console.warn('Error inserting initial text:', err);
    }
  }

  return {
    documentId,
    title: createdDoc.title || title
  };
}

/**
 * Appends text to an existing Google Doc via batchUpdate
 * Note: Must have user confirmation before executing mutating operations
 */
export async function appendTextToGoogleDoc(
  accessToken: string,
  documentId: string,
  text: string
): Promise<void> {
  // Fetch document end index first
  const doc = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  }).then(r => r.json());

  // Find the last index
  let endIndex = 1;
  if (doc.body && doc.body.content && doc.body.content.length > 0) {
    const lastItem = doc.body.content[doc.body.content.length - 1];
    if (lastItem.endIndex) {
      endIndex = Math.max(1, lastItem.endIndex - 1);
    }
  }

  const res = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: {
              index: endIndex
            },
            text: '\n' + text
          }
        }
      ]
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to append text to Google Doc (${res.status}): ${errorText}`);
  }
}

/**
 * Trashes a document in Google Drive (Destructive operation)
 * Must be preceded by explicit user confirmation dialog
 */
export async function trashGoogleDoc(
  accessToken: string,
  documentId: string
): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${documentId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      trashed: true
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to trash Google Doc (${res.status}): ${errorText}`);
  }
}
