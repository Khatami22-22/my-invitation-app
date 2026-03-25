/**
 * Cloudinary Storage Utilities
 * Alternatif gratis untuk Firebase Storage
 * 
 * Features:
 * - Upload images & videos
 * - Auto-optimization
 * - CDN delivery
 * - Transformations via URL
 */

import { UploadProgress } from '@/types';

// Cloudinary configuration dari environment variables
const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

/**
 * Upload file ke Cloudinary
 * @param file - File yang akan diupload
 * @param folder - Folder di Cloudinary (opsional)
 * @param onProgress - Callback untuk upload progress
 * @returns URL file yang diupload atau error
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'invitation-app',
  onProgress?: (progress: UploadProgress) => void
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Validasi Cloudinary config
    if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
      return {
        success: false,
        error: 'Cloudinary configuration not found. Please check your .env.local file.',
      };
    }

    // Validasi ukuran file (max 10MB untuk free plan)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size exceeds 10MB limit. Please compress or use a smaller file.',
      };
    }

    // Validasi tipe file
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-wav',
      'video/mp4', 'video/webm'
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `File type "${file.type}" not allowed. Allowed types: Images (JPG, PNG, WebP, GIF), Audio (MP3, WAV, OGG), Video (MP4, WebM)`,
      };
    }

    // Create FormData untuk upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);
    // Set resource_type berdasarkan tipe file
    let resourceType = 'image';
    if (file.type.startsWith('video')) {
      resourceType = 'video';
    } else if (file.type.startsWith('audio')) {
      resourceType = 'video'; // Cloudinary menyimpan audio sebagai 'video' resource type
    }
    formData.append('resource_type', resourceType);
    // Parameter yang diizinkan untuk unsigned upload
    formData.append('public_id', `invitation-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`);

    // Upload ke Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();

    // Simulasi progress 100% karena Cloudinary tidak support progress callback
    onProgress?.({ progress: 100 });

    return {
      success: true,
      url: data.secure_url,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return { success: false, error: errorMessage };
  }
};

/**
 * Generate Cloudinary URL dengan transformations
 * @param url - URL original dari Cloudinary
 * @param transformations - Transformasi yang diinginkan
 * @returns URL dengan transformations
 */
export const getTransformedUrl = (
  url: string,
  transformations: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  } = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const transforms: string[] = [];

  if (transformations.width) transforms.push(`w_${transformations.width}`);
  if (transformations.height) transforms.push(`h_${transformations.height}`);
  if (transformations.quality) transforms.push(`q_${transformations.quality}`);
  if (transformations.format) transforms.push(`f_${transformations.format}`);
  if (transformations.crop) transforms.push(`c_${transformations.crop}`);

  if (transforms.length === 0) return url;

  // Insert transformations before 'upload' in the URL
  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
};

/**
 * Get optimized image URL for gallery thumbnails
 */
export const getThumbnailUrl = (url: string): string => {
  return getTransformedUrl(url, {
    width: 300,
    height: 300,
    quality: 'auto',
    crop: 'fill',
  });
};

/**
 * Get optimized image URL for full-size images
 */
export const getFullSizeUrl = (url: string): string => {
  return getTransformedUrl(url, {
    width: 1200,
    quality: 'auto:good',
    format: 'auto',
  });
};

/**
 * Delete file dari Cloudinary (memerlukan server-side API)
 * Note: Untuk keamanan, delete operation harus dilakukan di server-side
 */
export const deleteFromCloudinary = async (
  publicId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Delete operation memerlukan server-side call dengan API secret
    // Implementasi ada di API route: /api/cloudinary/delete
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Delete failed');
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Delete failed';
    return { success: false, error: errorMessage };
  }
};

/**
 * Extract public ID dari Cloudinary URL
 */
export const getPublicIdFromUrl = (url: string): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return '';
  }

  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-z]+$/);
  return match ? match[1] : '';
};

/**
 * Get file size dari URL (estimate)
 */
export const estimateFileSize = (url: string): string => {
  if (!url) return 'Unknown';
  
  if (url.includes('video')) {
    return '~5-10 MB';
  }
  
  if (url.includes('w_300')) {
    return '~50 KB';
  }
  
  if (url.includes('w_1200')) {
    return '~500 KB';
  }
  
  return '~1-2 MB';
};

export default {
  uploadToCloudinary,
  getTransformedUrl,
  getThumbnailUrl,
  getFullSizeUrl,
  deleteFromCloudinary,
  getPublicIdFromUrl,
  estimateFileSize,
};
