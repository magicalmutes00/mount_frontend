import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Download, Share2, Calendar, Star } from 'lucide-react';

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

interface GalleryModalProps {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (item: GalleryItem) => void;
  onShare?: (item: GalleryItem) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  item,
  isOpen,
  onClose,
  onDownload,
  onShare
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{item.title}</span>
            <div className="flex gap-2">
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(item)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              )}
              {onShare && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare(item)}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <ImageWithFallback
              src={item.image_url}
              alt={item.title}
              className="w-full max-h-[60vh] object-contain rounded-lg"
            />
          </div>
          
          {item.description && (
            <p className="text-gray-700">{item.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Badge variant="outline">{item.category}</Badge>
            {item.is_featured && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(item.created_at)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;