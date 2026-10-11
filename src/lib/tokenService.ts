import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebaseAuth';
import { TokenBooking } from '../types/service';

const TOKENS_COLLECTION = 'tokenBookings';

export const saveTokenBooking = async (booking: Omit<TokenBooking, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, TOKENS_COLLECTION), {
      ...booking,
      status: booking.status || 'pending',
      timestamp: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving token booking to Firestore:', error);
    // Fallback: also save to localStorage for offline safety
    try {
      const stored = localStorage.getItem('dsk_saved_tokens');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift({ ...booking, id: 'local_' + Date.now(), status: 'pending' });
      localStorage.setItem('dsk_saved_tokens', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage fallback error:', e);
    }
    throw error;
  }
};

export const fetchAllTokens = async (): Promise<TokenBooking[]> => {
  try {
    const q = query(collection(db, TOKENS_COLLECTION), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    const list: TokenBooking[] = [];
    snapshot.forEach((docSnap) => {
      list.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<TokenBooking, 'id'>)
      });
    });
    return list;
  } catch (error) {
    console.error('Error fetching tokens from Firestore:', error);
    // Fallback to local storage if network issue
    const stored = localStorage.getItem('dsk_saved_tokens');
    return stored ? JSON.parse(stored) : [];
  }
};

export const subscribeToTokens = (callback: (tokens: TokenBooking[]) => void) => {
  try {
    const q = query(collection(db, TOKENS_COLLECTION), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const list: TokenBooking[] = [];
      snapshot.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<TokenBooking, 'id'>)
        });
      });
      callback(list);
    }, (error) => {
      console.warn('Snapshot listener error, loading cache:', error);
      const stored = localStorage.getItem('dsk_saved_tokens');
      if (stored) callback(JSON.parse(stored));
    });
  } catch (e) {
    console.error('Error setting up snapshot subscription:', e);
    return () => {};
  }
};

export const updateTokenStatus = async (
  id: string, 
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
) => {
  try {
    const docRef = doc(db, TOKENS_COLLECTION, id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error('Error updating token status:', error);
    throw error;
  }
};

export const deleteTokenRecord = async (id: string) => {
  try {
    const docRef = doc(db, TOKENS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting token:', error);
    throw error;
  }
};
