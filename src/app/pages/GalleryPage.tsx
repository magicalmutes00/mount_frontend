import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../context/LanguageContext';
import GalleryApi from '../../api/galleryApi';
import { 
  Calendar,
  Eye,
  Download,
  Share2,
  AlertCircle,
  RefreshCw,
  Play,
  Clock,
  Image as ImageIcon,
  Video as VideoIcon
} from 'lucide-react';

// Helper function to convert YouTube URL to embed format
const convertToEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // If already an embed URL, return as is
  if (url.includes('/embed/')) return url;
  
  // Convert YouTube watch URL to embed URL
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Convert YouTube short URL to embed URL
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // For other video URLs, return as is
  return url;
};

// Helper function to get video thumbnail
const getVideoThumbnail = (videoUrl: string): string => {
  // Extract YouTube video ID and get thumbnail
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    let videoId = '';
    
    if (videoUrl.includes('/embed/')) {
      videoId = videoUrl.split('/embed/')[1]?.split('?')[0];
    } else if (videoUrl.includes('watch?v=')) {
      videoId = videoUrl.split('v=')[1]?.split('&')[0];
    } else if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
    }
    
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  // Fallback thumbnail
  return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop';
};

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1758517936201-cb4b8fd39e71?w=400&h=300&fit=crop';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    return `http://localhost:5000${imageUrl}`;
  }
  return imageUrl;
};

// Types
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

