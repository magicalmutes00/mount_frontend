import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { 
  Upload, 
  Users,
  Trash2, 
  Eye, 
  EyeOff, 
  Plus,
  Loader2,
  X,
  Filter,
  Search,
  Grid3X3,
  List,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  Image as ImageIcon,
  Edit
} from 'lucide-react';
import ManagementApi from '../../../api/managementApi';
import { toast } from 'sonner';

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '/person-placeholder.svg';
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
  image_name?: string;
  image_size?: number;
  image_type?: string;
  phone?: string;
  email?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const AdminManagementPage: React.FC = () => {
  const [members, setMembers] = useState<ManagementMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<ManagementMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<ManagementMember | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    description: '',
    phone: '',
    email: '',
    display_order: 0,
    is_active: true,
    file: null as File | null
  });

  const positions = [
    { value: 'Parish Priest', label: 'Parish Priest' },
    { value: 'Assistant Priest', label: 'Assistant Priest' },
    { value: 'President', label: 'President' },
    { value: 'Vice President', label: 'Vice President' },
    { value: 'Secretary', label: 'Secretary' },
    { value: 'Treasurer', label: 'Treasurer' },
    { value: 'Coordinator', label: 'Coordinator' },
    { value: 'Director', label: 'Director' }
  ];

  // Load data on component mount
  useEffect(() => {
    loadMembers();
    loadStats();
  }, []);

  // Filter members based on position and search
  useEffect(() => {
    let filtered = members;
    
    if (selectedPosition !== 'all') {
      filtered = filtered.filter(member => 
        member.position.toLowerCase().includes(selectedPosition.toLowerCase())
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMembers(filtered);
  }, [members, selectedPosition, searchTerm]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await ManagementApi.getAll();
      
      if (response.success) {
        setMembers(response.data);
      } else {
        toast.error('Failed to load management team members');
      }
    } catch (error) {
      console.error('Error loading management team:', error);
      toast.error('Failed to load management team members');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await ManagementApi.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    setFormData(prev => ({ ...prev, file }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Please provide a name');
      return;
    }

    if (!formData.position.trim()) {
      toast.error('Please provide a position');
      return;
    }

    try {
      setUploading(true);
      
      let memberData: any = {
        name: formData.name,
        position: formData.position,
        description: formData.description,
        phone: formData.phone,
        email: formData.email,
        display_order: formData.display_order,
        is_active: formData.is_active
      };

      // Handle image upload if file is selected
      if (formData.file) {
        const base64Data = await ManagementApi.fileToBase64(formData.file);
        memberData.image_data = base64Data;
      }

      let response;
      if (editingMember) {
        response = await ManagementApi.update(editingMember.id, memberData);
      } else {
        response = await ManagementApi.create(memberData);
      }
      
      if (response.success) {
        toast.success(editingMember ? 'Member updated successfully!' : 'Member added successfully!');
        setShowAddDialog(false);
        resetForm();
        loadMembers();
        loadStats();
      } else {
        throw new Error(response.message || 'Failed to save member');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      const errorMessage = error.message || 'Failed to save member';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await ManagementApi.delete(id);
      
      if (response.success) {
        toast.success('Member deleted successfully');
        setDeleteConfirm(null);
        loadMembers();
        loadStats();
      } else {
        toast.error('Failed to delete member');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete member');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      const response = await ManagementApi.toggleActive(id);
      if (response.success) {
        toast.success('Status updated successfully');
        loadMembers();
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update status');
    }
  };

  const openEditDialog = (member: ManagementMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      description: member.description || '',
      phone: member.phone || '',
      email: member.email || '',
      display_order: member.display_order,
      is_active: member.is_active,
      file: null
    });
    setShowAddDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      description: '',
      phone: '',
      email: '',
      display_order: 0,
      is_active: true,
      file: null
    });
    setEditingMember(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3 text-green-700">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg font-medium">Loading management team...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Management Team</h1>
            <p className="text-gray-600">Manage your shrine's leadership and team members</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="bg-green-100 text-green-700 hover:bg-green-200"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
            
            <Button 
              onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-green-700">Total Members</p>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-800">{stats.total}</p>
                <p className="text-xs text-green-600 mt-1">All team members</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-blue-700">Active</p>
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-800">{stats.active}</p>
                <p className="text-xs text-blue-600 mt-1">Visible to public</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-purple-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-purple-700">Inactive</p>
                  <EyeOff className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-800">{stats.inactive}</p>
                <p className="text-xs text-purple-600 mt-1">Hidden members</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-sm bg-green-50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                  <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 bg-white focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
              
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger className="w-full lg:w-48 border-0 bg-white focus:ring-2 focus:ring-green-400">
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map(pos => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Members Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map(member => (
              <Card key={member.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl">
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  {member.image_url ? (
                    <img
                      src={getImageUrl(member.image_url)}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                      <Users className="w-16 h-16 text-green-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 flex gap-1">
                    {!member.is_active && (
                      <Badge className="bg-red-500/90 text-white border-0 backdrop-blur-sm">
                        <EyeOff className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/90 text-blue-700 hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
                        onClick={() => openEditDialog(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/90 text-green-700 hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
                        onClick={() => handleToggleActive(member.id)}
                      >
                        {member.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/90 text-red-600 hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
                        onClick={() => setDeleteConfirm(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-1 text-lg truncate">{member.name}</h4>
                    <p className="text-sm text-green-700 font-medium mb-3 bg-green-50 px-3 py-1 rounded-full inline-block">{member.position}</p>
                    {member.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{member.description}</p>
                    )}
                    
                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      {member.phone && (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                          <Phone className="w-3 h-3" />
                          <span className="truncate">{member.phone}</span>
                        </div>
                      )}
                      {member.email && (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <Badge className={`border-0 ${member.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">Order: {member.display_order}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredMembers.map(member => (
              <Card key={member.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                      {member.image_url ? (
                        <img
                          src={getImageUrl(member.image_url)}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                          <Users className="w-10 h-10 text-green-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900 text-lg">{member.name}</h4>
                            <Badge className={`border-0 ${member.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {member.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-green-700 font-medium mb-3 bg-green-50 px-3 py-1 rounded-full inline-block">{member.position}</p>
                          {member.description && (
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{member.description}</p>
                          )}
                          
                          {/* Contact Info */}
                          <div className="flex items-center gap-6 text-xs text-gray-500 mb-2">
                            {member.phone && (
                              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                <Phone className="w-3 h-3" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                            {member.email && (
                              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                <Mail className="w-3 h-3" />
                                <span>{member.email}</span>
                              </div>
                            )}
                            <div className="bg-gray-50 px-3 py-1 rounded-full">
                              <span>Order: {member.display_order}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(member)}
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleActive(member.id)}
                              className="bg-green-50 text-green-700 hover:bg-green-100 hover:scale-105 transition-all duration-200"
                            >
                              {member.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteConfirm(member.id)}
                              className="bg-red-50 text-red-700 hover:bg-red-100 hover:scale-105 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredMembers.length === 0 && !loading && (
          <Card className="border-0 shadow-sm bg-green-50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedPosition !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Add your first team member to get started'
                }
              </p>
              {!searchTerm && selectedPosition === 'all' && (
                <Button 
                  onClick={() => {
                    resetForm();
                    setShowAddDialog(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Member
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add Member Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-green-800">
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* File Upload Area */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-green-300 hover:border-green-400 bg-green-25'
                }`}
              >
                {formData.file ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <ImageIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{formData.file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(formData.file.size)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                      className="bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Drop image here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports images (JPEG, PNG, GIF, WebP)
                      </p>
                      <p className="text-xs text-gray-400">Maximum file size: 10MB</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter member name"
                    className="border-0 bg-white focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="position">Position *</Label>
                  <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger className="border-0 bg-white focus:ring-2 focus:ring-green-400">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter member description"
                    rows={3}
                    className="border-0 bg-white focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                    className="border-0 bg-white focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                    className="border-0 bg-white focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="border-0 bg-white focus:ring-2 focus:ring-green-400"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active/Visible</Label>
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t bg-white">
              <Button
                variant="ghost"
                className="bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  setShowAddDialog(false);
                  resetForm();
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={uploading || !formData.name.trim() || !formData.position.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingMember ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {editingMember ? 'Update Member' : 'Add Member'}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-800">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">This action cannot be undone</p>
                  <p className="text-sm text-red-600">The team member and all associated data will be permanently deleted.</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  className="bg-gray-100 hover:bg-gray-200"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Permanently
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};