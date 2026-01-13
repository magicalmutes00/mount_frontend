import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useShrineAuth } from '../context/ShrineAuthContext';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useShrineAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(formData.username, formData.password);
      
      if (success) {
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password');
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
      toast.error('Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-green-100">
        <div className="flex items-center gap-2 text-green-700">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-green-100">
      <Card className="max-w-md w-full border-green-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-green-800 text-2xl">Admin Login</CardTitle>
          <p className="text-gray-600 text-sm">Our Lady Of Sorrows Shrine</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <Label htmlFor="username">Username <span className='text-red-500'>*</span></Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password <span className='text-red-500'>*</span></Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              <strong>Secure Authentication:</strong> This system uses encrypted passwords and JWT tokens for secure access.
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Protected by enterprise-grade security measures.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