export const GalleryPage: React.FC = () => {
  // State management
  const { language, t } = useLanguage();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'videos'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | VideoItem | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Tamil font size classes
  const getTamilClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-text` : baseClass;
  };

  const getTamilHeadingClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-heading` : baseClass;
  };

  const getTamilButtonClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-button` : baseClass;
  };

  // Load gallery data
  const loadGalleryData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Load gallery items from API
      const response = await GalleryApi.getPublicGallery();

      if (response.success) {
        const items = response.data || [];
        
        // Separate photos and videos
        const photos = items.filter((item: GalleryItem) => item.file_type !== 'video').map((item: GalleryItem) => ({
          ...item,
          type: 'photo' as const
        }));
        
        const videos = items.filter((item: any) => item.file_type === 'video').map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          video_url: convertToEmbedUrl(item.image_url), // Convert to embed URL
          thumbnail_url: getVideoThumbnail(item.image_url), // Get YouTube thumbnail
          category: item.category,
          created_at: item.created_at,
          duration: '0:00', // Default duration, can be enhanced later
          views: '0' // Default views, can be enhanced later
        }));
        
        setGalleryItems(photos);
        setVideoItems(videos);
      } else {
        throw new Error(response.message || 'Failed to load gallery');
      }

      setRetryCount(0);
    } catch (err) {
      console.error('Error loading gallery:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load gallery stats
  const loadStats = useCallback(async () => {
    // Remove stats loading since we're simplifying the UI
  }, []);

  // Initial load
  useEffect(() => {
    loadGalleryData();
    loadStats();
  }, [loadGalleryData, loadStats]);

  // Retry mechanism
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    loadGalleryData();
  }, [loadGalleryData]);

  // Get filtered items based on active tab
  const filteredItems = useMemo(() => {
    switch (activeTab) {
      case 'photos':
        return galleryItems;
      case 'videos':
        return videoItems;
      case 'all':
      default:
        return [...galleryItems, ...videoItems];
    }
  }, [galleryItems, videoItems, activeTab]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  // Handle item download
  const handleDownload = async (item: GalleryItem | VideoItem) => {
    try {
      if ('image_url' in item) {
        // Handle photo download
        const response = await fetch(item.image_url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.image_name || `${item.title}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error downloading item:', err);
    }
  };

  // Handle share
  const handleShare = async (item: GalleryItem | VideoItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description || item.title,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Check if item is a video
  const isVideo = (item: GalleryItem | VideoItem): item is VideoItem => {
    return 'video_url' in item;
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="break-inside-avoid mb-6">
          <Card className="overflow-hidden rounded-lg">
            <Skeleton className={`w-full ${
              i % 4 === 0 ? 'h-80' : i % 4 === 1 ? 'h-64' : i % 4 === 2 ? 'h-72' : 'h-60'
            }`} />
            <div className="p-4">
              <Skeleton className="h-5 w-3/4 mb-3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  );

  // Error state
  if (error && retryCount < 3) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={getTamilHeadingClass("text-4xl font-bold text-green-700 mb-4")}>
            {t('gallery.title')}
          </h1>
          <p className={getTamilClass("text-lg text-gray-600 max-w-2xl mx-auto")}>
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-green-700 hover:text-green-800 hover:bg-green-50'
              } ${getTamilButtonClass()}`}
            >
              {t('gallery.all')}
            </button>
            
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'photos'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-green-700 hover:text-green-800 hover:bg-green-50'
              } ${getTamilButtonClass()}`}
            >
              <ImageIcon className="w-4 h-4" />
              {t('gallery.photos')}
            </button>
            
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'videos'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-green-700 hover:text-green-800 hover:bg-green-50'
              } ${getTamilButtonClass()}`}
            >
              <VideoIcon className="w-4 h-4" />
              {t('gallery.videos')}
            </button>
          </div>
        </div>

        {/* Gallery Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              {activeTab === 'photos' ? (
                <ImageIcon className="h-16 w-16 mx-auto opacity-50" />
              ) : activeTab === 'videos' ? (
                <VideoIcon className="h-16 w-16 mx-auto opacity-50" />
              ) : (
                <ImageIcon className="h-16 w-16 mx-auto opacity-50" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No {activeTab === 'all' ? 'items' : activeTab} found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No {activeTab === 'all' ? 'sacred moments' : activeTab} have been shared yet. Check back soon for divine captures.
            </p>
          </div>
        ) : (
          /* Masonry Grid Layout */
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredItems.map((item, index) => (
              <div 
                key={`${isVideo(item) ? 'video' : 'photo'}-${item.id}`}
                className="break-inside-avoid mb-6"
              >
                <Card 
                  className="overflow-hidden cursor-pointer group bg-white hover:shadow-lg border-0 shadow-sm hover:-translate-y-1 transition-all duration-200 rounded-lg"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative">
                    {isVideo(item) ? (
                      /* Video Card */
                      <div className="relative group">
                        <div className="relative overflow-hidden">
                          <ImageWithFallback
                            src={item.thumbnail_url || getVideoThumbnail(item.video_url)}
                            alt={item.title}
                            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                              index % 3 === 0 ? 'h-80' : index % 3 === 1 ? 'h-64' : 'h-72'
                            }`}
                          />
                          
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-200" />
                          
                          {/* Play button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:bg-white group-hover:scale-110 transition-all duration-200 shadow-lg">
                              <Play className="h-6 w-6 text-gray-800 ml-0.5" />
                            </div>
                          </div>
                          
                          {/* Media type icon */}
                          <div className="absolute top-3 left-3">
                            <div className="bg-green-600 text-white rounded-full p-2 shadow-lg">
                              <VideoIcon className="h-4 w-4" />
                            </div>
                          </div>
                          
                          {/* Duration badge */}
                          {item.duration && (
                            <div className="absolute bottom-3 right-3">
                              <Badge className="bg-black/80 text-white border-0 backdrop-blur-sm font-medium text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {item.duration}
                              </Badge>
                            </div>
                          )}
                          
                          {/* View count */}
                          {item.views && (
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-white/90 text-gray-800 border-0 backdrop-blur-sm font-medium text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                {item.views}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Photo Card */
                      <div className="relative group">
                        <div className="relative overflow-hidden">
                          <ImageWithFallback
                            src={getImageUrl((item as GalleryItem).image_url)}
                            alt={item.title}
                            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                              index % 4 === 0 ? 'h-80' : index % 4 === 1 ? 'h-64' : index % 4 === 2 ? 'h-72' : 'h-60'
                            }`}
                          />
                          
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          
                          {/* Media type icon */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-green-600 text-white rounded-full p-2 shadow-lg">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          </div>
                          
                          {/* Hover title overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <h4 className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg">
                              {item.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Card Content */}
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg leading-tight text-gray-900 group-hover:text-green-700 transition-colors duration-200 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1.5" />
                          <span className="font-medium">{formatDate(item.created_at)}</span>
                        </div>
                        {isVideo(item) && item.views && (
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>{item.views}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-white border-0 shadow-2xl rounded-lg">
            {selectedItem && (
              <>
                <DialogHeader className="pb-6 border-b border-gray-100">
                  <DialogTitle className="flex items-center justify-between text-2xl font-semibold text-gray-900">
                    <div className="flex items-center gap-4">
                      <span className="line-clamp-1">{selectedItem.title}</span>
                      <Badge className={`${
                        isVideo(selectedItem) 
                          ? 'bg-green-600' 
                          : 'bg-blue-600'
                      } text-white border-0 font-medium`}>
                        {isVideo(selectedItem) ? (
                          <>
                            <VideoIcon className="h-3 w-3 mr-1" />
                            Video
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Photo
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {!isVideo(selectedItem) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(selectedItem)}
                          className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(selectedItem)}
                        className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-colors"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-2">
                  <div className="relative">
                    {isVideo(selectedItem) ? (
                      /* Video Player */
                      <div className="relative">
                        <div className="aspect-video rounded-lg overflow-hidden shadow-xl bg-black">
                          <iframe
                            src={convertToEmbedUrl(selectedItem.video_url)}
                            title={selectedItem.title}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                        {/* Video stats */}
                        <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-6">
                              {selectedItem.views && (
                                <div className="flex items-center text-gray-600">
                                  <Eye className="h-4 w-4 mr-2 text-green-600" />
                                  <span className="font-medium">{selectedItem.views} views</span>
                                </div>
                              )}
                              {selectedItem.duration && (
                                <div className="flex items-center text-gray-600">
                                  <Clock className="h-4 w-4 mr-2 text-green-600" />
                                  <span className="font-medium">{selectedItem.duration}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{formatDate(selectedItem.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Photo Display */
                      <div className="rounded-lg overflow-hidden shadow-xl bg-gray-50">
                        <ImageWithFallback
                          src={getImageUrl((selectedItem as GalleryItem).image_url)}
                          alt={selectedItem.title}
                          className="w-full max-h-[70vh] object-contain"
                        />
                      </div>
                    )}
                  </div>
                  
                  {selectedItem.description && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-1 h-6 bg-green-600 rounded-full mr-3"></div>
                        Description
                      </h4>
                      <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-green-600 text-white border-0 font-medium">
                        Sacred Gallery
                      </Badge>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="font-medium">Published {formatDate(selectedItem.created_at)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {selectedItem.id}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};