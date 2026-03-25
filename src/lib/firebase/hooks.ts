/**
 * React Hooks for Firebase
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuthState, login as firebaseLogin, logout as firebaseLogout } from './auth';
import { subscribeToConfig, getConfig, setConfig } from './firestore';
import { subscribeToFlashbacks, getFlashbacks, addFlashback, updateFlashback, deleteFlashback } from './firestore';
import { subscribeToGallery, getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } from './firestore';
import { subscribeToGuestMessages, addGuestMessage, getGuestMessages, deleteGuestMessage } from './firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';
import {
  WeddingConfig,
  Flashback,
  GalleryItem,
  GuestMessage,
  UploadProgress,
  LoginForm,
  GuestForm,
} from '@/types';

/**
 * Hook for authentication state
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Setting up auth state listener...');
    const unsubscribe = subscribeToAuthState((user) => {
      console.log('🔑 Auth state changed:', user?.email || 'null');
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log('🔒 Cleaning up auth listener...');
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 Attempting login for:', email);
    return await firebaseLogin(email, password);
  };

  const logout = async () => {
    console.log('🚪 Logging out...');
    return await firebaseLogout();
  };

  return { user, loading, login, logout };
};

/**
 * Hook for wedding config
 */
export const useWeddingConfig = () => {
  const [config, setConfigState] = useState<WeddingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToConfig((data) => {
      setConfigState(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateConfig = async (newConfig: WeddingConfig) => {
    return await setConfig(newConfig);
  };

  return { config, loading, updateConfig };
};

/**
 * Hook for flashbacks
 */
export const useFlashbacks = () => {
  const [flashbacks, setFlashbacks] = useState<Flashback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToFlashbacks((data) => {
      setFlashbacks(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addFlashbackItem = async (flashback: Omit<Flashback, 'id'>) => {
    return await addFlashback(flashback);
  };

  const updateFlashbackItem = async (id: string, data: Partial<Flashback>) => {
    return await updateFlashback(id, data);
  };

  const deleteFlashbackItem = async (id: string) => {
    return await deleteFlashback(id);
  };

  return {
    flashbacks,
    loading,
    addFlashback: addFlashbackItem,
    updateFlashback: updateFlashbackItem,
    deleteFlashback: deleteFlashbackItem,
  };
};

/**
 * Hook for gallery
 */
export const useGallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToGallery((data) => {
      setGallery(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addGalleryItemImage = async (
    file: File,
    urutan: number,
    onProgress?: (progress: UploadProgress) => void
  ) => {
    // Upload file to Cloudinary
    const uploadResult = await uploadToCloudinary(file, 'images/gallery', onProgress);
    if (!uploadResult.success || !uploadResult.url) {
      return { success: false, error: uploadResult.error };
    }

    // Add to Firestore
    return await addGalleryItem({
      imageUrl: uploadResult.url,
      urutan,
    });
  };

  const updateGalleryItemData = async (id: string, data: Partial<GalleryItem>) => {
    return await updateGalleryItem(id, data);
  };

  const deleteGalleryItemData = async (id: string, imageUrl?: string) => {
    // Delete from Cloudinary if URL provided (optional, Cloudinary files can be kept)
    // For simplicity, we only delete from Firestore
    // To delete from Cloudinary, you need to implement server-side API
    return await deleteGalleryItem(id);
  };

  return {
    gallery,
    loading,
    addGallery: addGalleryItemImage,
    updateGallery: updateGalleryItemData,
    deleteGallery: deleteGalleryItemData,
  };
};

/**
 * Hook for guest messages
 */
export const useGuestMessages = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToGuestMessages((data) => {
      setMessages(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addMessage = async (form: GuestForm) => {
    return await addGuestMessage({
      nama: form.nama,
      hadir: form.hadir,
      alamat: form.alamat || '',
      ucapan: form.ucapan,
    });
  };

  const deleteMessage = async (id: string) => {
    return await deleteGuestMessage(id);
  };

  return {
    messages,
    loading,
    addMessage,
    deleteMessage,
  };
};

/**
 * Hook for file upload (Cloudinary)
 */
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, path: string = 'invitation-app'): Promise<{ success: boolean; url?: string; error?: string }> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    const result = await uploadToCloudinary(file, path, ({ progress, error }) => {
      setProgress(progress);
      if (error) {
        setError(error);
      }
    });

    setUploading(false);
    return result;
  };

  const reset = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
  };

  return { uploading, progress, error, upload, reset };
};
