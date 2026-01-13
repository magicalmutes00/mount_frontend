import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Megaphone, 
  AlertTriangle, 
  Info, 
  Calendar,
  Clock,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { getActiveAnnouncements } from '../../api/announcementApi';

interface Announcement {
  id: number;
  title: string;
  content: string;
  announcement_type: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  is_active: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
}

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Load announcements
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await getActiveAnnouncements();
      
      if (response.data.success) {
        setAnnouncements(response.data.data);
      } else {
        toast.error('Failed to load announcements');
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High Priority</Badge>;
      case 'normal':
        return <Badge className="bg-blue-100 text-blue-800">Normal</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'normal':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'low':
        return <Info className="w-5 h-5 text-gray-600" />;
      default:
        return <Megaphone className="w-5 h-5 text-green-600" />;
    }
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    const typeColors = {
      general: 'bg-green-100 text-green-800',
      mass: 'bg-purple-100 text-purple-800',
      event: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      emergency: 'bg-red-100 text-red-800',
    };
    
    const colorClass = typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800';
    
    return (
      <Badge className={colorClass}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-green-700">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading announcements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Megaphone className="w-8 h-8 text-green-700" />
            <h1 className="text-4xl font-bold text-green-800">Important Announcements</h1>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Stay updated with the latest news, events, and important information from our shrine
          </p>
        </div>

        {/* Announcements List */}
        {announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map(announcement => (
              <Card 
                key={announcement.id} 
                className={`border-l-4 hover:shadow-lg transition-shadow ${
                  announcement.priority === 'urgent' 
                    ? 'border-l-red-500 border-red-200' 
                    : announcement.priority === 'high'
                    ? 'border-l-orange-500 border-orange-200'
                    : 'border-l-green-500 border-green-200'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getPriorityIcon(announcement.priority)}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {announcement.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Posted on {new Date(announcement.created_at).toLocaleDateString()}
                          </span>
                          {announcement.end_date && (
                            <>
                              <span>•</span>
                              <Clock className="w-4 h-4" />
                              <span>
                                Valid until {new Date(announcement.end_date).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(announcement.priority)}
                      {getTypeBadge(announcement.announcement_type)}
                    </div>
                  </div>

                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                  </div>

                  {announcement.priority === 'urgent' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          This is an urgent announcement. Please read carefully.
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-green-200">
            <CardContent className="p-12 text-center">
              <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Announcements</h3>
              <p className="text-gray-600">
                There are currently no active announcements. Please check back later for updates.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <div className="mt-12">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-green-800 font-semibold mb-2">Stay Informed</h4>
                  <p className="text-gray-700 mb-2">
                    We regularly post important announcements about:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-1 ml-4">
                    <li>• Special mass schedules and religious events</li>
                    <li>• Shrine maintenance and facility updates</li>
                    <li>• Festival celebrations and community gatherings</li>
                    <li>• Emergency notices and safety information</li>
                    <li>• Changes to visiting hours or accessibility</li>
                  </ul>
                  <p className="text-gray-700 mt-3 text-sm">
                    Please check this page regularly or contact us directly for the most current information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};