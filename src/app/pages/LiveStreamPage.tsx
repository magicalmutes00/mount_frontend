import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useShrineData } from '../context/ShrineDataContext';
import { useLanguage } from '../context/LanguageContext';
import { livestreamApi } from '../../api/livestreamApi';
import { 
  Radio, 
  Clock, 
  Calendar, 
  Users, 
  Play, 
  Volume2, 
  Maximize, 
  Bell,
  Heart,
  MessageCircle,
  Eye,
  ExternalLink,
  X
} from 'lucide-react';
import { QuickNotifyButton } from '../components/StreamEmailNotification';

interface LivestreamData {
  id: number;
  title: string;
  description?: string;
  stream_url: string;
  thumbnail_url?: string;
  is_active: boolean;
  is_scheduled: boolean;
  scheduled_at?: string;
  started_at?: string;
  viewer_count: number;
  max_viewers: number;
}

// Default mass timings to show immediately
const DEFAULT_MASS_TIMINGS = [
  { name: 'livestream.morning.mass', time: 'livestream.morning.time', type: 'daily' },
  { name: 'livestream.evening.mass', time: 'livestream.evening.time', type: 'daily' },
  { name: 'livestream.sunday.mass', time: 'livestream.sunday.time', type: 'sunday' }
];

const DEFAULT_SPECIAL_EVENTS = [
  { name: 'livestream.feast.day', date: 'livestream.feast.coverage' },
  { name: 'livestream.friday.adoration', date: 'livestream.friday.time' },
  { name: 'livestream.holy.week', date: 'livestream.extended.coverage' }
];

