import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementActive
} from '../../../api/announcementApi';

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
  updated_at: string;
}

export const AdminAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    announcement_type: 'general',
    priority: 'normal',
    is_active: true,
    start_date: '',
    end_date: ''
  });

  const announcementTypes = [
    { value: 'general', label: 'General' },
    { value: 'mass', label: 'Mass Schedule' },
    { value: 'event', label: 'Event' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  // Load announcements
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await getAllAnnouncements();
      
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      const announcementData = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      };

      let response;
      if (editingAnnouncement) {
        response = await updateAnnouncement(editingAnnouncement.id, announcementData);
      } else {
        response = await createAnnouncement(announcementData);
      }

      if (response.data.success) {
        toast.success(`Announcement ${editingAnnouncement ? 'updated' : 'created'} successfully`);
        setShowAddDialog(false);
        setEditingAnnouncement(null);
        resetForm();
        loadAnnouncements();
      } else {
        toast.error(`Failed to ${editingAnnouncement ? 'update' : 'create'} announcement`);
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error(`Failed to ${editingAnnouncement ? 'update' : 'create'} announcement`);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      const response = await deleteAnnouncement(id);
      
      if (response.data.success) {
        toast.success('Announcement deleted successfully');
        setDeleteConfirm(null);
        loadAnnouncements();
      } else {
        toast.error('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  // Handle toggle active
  const handleToggleActive = async (id: number) => {
    try {
      const response = await toggleAnnouncementActive(id);
      
      if (response.data.success) {
        toast.success('Announcement status updated');
        loadAnnouncements();
      } else {
        toast.error('Failed to update announcement status');
      }
    } catch (error) {
      console.error('Error toggling announcement status:', error);
      toast.error('Failed to update announcement status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      announcement_type: 'general',
      priority: 'normal',
      is_active: true,
      start_date: '',
      end_date: ''
    });
  };

  // Handle edit
  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      announcement_type: announcement.announcement_type,
      priority: announcement.priority,
      is_active: announcement.is_active,
      start_date: announcement.start_date ? announcement.start_date.split('T')[0] : '',
      end_date: announcement.end_date ? announcement.end_date.split('T')[0] : ''
    });
    setShowAddDialog(true);
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Filter announcements
  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(announcement => 
        filter === 'active' ? announcement.is_active : !announcement.is_active
      );

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800 border-0">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 border-0">High</Badge>;
      case 'normal':
        return <Badge className="bg-blue-100 text-blue-800 border-0">Normal</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800 border-0">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-0">{priority}</Badge>;
    }
  };

  // Get status counts
  const statusCounts = {
    all: announcements.length,
    active: announcements.filter(a => a.is_active).length,
    inactive: announcements.filter(a => !a.is_active).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3 text-green-700">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg font-medium">Loading announcements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Announcements Management</h1>
            <p className="text-gray-600">Create and manage important announcements for your shrine</p>
          </div>
          
          <Button 
            onClick={() => {
              setEditingAnnouncement(null);
              resetForm();
              setShowAddDialog(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Announcement
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-green-700">Total</p>
                <Megaphone className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-800">{statusCounts.all}</p>
              <p className="text-xs text-green-600 mt-1">All announcements</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-700">Active</p>
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-800">{statusCounts.active}</p>
              <p className="text-xs text-blue-600 mt-1">Visible to public</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-red-700">Inactive</p>
                <EyeOff className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-800">{statusCounts.inactive}</p>
              <p className="text-xs text-red-600 mt-1">Hidden from public</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <Card className="mb-6 border-0 shadow-sm bg-green-50">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All', count: statusCounts.all },
                { key: 'active', label: 'Active', count: statusCounts.active },
                { key: 'inactive', label: 'Inactive', count: statusCounts.inactive },
              ].map(({ key, label, count }) => (
                <Button
                  key={key}
                  variant={filter === key ? 'default' : 'ghost'}
                  onClick={() => setFilter(key)}
                  className={filter === key 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-white text-green-700 hover:bg-green-100 border-0'
                  }
                >
                  {label} ({count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        {filteredAnnouncements.length > 0 ? (
          <div className="space-y-6">
            {filteredAnnouncements.map(announcement => (
              <Card key={announcement.id} className="border-0 shadow-sm hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(announcement.priority)}
                          <Badge className="bg-green-100 text-green-800 border-0 capitalize">
                            {announcement.announcement_type}
                          </Badge>
                          {!announcement.is_active && (
                            <Badge className="bg-red-100 text-red-700 border-0">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {new Date(announcement.created_at).toLocaleDateString()}</span>
                        </div>
                        {announcement.end_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Expires: {new Date(announcement.end_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {announcement.content.length > 200 
                          ? `${announcement.content.substring(0, 200)}...` 
                          : announcement.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleActive(announcement.id)}
                      className="bg-green-100 text-green-700 hover:bg-green-200 border-0"
                    >
                      {announcement.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(announcement)}
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteConfirm(announcement.id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 border-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm bg-green-50">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Megaphone className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No announcements found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Create your first announcement to get started.'
                  : `No ${filter} announcements found.`
                }
              </p>
              {filter === 'all' && (
                <Button 
                  onClick={() => {
                    setEditingAnnouncement(null);
                    resetForm();
                    setShowAddDialog(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Announcement
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-green-800">
                {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter announcement title"
                  className="border-0 bg-white focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter announcement content"
                  className="border-0 bg-white focus:ring-2 focus:ring-green-400"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.announcement_type} onValueChange={(value) => setFormData(prev => ({ ...prev, announcement_type: value }))}>
                    <SelectTrigger className="border-0 bg-white focus:ring-2 focus:ring-green-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {announcementTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="border-0 bg-white focus:ring-2 focus:ring-green-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date (Optional)</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="border-0 bg-white focus:ring-2 focus:ring-green-400"
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="border-0 bg-white focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active (visible to public)</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowAddDialog(false);
                    setEditingAnnouncement(null);
                    resetForm();
                  }}
                  className="bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  {editingAnnouncement ? 'Update' : 'Create'} Announcement
                </Button>
              </div>
            </form>
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
                  <p className="text-sm text-red-600">The announcement will be permanently deleted.</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
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