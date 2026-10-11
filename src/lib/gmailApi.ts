export interface GmailMessageSummary {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  isUnread: boolean;
}

export interface GmailMessageDetail extends GmailMessageSummary {
  body: string;
}

/**
 * Lists messages from the user's Gmail mailbox using the Gmail REST API
 */
export async function listGmailMessages(
  accessToken: string,
  query: string = '',
  maxResults: number = 15
): Promise<GmailMessageSummary[]> {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.set('maxResults', maxResults.toString());
  if (query) {
    url.searchParams.set('q', query);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (!data.messages || !Array.isArray(data.messages)) {
    return [];
  }

  // Fetch summaries for each message ID
  const summaries: GmailMessageSummary[] = await Promise.all(
    data.messages.map(async (item: { id: string; threadId: string }) => {
      try {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json'
            }
          }
        );

        if (!msgRes.ok) {
          return {
            id: item.id,
            threadId: item.threadId,
            subject: 'No Subject',
            from: 'Unknown',
            to: '',
            date: '',
            snippet: '',
            isUnread: false
          };
        }

        const msgData = await msgRes.json();
        const headers: { name: string; value: string }[] = msgData.payload?.headers || [];
        
        const getHeader = (name: string) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        const labelIds: string[] = msgData.labelIds || [];
        const isUnread = labelIds.includes('UNREAD');

        return {
          id: msgData.id,
          threadId: msgData.threadId,
          subject: getHeader('Subject') || '(No Subject)',
          from: getHeader('From') || '(Unknown Sender)',
          to: getHeader('To') || '',
          date: getHeader('Date') || '',
          snippet: msgData.snippet || '',
          isUnread
        };
      } catch (err) {
        return {
          id: item.id,
          threadId: item.threadId,
          subject: '(Message)',
          from: '',
          to: '',
          date: '',
          snippet: '',
          isUnread: false
        };
      }
    })
  );

  return summaries;
}

/**
 * Gets the full content and decoded body of a single message
 */
export async function getGmailMessageDetail(
  accessToken: string,
  messageId: string
): Promise<GmailMessageDetail> {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get email detail (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const headers: { name: string; value: string }[] = data.payload?.headers || [];
  const getHeader = (name: string) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  // Extract body
  let body = '';
  if (data.payload?.parts && data.payload.parts.length > 0) {
    for (const part of data.payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        body = decodeBase64Url(part.body.data);
        break;
      } else if (part.mimeType === 'text/html' && part.body?.data) {
        body = decodeBase64Url(part.body.data);
      }
    }
  } else if (data.payload?.body?.data) {
    body = decodeBase64Url(data.payload.body.data);
  }

  if (!body) {
    body = data.snippet || 'No text content available in this email.';
  }

  return {
    id: data.id,
    threadId: data.threadId,
    subject: getHeader('Subject') || '(No Subject)',
    from: getHeader('From') || '(Unknown Sender)',
    to: getHeader('To') || '',
    date: getHeader('Date') || '',
    snippet: data.snippet || '',
    isUnread: (data.labelIds || []).includes('UNREAD'),
    body
  };
}

/**
 * Sends an email on behalf of the user using the Gmail API
 * Note: Must be preceded by explicit user confirmation as per skill guidelines
 */
export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<{ id: string; threadId: string }> {
  // Construct RFC 2822 email format
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    bodyText
  ];

  const emailRaw = emailLines.join('\r\n');
  const base64Encoded = btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: base64Encoded
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email (${response.status}): ${errorText}`);
  }

  return await response.json();
}

function decodeBase64Url(input: string): string {
  try {
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(escape(atob(base64)));
  } catch (err) {
    return input;
  }
}