// Helper function to convert YouTube URL to proper embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already an embed URL, return as is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  // Handle youtube.com/watch?v=VIDEO_ID
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  }
  // Handle youtu.be/VIDEO_ID
  else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  }
  // Handle youtube.com/live/VIDEO_ID
  else if (url.includes('youtube.com/live/')) {
    videoId = url.split('live/')[1]?.split('?')[0];
  }
  
  if (videoId) {
    // Return proper embed URL with mobile-optimized parameters
    // Enhanced mobile controls support
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&showinfo=1&rel=0&modestbranding=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&enablejsapi=1&playsinline=1&origin=${window.location.origin}`;
  }
  
  return url;
};

// Helper function to get YouTube video ID from URL
const getYouTubeVideoId = (url: string): string => {
  if (!url) return '';
  
  let videoId = '';
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/live/')) {
    videoId = url.split('live/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('embed/')[1]?.split('?')[0];
  }
  
  return videoId;
};
export const LiveStreamPage: React.FC = () => {
  const { siteContent } = useShrineData();
  const { language, t } = useLanguage();
  const [activeStream, setActiveStream] = useState<LivestreamData | null>(null);
  const [upcomingStreams, setUpcomingStreams] = useState<LivestreamData[]>([]);
  const [recentStreams, setRecentStreams] = useState<LivestreamData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [videoContainerRef, setVideoContainerRef] = useState<HTMLDivElement | null>(null);

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

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
  }, []);

  // Enhanced fullscreen functionality
  const toggleFullscreen = useCallback(async () => {
    if (!videoContainerRef) return;

    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await videoContainerRef.requestFullscreen();
        setIsFullscreen(true);
        
        // DO NOT lock orientation - let user control it
        // This prevents auto-rotation to landscape
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      // Fallback for browsers that don't support fullscreen API
      setIsFullscreen(!isFullscreen);
    }
  }, [videoContainerRef, isFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Manage body class for scroll prevention
      if (isCurrentlyFullscreen) {
        document.body.classList.add('fullscreen-active');
      } else {
        document.body.classList.remove('fullscreen-active');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      // Clean up body class on unmount
      document.body.classList.remove('fullscreen-active');
    };
  }, []);

  // Handle escape key for fullscreen exit
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, toggleFullscreen]);

  // Share functionality
  const handleShare = useCallback((stream: LivestreamData) => {
    const videoId = getYouTubeVideoId(stream.stream_url);
    const shareUrl = videoId ? `https://youtu.be/${videoId}` : stream.stream_url;
    
    if (navigator.share) {
      navigator.share({
        title: stream.title,
        text: `Watch live: ${stream.title}`,
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }, []);

  // Open YouTube in new tab for full features
  const openInYouTube = useCallback((stream: LivestreamData) => {
    const videoId = getYouTubeVideoId(stream.stream_url);
    const youtubeUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : stream.stream_url;
    window.open(youtubeUrl, '_blank');
  }, []);

  // Memoize format functions to prevent recreation
  const formatDateTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const formatTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  const getTimeUntilStream = useCallback((scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff <= 0) return 'Starting now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `Starts in ${hours}h ${minutes}m`;
    }
    return `Starts in ${minutes}m`;
  }, []);

  // Fetch data function
  const fetchLivestreamData = useCallback(async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    
    try {
      setLoading(true);
      
      // Fetch all data in parallel for better performance
      const [activeResponse, upcomingResponse, recentResponse] = await Promise.allSettled([
        livestreamApi.getActive(),
        livestreamApi.getUpcoming(),
        livestreamApi.getRecent(6)
      ]);

      // Handle active stream
      if (activeResponse.status === 'fulfilled' && activeResponse.value.success) {
        setActiveStream(activeResponse.value.data);
      }

      // Handle upcoming streams
      if (upcomingResponse.status === 'fulfilled' && upcomingResponse.value.success) {
        setUpcomingStreams(upcomingResponse.value.data);
      }

      // Handle recent streams
      if (recentResponse.status === 'fulfilled' && recentResponse.value.success) {
        setRecentStreams(recentResponse.value.data);
      }

      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching livestream data:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Refresh active stream only
  const refreshActiveStream = useCallback(async () => {
    try {
      const activeResponse = await livestreamApi.getActive();
      if (activeResponse.success) {
        setActiveStream(activeResponse.data);
      }
    } catch (error) {
      console.error('Error refreshing active stream:', error);
    }
  }, []);

  useEffect(() => {
    // Initial load with small delay to let page render
    const timer = setTimeout(fetchLivestreamData, 100);

    // Refresh active stream data every 30 seconds
    const interval = setInterval(refreshActiveStream, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchLivestreamData, refreshActiveStream]);

  // Memoize YouTube URL
  const youtubeUrl = useMemo(() => {
    return siteContent?.youtubeUrl || 'https://www.youtube.com/@devasahayammountshrine5677';
  }, [siteContent?.youtubeUrl]);

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className={`flex flex-col items-center justify-center gap-3 mb-4 sm:mb-6 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            <h1 className={getTamilHeadingClass("text-2xl sm:text-4xl font-bold bg-gradient-to-r from-green-800 to-blue-800 bg-clip-text text-transparent text-center")}>
              {t('livestream.title')}
            </h1>
          </div>
          <p className={getTamilClass(`text-gray-700 max-w-2xl mx-auto text-base sm:text-lg px-4 ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`)}>
            {t('livestream.subtitle')}
          </p>
          {loading && !dataLoaded && (
            <div className={`mt-2 text-sm text-green-600 ${isVisible ? 'animate-fadeInUp stagger-3' : 'opacity-0'}`}>Loading stream information...</div>
          )}
        </div>

        {/* Active Stream Section */}
        {activeStream ? (
          <div className={`mb-8 sm:mb-12 ${isVisible ? 'animate-scaleIn stagger-1' : 'opacity-0'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <Badge className="bg-red-600 text-white px-2 py-0.5 text-xs font-medium animate-pulse-custom w-fit">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1.5"></div>
                {t('livestream.live.now')}
              </Badge>
              <div className={getTamilClass("flex items-center gap-1 text-gray-600 text-sm sm:text-base")}>
                <Users className="w-4 h-4" />
                <span>{activeStream.viewer_count} {t('livestream.watching')}</span>
              </div>
            </div>

            <Card className="border-2 border-red-200 shadow-2xl overflow-hidden card-hover">
              <CardContent className="p-0">
                {/* Video Player */}
                <div 
                  ref={setVideoContainerRef}
                  className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'aspect-video'} touch-manipulation`}
                >
                  <iframe
                    src={getYouTubeEmbedUrl(activeStream.stream_url)}
                    title={activeStream.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    style={{
                      border: 'none',
                      outline: 'none'
                    }}
                    // Enhanced mobile control support
                    sandbox="allow-same-origin allow-scripts allow-presentation allow-forms allow-popups"
                  />
                  
                  {/* Enhanced Video Controls Overlay - Mobile optimized */}
                  <div className={`absolute bottom-1 sm:bottom-4 left-1 sm:left-4 right-1 sm:right-4 flex items-center justify-between bg-black bg-opacity-70 rounded-md sm:rounded-lg p-1.5 sm:p-3 transition-opacity duration-300 ${isFullscreen ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                    <div className="flex items-center gap-1 sm:gap-3">
                      <div className="flex items-center gap-1 text-white text-xs sm:text-sm">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="hidden xs:inline">{t('livestream.live.now')}</span>
                        <span className="xs:hidden">●</span>
                      </div>
                      <div className="flex items-center gap-1 text-white text-xs sm:text-sm">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">{activeStream.viewer_count}</span>
                        <span className="xs:hidden">{activeStream.viewer_count > 999 ? `${Math.floor(activeStream.viewer_count/1000)}k` : activeStream.viewer_count}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-0.5 sm:gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-6 w-6 sm:p-2 sm:h-8 sm:w-8"
                        onClick={() => openInYouTube(activeStream)}
                        title="Open in YouTube (for chat and full features)"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-6 w-6 sm:p-2 sm:h-8 sm:w-8"
                        onClick={toggleFullscreen}
                        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                      >
                        <Maximize className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Fullscreen Exit Button - Mobile */}
                  {isFullscreen && (
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-4 right-4 z-60 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200 sm:hidden"
                      title="Exit fullscreen"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Stream Info */}
                <div className="p-3 sm:p-6 bg-gradient-to-r from-red-50 to-pink-50">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">{activeStream.title}</h2>
                      {activeStream.description && (
                        <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base line-clamp-2">{activeStream.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{t('livestream.started')} {activeStream.started_at ? formatTime(activeStream.started_at) : '3:41 PM'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{t('livestream.peak')} {activeStream.max_viewers} {t('livestream.viewers')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                      {/* Mobile: Compact icons in single line */}
                      <div className="flex sm:hidden gap-1 justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-200 text-red-700 hover:bg-red-50 p-1.5 h-7 w-7 text-xs"
                          onClick={() => openInYouTube(activeStream)}
                          title="Chat on YouTube"
                        >
                          <MessageCircle className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-200 text-red-700 hover:bg-red-50 p-1.5 h-7 w-7 text-xs"
                          onClick={() => openInYouTube(activeStream)}
                          title="Full Features"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {/* Desktop: Text with icons */}
                      <div className="hidden sm:flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={getTamilButtonClass("border-red-200 text-red-700 hover:bg-red-50 text-xs sm:text-sm")}
                          onClick={() => openInYouTube(activeStream)}
                        >
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {t('livestream.chat.youtube')}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={getTamilButtonClass("border-red-200 text-red-700 hover:bg-red-50 text-xs sm:text-sm")}
                          onClick={() => openInYouTube(activeStream)}
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {t('livestream.full.features')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* No Active Stream */
          <div className={`mb-8 sm:mb-12 ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50 card-hover">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Live Stream Currently</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">Check back during mass times or special events</p>
                <QuickNotifyButton 
                  streamTitle="Live Mass Streams" 
                  streamTime="Get notified when we go live"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upcoming Streams */}
        {upcomingStreams.length > 0 && (
          <div className={`mb-8 sm:mb-12 ${isVisible ? 'animate-slideInLeft stagger-1' : 'opacity-0'}`}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 px-2 sm:px-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 animate-float" />
              Upcoming Streams
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {upcomingStreams.map((stream, index) => (
                <Card key={stream.id} className={`border-green-200 hover:shadow-lg transition-shadow card-hover ${isVisible ? `animate-scaleIn stagger-${index + 2}` : 'opacity-0'}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{stream.title}</h3>
                        {stream.description && (
                          <p className="text-xs sm:text-sm text-gray-600 mb-3">{stream.description}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="border-green-200 text-green-700 text-xs w-fit">
                        {stream.scheduled_at ? getTimeUntilStream(stream.scheduled_at) : 'Soon'}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="break-words">{stream.scheduled_at ? formatDateTime(stream.scheduled_at) : 'Time TBA'}</span>
                        </div>
                      </div>
                      <QuickNotifyButton 
                        streamTitle={stream.title}
                        streamTime={stream.scheduled_at ? formatDateTime(stream.scheduled_at) : 'Time TBA'}
                        className="text-xs h-8 px-3 border-green-200 text-green-700 hover:bg-green-50 bg-transparent border w-fit"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Mass Timings */}
        <div className={`grid gap-4 sm:gap-6 lg:grid-cols-2 mb-8 sm:mb-12 ${isVisible ? 'animate-slideInRight stagger-1' : 'opacity-0'}`}>
          <Card className="border-green-200 card-hover">
            <CardHeader className="pb-4">
              <CardTitle className={getTamilHeadingClass("flex items-center gap-2 text-green-800 text-lg sm:text-xl")}>
                <Clock className="w-5 h-5 animate-float" />
                {t('livestream.daily.timings')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {DEFAULT_MASS_TIMINGS.map((mass, index) => (
                  <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
                    mass.type === 'sunday' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    <span className={getTamilClass("text-gray-700 font-medium text-sm sm:text-base")}>{t(mass.name)}</span>
                    <Badge variant="outline" className={`text-xs sm:text-sm ${
                      mass.type === 'sunday' ? 'border-blue-200 text-blue-700' : 'border-green-200 text-green-700'
                    }`}>
                      {t(mass.time)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 card-hover">
            <CardHeader className="pb-4">
              <CardTitle className={getTamilHeadingClass("flex items-center gap-2 text-green-800 text-lg sm:text-xl")}>
                <Calendar className="w-5 h-5 animate-float" style={{animationDelay: '0.5s'}} />
                {t('livestream.special.events')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {DEFAULT_SPECIAL_EVENTS.map((event, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <p className={getTamilClass("font-medium text-gray-900 mb-1 text-sm sm:text-base")}>{t(event.name)}</p>
                    <p className={getTamilClass("text-xs sm:text-sm text-gray-600")}>{t(event.date)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Streams */}
        {recentStreams.length > 0 && (
          <div className={`mb-8 sm:mb-12 ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 px-2 sm:px-0">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 animate-pulse-custom" />
              Recent Streams
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentStreams.map((stream, index) => (
                <Card key={stream.id} className={`border-green-200 hover:shadow-lg transition-shadow group card-hover ${isVisible ? `animate-scaleIn stagger-${index + 3}` : 'opacity-0'}`}>
                  <CardContent className="p-0">
                    {stream.thumbnail_url ? (
                      <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={stream.thumbnail_url}
                          alt={stream.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center rounded-t-lg">
                        <Radio className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
                      </div>
                    )}
                    
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">{stream.title}</h3>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{stream.max_viewers} views</span>
                        </div>
                        <span className="text-xs">{stream.started_at ? formatTime(stream.started_at) : 'Recently'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Channel Link */}
        <Card className={`border-green-200 bg-gradient-to-r from-green-50 to-blue-50 card-hover ${isVisible ? 'animate-scaleIn stagger-1' : 'opacity-0'}`}>
          <CardContent className="p-6 sm:p-8 text-center">
            <h3 className={getTamilHeadingClass("text-lg sm:text-xl font-semibold text-gray-900 mb-4")}>
              {t('livestream.youtube.channel')}
            </h3>
            <p className={getTamilClass("text-gray-600 mb-6 text-sm sm:text-base")}>
              {t('livestream.youtube.subscribe')}
            </p>
            <Button 
              className={getTamilButtonClass("bg-red-600 hover:bg-red-700 text-white")}
              onClick={() => window.open(youtubeUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('livestream.visit.channel')}
            </Button>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className={`border-green-200 mt-8 card-hover ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
          <CardHeader>
            <CardTitle className={getTamilHeadingClass("text-green-800 text-lg sm:text-xl")}>
              {t('livestream.important.info')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className={getTamilClass("space-y-2 text-gray-700 text-sm sm:text-base")}>
              <li>• {t('livestream.info.1')}</li>
              <li>• {t('livestream.info.2')}</li>
              <li>• {t('livestream.info.3')}</li>
              <li>• {t('livestream.info.4')}</li>
              <li>• {t('livestream.info.5')}</li>
              <li>• {t('livestream.info.6')}</li>
              <li>• {t('livestream.info.7')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Video Control Enhancement Styles */}
      <style>{`
        /* Enhanced mobile video controls */
        .touch-manipulation iframe {
          touch-action: manipulation;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Improve mobile video interaction */
        @media (max-width: 768px) {
          .touch-manipulation {
            -webkit-overflow-scrolling: touch;
            overflow: hidden;
          }
          
          .touch-manipulation iframe {
            pointer-events: auto;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        }

        /* Fullscreen mobile optimizations */
        .fullscreen-active {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        /* Tamil font sizing */
        .tamil-text {
          font-size: 0.85em;
        }

        .tamil-heading {
          font-size: 0.8em;
        }

        .tamil-button {
          font-size: 0.8em;
        }

        /* Animation classes */
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-custom {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        /* Stagger animations */
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}</style>
    </div>
  );
};