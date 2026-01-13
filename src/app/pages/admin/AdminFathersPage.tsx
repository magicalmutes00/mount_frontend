import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { 
  UserCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Crown,
  Heart,
  Star,
  Loader2,
  X,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Father {
  id: number;
  name: string;
  period?: string;
  category: 'parish_priest' | 'assistant_priest' | 'son_of_soil' | 'deacon';
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FatherFormData {
  name: string;
  period: string;
  category: 'parish_priest' | 'assistant_priest' | 'son_of_soil' | 'deacon';
  display_order: number;
}

const AdminFathersPage: React.FC = () => {
  const [fathers, setFathers] = useState<Father[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFather, setEditingFather] = useState<Father | null>(null);
  const [formData, setFormData] = useState<FatherFormData>({
    name: '',
    period: '',
    category: 'parish_priest',
    display_order: 0
  });
  const [stats, setStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoryLabels = {
    parish_priest: 'Parish Priests',
    assistant_priest: 'Assistant Priests',
    son_of_soil: 'Sons of Soil',
    deacon: 'Deacons'
  };

  const categoryIcons = {
    parish_priest: Crown,
    assistant_priest: UserCheck,
    son_of_soil: Heart,
    deacon: Star
  };

  useEffect(() => {
    fetchFathers();
    fetchStats();
  }, []);

  const fetchFathers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('shrine_admin_token');
      
      console.log('Fetching fathers with token:', token ? 'Token exists' : 'No token found');
      
      const response = await fetch('/api/fathers/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setFathers(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch fathers');
      }
    } catch (err) {
      console.error('Fetch fathers error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch fathers');
      toast.error('Failed to load fathers data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('shrine_admin_token');
      const response = await fetch('/api/fathers/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('shrine_admin_token');
      const url = editingFather 
        ? `/api/fathers/admin/${editingFather.id}`
        : '/api/fathers/admin';
      
      const method = editingFather ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingFather ? 'update' : 'create'} father`);
      }

      const data = await response.json();
      if (data.success) {
        await fetchFathers();
        await fetchStats();
        resetForm();
        setShowForm(false);
        toast.success(`Father ${editingFather ? 'updated' : 'created'} successfully!`);
      } else {
        throw new Error(data.message || 'Operation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEdit = (father: Father) => {
    setEditingFather(father);
    setFormData({
      name: father.name,
      period: father.period || '',
      category: father.category,
      display_order: father.display_order
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this father?')) {
      return;
    }

    try {
      const token = localStorage.getItem('shrine_admin_token');
      const response = await fetch(`/api/fathers/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete father');
      }

      const data = await response.json();
      if (data.success) {
        await fetchFathers();
        await fetchStats();
        toast.success('Father deleted successfully!');
      } else {
        throw new Error(data.message || 'Failed to delete father');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete father';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      period: '',
      category: 'parish_priest',
      display_order: 0
    });
    setEditingFather(null);
  };

  const filteredFathers = selectedCategory === 'all' 
    ? fathers 
    : fathers.filter(father => father.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-green-700">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading fathers...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Manage Fathers</h1>
            <p className="text-gray-600">Manage priests, deacons, and sons of soil</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-green-700 hover:bg-green-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Father
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-700 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total Fathers</p>
                  <Users className="w-5 h-5 text-green-700" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">All categories</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Parish Priests</p>
                  <Crown className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.parish_priests}</p>
                <p className="text-xs text-gray-500 mt-1">Leading the parish</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Assistant Priests</p>
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.assistant_priests}</p>
                <p className="text-xs text-gray-500 mt-1">Supporting ministry</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Sons of Soil & Deacons</p>
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{parseInt(stats.sons_of_soil) + parseInt(stats.deacons)}</p>
                <p className="text-xs text-gray-500 mt-1">Local servants</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                Filter by Category:
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="parish_priest">Parish Priests</SelectItem>
                  <SelectItem value="assistant_priest">Assistant Priests</SelectItem>
                  <SelectItem value="son_of_soil">Sons of Soil</SelectItem>
                  <SelectItem value="deacon">Deacons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-green-800">
                {editingFather ? 'Edit Father' : 'Add New Father'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter father's name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="period" className="text-sm font-medium text-gray-700">
                  Period
                </Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  placeholder="e.g., 19.05.1961 – 06.12.1971"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: any) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parish_priest">Parish Priest</SelectItem>
                    <SelectItem value="assistant_priest">Assistant Priest</SelectItem>
                    <SelectItem value="son_of_soil">Son of Soil</SelectItem>
                    <SelectItem value="deacon">Deacon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="display_order" className="text-sm font-medium text-gray-700">
                  Display Order
                </Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                  min="0"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white"
                >
                  {editingFather ? 'Update Father' : 'Add Father'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Fathers Table */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Users className="w-5 h-5" />
              Fathers List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFathers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Period</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Order</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFathers.map((father) => {
                      const CategoryIcon = categoryIcons[father.category];
                      return (
                        <tr key={father.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{father.name}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600">
                              {father.period || '-'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              <CategoryIcon className="w-3 h-3" />
                              {categoryLabels[father.category]}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600">{father.display_order}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(father)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 border border-blue-200 hover:border-blue-300"
                                title="Edit Father"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(father.id)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 border border-red-200 hover:border-red-300"
                                title="Delete Father"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No fathers found</p>
                <p className="text-gray-400 text-sm">
                  {selectedCategory === 'all' 
                    ? 'No fathers have been added yet.' 
                    : `No fathers found for the selected category.`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFathersPage;