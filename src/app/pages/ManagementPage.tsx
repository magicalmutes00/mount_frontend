import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import ManagementApi from '../../api/managementApi';
import { 
  Users, 
  Phone, 
  Mail, 
  Eye,
  Share2,
  AlertCircle,
  RefreshCw,
  Calendar
} from 'lucide-react';

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    return `http://localhost:5000${imageUrl}`;
  }
  return imageUrl;
};

interface ManagementMember {
  id: number;
  name: string;
  position: string;
  description?: string;
  image_url?: string;
  phone?: string;
  email?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const ManagementPage: React.FC = () => {
  // State management
  const [members, setMembers] = useState<ManagementMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'leadership' | 'administration'>('all');
  const [selectedMember, setSelectedMember] = useState<ManagementMember | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Load management team data
  const loadManagementData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Load management team members from API
      const response = await ManagementApi.getAllActive();

      if (response.success) {
        const managementMembers = response.data || [];
        setMembers(managementMembers);
      } else {
        throw new Error(response.message || 'Failed to load management team');
      }

      setRetryCount(0);
    } catch (err) {
      console.error('Error loading management team:', err);
      setError(err instanceof Error ? err.message : 'Failed to load management team');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadManagementData();
  }, [loadManagementData]);

  // Retry mechanism
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    loadManagementData();
  }, [loadManagementData]);

  // Get filtered members based on active tab
  const filteredMembers = useMemo(() => {
    switch (activeTab) {
      case 'leadership':
        return members.filter(member => 
          member.position.toLowerCase().includes('priest') || 
          member.position.toLowerCase().includes('president') ||
          member.position.toLowerCase().includes('director')
        );
      case 'administration':
        return members.filter(member => 
          member.position.toLowerCase().includes('secretary') || 
          member.position.toLowerCase().includes('treasurer') ||
          member.position.toLowerCase().includes('coordinator')
        );
      case 'all':
      default:
        return members;
    }
  }, [members, activeTab]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  // Handle share
  const handleShare = async (member: ManagementMember) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${member.name} - ${member.position}`,
          text: member.description || `Meet ${member.name}, our ${member.position}`,
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

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-64 w-full" />
          <div className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </Card>
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
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(50px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-custom {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.6s ease-out forwards; }
        .animate-bounceIn { animation: bounceIn 1s ease-out forwards; }
        .animate-floatIn { animation: floatIn 0.8s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-custom { animation: pulse-custom 2s ease-in-out infinite; }
        
        .stagger-1 { animation-delay: 0.1s; animation-fill-mode: both; }
        .stagger-2 { animation-delay: 0.2s; animation-fill-mode: both; }
        .stagger-3 { animation-delay: 0.3s; animation-fill-mode: both; }
        .stagger-4 { animation-delay: 0.4s; animation-fill-mode: both; }
        .stagger-5 { animation-delay: 0.5s; animation-fill-mode: both; }
        
        .gallery-card {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
        }
        
        .gallery-card:hover {
          transform: translateY(-15px) rotateX(5deg) rotateY(5deg) scale(1.03);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 30px rgba(34, 197, 94, 0.2);
        }
        
        .floating-badge {
          animation: float 2s ease-in-out infinite;
        }
        
        .tab-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .hover-glow {
          transition: box-shadow 0.3s ease;
        }
        
        .hover-glow:hover {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
      `}</style>
      <div className="container mx-auto px-4 py-8">
        {/* Animated Header */}
        <div className={`text-center mb-8 ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Management Team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated leaders who guide our shrine community with wisdom and faith
          </p>
        </div>

        {/* Animated Filter Tabs */}
        <div className={`flex justify-center mb-8 ${isVisible ? 'animate-scaleIn stagger-2' : 'opacity-0'}`}>
          <div className="flex bg-green-50 rounded-lg p-1 gap-1 shadow-sm hover-glow border border-green-100">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                activeTab === 'all'
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md scale-105 tab-shimmer !bg-green-600'
                  : 'text-green-700 hover:text-green-800 hover:bg-green-100 bg-transparent'
              }`}
              style={activeTab === 'all' ? { backgroundColor: '#16a34a', color: 'white' } : {}}
            >
              All Members
            </button>
            
            <button
              onClick={() => setActiveTab('leadership')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
                activeTab === 'leadership'
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md scale-105 tab-shimmer !bg-green-600'
                  : 'text-green-700 hover:text-green-800 hover:bg-green-100 bg-transparent'
              }`}
              style={activeTab === 'leadership' ? { backgroundColor: '#16a34a', color: 'white' } : {}}
            >
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeTab === 'leadership' ? 'rotate-12' : 'hover:rotate-6'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Leadership
            </button>
            
            <button
              onClick={() => setActiveTab('administration')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
                activeTab === 'administration'
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md scale-105 tab-shimmer !bg-green-600'
                  : 'text-green-700 hover:text-green-800 hover:bg-green-100 bg-transparent'
              }`}
              style={activeTab === 'administration' ? { backgroundColor: '#16a34a', color: 'white' } : {}}
            >
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeTab === 'administration' ? 'scale-110 animate-pulse-custom' : 'hover:scale-110'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Administration
            </button>
          </div>
        </div>

        {/* Animated Management Team Content */}
        {loading ? (
          <div className={`${isVisible ? 'animate-fadeInUp stagger-3' : 'opacity-0'}`}>
            <LoadingSkeleton />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className={`text-center py-12 ${isVisible ? 'animate-bounceIn stagger-3' : 'opacity-0'}`}>
            <div className="text-gray-400 mb-4">
              <Users className="h-12 w-12 mx-auto animate-pulse-custom" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab === 'all' ? 'members' : activeTab} found
            </h3>
            <p className="text-gray-600">
              No {activeTab === 'all' ? 'team members' : activeTab + ' members'} are currently available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <Card 
                key={member.id}
                className={`overflow-hidden gallery-card cursor-pointer group bg-white hover:shadow-2xl hover:shadow-green-500/20 border-0 shadow-lg hover:-translate-y-2 ${
                  isVisible ? 'animate-floatIn' : 'opacity-0'
                }`}
                style={{animationDelay: `${0.3 + index * 0.1}s`}}
                onClick={() => setSelectedMember(member)}
              >
                <div className="relative">
                  {/* Premium Member Card */}
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={getImageUrl(member.image_url)}
                        alt={member.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Premium gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Premium view button with glow effect */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-300" />
                          <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-2xl">
                            <Eye className="h-6 w-6 text-gray-800" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Position badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg border-0 font-semibold floating-badge">
                          <Users className="h-3 w-3 mr-1" />
                          Team
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Premium hover effect border */}
                    <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-green-400/50 transition-colors duration-300 pointer-events-none" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gray-900 group-hover:text-green-700 transition-colors">
                      {member.name}
                    </h3>
                    
                    <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 font-medium">
                      {member.position}
                    </Badge>
                    
                    {member.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {member.description}
                      </p>
                    )}
                    
                    {/* Contact Info */}
                    {(member.phone || member.email) && (
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        {member.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-xs text-gray-500 space-x-3">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(member.created_at)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMember(member);
                        }}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-300 font-medium"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Premium Member Modal */}
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white border-0 shadow-2xl">
            {selectedMember && (
              <>
                <DialogHeader className="pb-4">
                  <DialogTitle className="flex items-center justify-between text-2xl font-bold text-gray-900">
                    <div className="flex items-center gap-3">
                      <span>{selectedMember.name}</span>
                      <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                        <Users className="h-3 w-3 mr-1" />
                        {selectedMember.position}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(selectedMember)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="relative">
                    {/* Member Photo */}
                    <div className="rounded-xl overflow-hidden shadow-xl">
                      <ImageWithFallback
                        src={getImageUrl(selectedMember.image_url)}
                        alt={selectedMember.name}
                        className="w-full max-h-[50vh] object-cover"
                      />
                    </div>
                  </div>
                  
                  {selectedMember.description && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border">
                      <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedMember.description}</p>
                    </div>
                  )}
                  
                  {/* Contact Information */}
                  {(selectedMember.phone || selectedMember.email) && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border">
                      <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                      <div className="space-y-3">
                        {selectedMember.phone && (
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                              <Phone className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium text-gray-900">{selectedMember.phone}</p>
                            </div>
                          </div>
                        )}
                        {selectedMember.email && (
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                              <Mail className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium text-gray-900">{selectedMember.email}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-lg p-4">
                    <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                      Management Team Member
                    </Badge>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">Joined {formatDate(selectedMember.created_at)}</span>
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