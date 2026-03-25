/**
 * Firestore Database Utilities
 */

import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { app } from './config';
import {
  WeddingConfig,
  Flashback,
  GalleryItem,
  GuestMessage,
} from '@/types';

const db = getFirestore(app);

// Collection names
export const COLLECTIONS = {
  CONFIG: 'config',
  FLASHBACK: 'flashback',
  GALLERY: 'gallery',
  GUESTS: 'guests',
} as const;

/**
 * Config operations
 */
export const getConfig = async (): Promise<WeddingConfig | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.CONFIG, 'undanganSettings');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as WeddingConfig;
    }
    return null;
  } catch (error) {
    console.error('Error getting config:', error);
    return null;
  }
};

export const setConfig = async (config: WeddingConfig): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, COLLECTIONS.CONFIG, 'undanganSettings');
    await setDoc(docRef, {
      ...config,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to set config';
    return { success: false, error: errorMessage };
  }
};

export const subscribeToConfig = (
  callback: (config: WeddingConfig | null) => void
) => {
  const docRef = doc(db, COLLECTIONS.CONFIG, 'undanganSettings');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as WeddingConfig);
    } else {
      callback(null);
    }
  });
};

/**
 * Flashback operations
 */
export const getFlashbacks = async (): Promise<Flashback[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.FLASHBACK), orderBy('urutan', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Flashback));
  } catch (error) {
    console.error('Error getting flashbacks:', error);
    return [];
  }
};

export const addFlashback = async (
  flashback: Omit<Flashback, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.FLASHBACK), {
      ...flashback,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to add flashback';
    return { success: false, error: errorMessage };
  }
};

export const updateFlashback = async (
  id: string,
  data: Partial<Flashback>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, COLLECTIONS.FLASHBACK, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update flashback';
    return { success: false, error: errorMessage };
  }
};

export const deleteFlashback = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.FLASHBACK, id));
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete flashback';
    return { success: false, error: errorMessage };
  }
};

export const subscribeToFlashbacks = (
  callback: (flashbacks: Flashback[]) => void
) => {
  const q = query(collection(db, COLLECTIONS.FLASHBACK), orderBy('urutan', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const flashbacks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Flashback));
    callback(flashbacks);
  });
};

/**
 * Gallery operations
 */
export const getGallery = async (): Promise<GalleryItem[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.GALLERY), orderBy('urutan', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GalleryItem));
  } catch (error) {
    console.error('Error getting gallery:', error);
    return [];
  }
};

export const addGalleryItem = async (
  item: Omit<GalleryItem, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.GALLERY), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to add gallery item';
    return { success: false, error: errorMessage };
  }
};

export const updateGalleryItem = async (
  id: string,
  data: Partial<GalleryItem>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, COLLECTIONS.GALLERY, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update gallery item';
    return { success: false, error: errorMessage };
  }
};

export const deleteGalleryItem = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.GALLERY, id));
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete gallery item';
    return { success: false, error: errorMessage };
  }
};

export const subscribeToGallery = (
  callback: (gallery: GalleryItem[]) => void
) => {
  const q = query(collection(db, COLLECTIONS.GALLERY), orderBy('urutan', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const gallery = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GalleryItem));
    callback(gallery);
  });
};

/**
 * Guest message operations
 */
export const addGuestMessage = async (
  message: Omit<GuestMessage, 'id'>
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.GUESTS), {
      ...message,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to add guest message';
    return { success: false, error: errorMessage };
  }
};

export const getGuestMessages = async (): Promise<GuestMessage[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.GUESTS),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GuestMessage));
  } catch (error) {
    console.error('Error getting guest messages:', error);
    return [];
  }
};

export const subscribeToGuestMessages = (
  callback: (messages: GuestMessage[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.GUESTS),
    orderBy('createdAt', 'desc'),
    limit(100)
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      // Convert Firestore Timestamp to Date
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt;
      const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt;
      return { 
        id: doc.id, 
        createdAt,
        updatedAt,
        ...data 
      } as GuestMessage;
    });
    callback(messages);
  });
};

export const deleteGuestMessage = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.GUESTS, id));
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete guest message';
    return { success: false, error: errorMessage };
  }
};

export { db };
