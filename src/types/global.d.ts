// Global type declarations
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Gallery types
interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  image_name: string;
  category: string;
  is_featured: boolean;
  file_type: string;
  created_at: string;
  type?: 'photo' | 'video';
}

interface VideoItem {
  id: number;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  category: string;
  created_at: string;
  duration?: string;
  views?: string;
}