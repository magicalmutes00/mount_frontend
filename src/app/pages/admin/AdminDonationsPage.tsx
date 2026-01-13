import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { 
  IndianRupee, 
  Search, 
  TrendingUp, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  Eye, 
  X,
  CheckCircle,
  Trash2,
  Clock,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Payment {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  amount: number;
  purpose: string | null;
  utr_number: string | null;
  screenshot_path: string | null;
  screenshot_name: string | null;
  status: 'pending' | 'verified';
  created_at: string;
}

export const AdminDonationsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified'>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/donations');
      if (response.ok) {
        const data = await response.json();
        // Ensure we always have a valid array
        const paymentsData = Array.isArray(data.data) ? data.data : [];
        setPayments(paymentsData);
      } else {
        toast.error('Failed to fetch donation payments');
        setPayments([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Error loading donation payments');
      setPayments([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id: number, status: 'verified') => {
    try {
      setProcessingId(id);
      const response = await fetch(`/api/donations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setPayments(prev => 
          prev.map(payment => 
            payment.id === id ? { ...payment, status } : payment
          )
        );
        toast.success(`Payment ${status} successfully!`);
      } else {
        toast.error(`Failed to ${status} payment`);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Error updating payment status');
    } finally {
      setProcessingId(null);
    }
  };

  const deleteDonation = async (id: number) => {
    try {
      setProcessingId(id);
      const response = await fetch(`/api/donations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPayments(prev => prev.filter(payment => payment.id !== id));
        toast.success('Donation deleted successfully!');
      } else {
        toast.error('Failed to delete donation');
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast.error('Error deleting donation');
    } finally {
      setProcessingId(null);
    }
  };

  const showPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  // Filter payments
  const filteredPayments = (payments || []).filter(payment => {
    if (!payment) return false;
    
    const searchLower = (searchTerm || '').toLowerCase();
    const matchesSearch = 
      (payment.name?.toLowerCase() || '').includes(searchLower) ||
      (payment.purpose?.toLowerCase() || '').includes(searchLower) ||
      (payment.utr_number?.toLowerCase() || '').includes(searchLower);
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalAmount = (payments || []).reduce((sum, p) => sum + (p?.amount || 0), 0);
  const verifiedAmount = (payments || []).filter(p => p?.status === 'verified').reduce((sum, p) => sum + (p?.amount || 0), 0);
  const pendingAmount = (payments || []).filter(p => p?.status === 'pending').reduce((sum, p) => sum + (p?.amount || 0), 0);

  const pendingCount = (payments || []).filter(p => p?.status === 'pending').length;
  const verifiedCount = (payments || []).filter(p => p?.status === 'verified').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-4 sm:py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-green-700">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading donation payments...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Donation Payments</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and verify donation payment submissions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-green-200">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-gray-600">Total Donations</p>
                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">₹{totalAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{(payments || []).length} payments</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{pendingCount}</p>
              <p className="text-xs text-gray-500 mt-1">₹{pendingAmount.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-gray-600">Verified</p>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{verifiedCount}</p>
              <p className="text-xs text-gray-500 mt-1">₹{verifiedAmount.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Payments List */}
        <Card className="border-green-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-green-800 text-lg sm:text-xl">Payment Submissions</CardTitle>
            
            {/* Search and Filters */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, purpose, or UTR..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  className={`text-xs sm:text-sm transition-all duration-200 ${
                    filterStatus === 'all' 
                      ? 'bg-green-700 hover:bg-green-800 text-white shadow-md' 
                      : 'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  All ({(payments || []).length})
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('pending')}
                  className={`text-xs sm:text-sm transition-all duration-200 ${
                    filterStatus === 'pending' 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md' 
                      : 'border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300'
                  }`}
                >
                  Pending ({pendingCount})
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === 'verified' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('verified')}
                  className={`text-xs sm:text-sm transition-all duration-200 ${
                    filterStatus === 'verified' 
                      ? 'bg-green-700 hover:bg-green-800 text-white shadow-md' 
                      : 'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  Verified ({verifiedCount})
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredPayments.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredPayments.map(payment => (
                  <div key={payment.id} className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <p className="font-medium text-gray-800 text-sm truncate">{payment.name || 'N/A'}</p>
                          </div>
                          {getStatusBadge(payment.status)}
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <p className="text-lg font-bold text-green-700">₹{payment.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 flex-shrink-0 text-green-600" />
                          <span className="truncate">{payment.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 flex-shrink-0 text-green-600" />
                          <span>{payment.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 flex-shrink-0 text-green-600" />
                          <span>{formatDate(payment.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-1"><strong>Purpose:</strong> {payment.purpose || 'N/A'}</p>
                        <p className="text-xs text-gray-600">
                          <strong>UTR:</strong> 
                          <span className="font-mono bg-white px-1 py-0.5 rounded ml-1 text-xs border border-green-200">{payment.utr_number || 'N/A'}</span>
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => showPaymentDetails(payment)}
                          className="flex items-center justify-center gap-1 text-xs border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                        >
                          <Eye className="w-3 h-3" />
                          View Details
                        </Button>
                        {payment.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updatePaymentStatus(payment.id, 'verified')}
                              disabled={processingId === payment.id}
                              className="bg-green-600 hover:bg-green-700 text-white flex-1 text-xs shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              {processingId === payment.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verify
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => deleteDonation(payment.id)}
                              disabled={processingId === payment.id}
                              className="bg-red-600 hover:bg-red-700 text-white flex-1 text-xs shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              {processingId === payment.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <User className="w-4 h-4 text-green-600" />
                            <p className="font-medium text-gray-800">{payment.name || 'N/A'}</p>
                            {getStatusBadge(payment.status)}
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-green-600" />
                              <span className="truncate">{payment.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-green-600" />
                              <span>{payment.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-700">₹{payment.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span>{formatDate(payment.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => showPaymentDetails(payment)}
                            className="flex items-center gap-1 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                          {payment.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => updatePaymentStatus(payment.id, 'verified')}
                                disabled={processingId === payment.id}
                                className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                {processingId === payment.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'Verify'
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => deleteDonation(payment.id)}
                                disabled={processingId === payment.id}
                                className="bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                {processingId === payment.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'Delete'
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-600"><strong>Purpose:</strong> {payment.purpose || 'N/A'}</p>
                          <p className="text-gray-600">
                            <strong>UTR Number:</strong> 
                            <span className="font-mono bg-white px-2 py-1 rounded ml-2 border border-green-200">{payment.utr_number || 'N/A'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm sm:text-base">No donation payments found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-green-800">Donation Payment Details</DialogTitle>
            </DialogHeader>
            
            {selectedPayment && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium mb-2 text-sm sm:text-base text-green-800">Donor Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <p><strong>Name:</strong> {selectedPayment.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedPayment.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {selectedPayment.phone || 'N/A'}</p>
                    <p><strong>Amount:</strong> ₹{selectedPayment.amount.toLocaleString()}</p>
                    <p><strong>Purpose:</strong> {selectedPayment.purpose || 'N/A'}</p>
                    <div className="flex items-center gap-2">
                      <strong>Status:</strong> {getStatusBadge(selectedPayment.status)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs sm:text-sm font-medium mb-2 text-green-800">UTR Number:</p>
                      <p className="font-mono bg-white px-3 py-2 rounded text-xs sm:text-sm break-all border border-green-200">
                        {selectedPayment.utr_number || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-medium mb-2 text-green-800">Submission Date:</p>
                      <p className="text-xs sm:text-sm">{formatDate(selectedPayment.created_at)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs sm:text-sm font-medium mb-2 text-green-800">Payment Screenshot:</p>
                    <div className="text-center">
                      {selectedPayment.screenshot_name ? (
                        <img
                          src={`/uploads/payments/${selectedPayment.screenshot_name}`}
                          alt="Payment Screenshot"
                          className="max-w-full h-auto border border-green-200 rounded-lg max-h-64 mx-auto shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.svg';
                          }}
                        />
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-green-600">
                          No screenshot available
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedPayment.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4">
                      <Button
                        onClick={() => {
                          updatePaymentStatus(selectedPayment.id, 'verified');
                          setShowPaymentModal(false);
                        }}
                        disabled={processingId === selectedPayment.id}
                        className="bg-green-600 hover:bg-green-700 text-sm shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {processingId === selectedPayment.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Verify Payment
                      </Button>
                      <Button
                        onClick={() => {
                          deleteDonation(selectedPayment.id);
                          setShowPaymentModal(false);
                        }}
                        disabled={processingId === selectedPayment.id}
                        className="bg-red-600 hover:bg-red-700 text-sm shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {processingId === selectedPayment.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete Payment
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
