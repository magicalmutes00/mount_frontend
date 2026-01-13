import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Star, Eye, Download, Share2, Calendar } from 'lucide-react';

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
}

interface GalleryGridProps {
  items: GalleryItem[];
  viewMode?: 'grid' | 'list';
  onImageClick?: (item: GalleryItem) => void;
  onDownload?: (item: GalleryItem) => void;
  onShare?: (item: GalleryItem) => void;
  showActions?: boolean;
  className?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  viewMode = 'grid',
  onImageClick,
  onDownload,
  onShare,
  showActions = true,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="h-12 w-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <Eye className="h-6 w-6" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No images found
        </h3>
        <p className="text-gray-600">
          No images match your current criteria
        </p>
      </div>
    );
  }

  return (
    <div className={`${
      viewMode === 'grid'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
    } ${className}`}>
      {items.map((item) => (
        <Card 
          key={item.id} 
          className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
            viewMode === 'list' ? 'flex' : ''
          }`}
          onClick={() => onImageClick?.(item)}
        >
          <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
            <ImageWithFallback
              src={item.image_url}
              alt={item.title}
              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'
              }`}
            />
            {item.is_featured && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3" />
                </Badge>
              </div>
            )}
          </div>
          
          <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
              {showActions && (
                <div className="flex gap-1 ml-2">
                  {onDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(item);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                  {onShare && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(item);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {item.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <Badge variant="outline">{item.category}</Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(item.created_at)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GalleryGrid;