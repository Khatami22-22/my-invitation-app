/**
 * Firebase Storage Utilities
 */

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { app } from './config';
import { UploadProgress } from '@/types';

const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'images/gallery')
 * @param onProgress - Callback for upload progress
 * @returns The download URL or error
 */
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}-${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.({ progress });
        },
        (error) => {
          resolve({ success: false, error: error.message });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ success: true, url: downloadURL });
        }
      );
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return { success: false, error: errorMessage };
  }
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (url: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Delete failed';
    return { success: false, error: errorMessage };
  }
};

/**
 * List all files in a storage path
 */
export const listFiles = async (path: string): Promise<{ success: boolean; items?: string[]; error?: string }> => {
  try {
    const listRef = ref(storage, path);
    const result = await listAll(listRef);
    const items = result.items.map((item) => item.fullPath);
    return { success: true, items };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'List failed';
    return { success: false, error: errorMessage };
  }
};

/**
 * Generate a unique filename for uploads
 */
export const generateFileName = (prefix: string, extension: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
};

export { storage };
