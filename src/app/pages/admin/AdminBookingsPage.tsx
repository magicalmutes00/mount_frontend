import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { 
  Calendar, 
  Search, 
  Check, 
  X, 
  IndianRupee, 
  Eye, 
  CreditCard, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  Trash2,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface MassBooking {
  id: number;
  name: string;
  email: string;
  phone: string;
  start_date: string;
  preferred_time: string;
  intention_type: string;
  intention_description: string;
  number_of_days: number;
  total_amount: number;
  status: 'unread' | 'read';
  created_at: string;
  updated_at: string;
}

interface Payment {
  id: number;
  name: string;
  email: string;
  phone: string;
  amount: number;
  purpose: string;
  utr_number: string;
  screenshot_path: string;
  screenshot_name: string;
  mass_details: any;
  status: 'unread' | 'read';
  created_at: string;
}

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<MassBooking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedBooking, setSelectedBooking] = useState<MassBooking | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingPayments, setBookingPayments] = useState<Payment[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
    fetchPayments();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/mass-bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.data || []);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/mass-bookings/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.data || []);
      } else {
        console.error('Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const updateBookingStatus = async (id: number, status: 'read' | 'unread') => {
    try {
      setProcessingId(id);
      const response = await fetch(`/api/mass-bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === id ? { ...booking, status } : booking
          )
        );
        toast.success(`Booking marked as ${status} successfully!`);
      } else {
        toast.error(`Failed to update booking status`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Error updating booking status');
    } finally {
      setProcessingId(null);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessingId(id);
      const response = await fetch(`/api/mass-bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(prev => prev.filter(booking => booking.id !== id));
        toast.success('Booking deleted successfully!');
      } else {
        toast.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Error deleting booking');
    } finally {
      setProcessingId(null);
    }
  };

  const getBookingPayments = (booking: MassBooking) => {
    return payments.filter(payment => 
      payment.name === booking.name && 
      payment.email === booking.email &&
      payment.purpose === 'Mass Booking'
    );
  };

  const showBookingPayments = (booking: MassBooking) => {
    const relatedPayments = getBookingPayments(booking);
    setSelectedBooking(booking);
    setBookingPayments(relatedPayments);
    setShowPaymentModal(true);
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const unreadCount = bookings.filter(b => b.status === 'unread').length;
  const readCount = bookings.filter(b => b.status === 'read').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return (
          <Badge className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">
            <Clock className="w-3 h-3 mr-1" />
            Unread
          </Badge>
        );
      case 'read':
        return (
          <Badge className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3 mr-1" />
            Read
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">{status}</Badge>;
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
      <div className="min-h-screen py-2 sm:py-4 lg:py-8 px-2 sm:px-4 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-green-700">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm sm:text-base">Loading mass bookings...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-2 sm:py-4 lg:py-8 px-2 sm:px-4 bg-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mb-1 sm:mb-2">Mass Bookings Management</h1>
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base">Manage mass booking requests and view payment details</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="border-green-200 shadow-sm">
            <CardContent className="pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-xs sm:text-sm text-gray-600 leading-tight">Total Bookings</p>
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-700 flex-shrink-0" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{bookings.length}</p>
              <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">All requests</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200 shadow-sm">
            <CardContent className="pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-xs sm:text-sm text-gray-600 leading-tight">Unread</p>
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-600 flex-shrink-0" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{unreadCount}</p>
              <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Need attention</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 shadow-sm">
            <CardContent className="pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-xs sm:text-sm text-gray-600 leading-tight">Read</p>
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600 flex-shrink-0" />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{readCount}</p>
              <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Processed</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 shadow-sm">
            <CardContent className="pt-3 sm:pt-4 lg:pt-6 px-3 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-xs sm:text-sm text-gray-600 leading-tight">Total Amount</p>
                <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600 flex-shrink-0" />
              </div>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-600">
                ₹{bookings.reduce((sum, b) => {
                  const amount = typeof b.total_amount === 'string' ? parseFloat(b.total_amount) : b.total_amount;
                  return sum + (isNaN(amount) ? 0 : amount);
                }, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Expected</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card className="border-green-200 shadow-sm">
          <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
            <CardTitle className="text-green-800 text-base sm:text-lg lg:text-xl">Mass Bookings with Payment Details</CardTitle>
            
            {/* Search and Filters */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 text-xs sm:text-sm h-8 sm:h-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Button
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className={`text-xs h-7 sm:h-8 px-2 sm:px-3 border-0 transition-all duration-300 ${
                    filterStatus === 'all' 
                      ? 'bg-green-700 hover:bg-green-800 text-white shadow-md' 
                      : 'bg-green-50 hover:bg-green-100 text-green-700'
                  }`}
                >
                  All ({bookings.length})
                </Button>
                <Button
                  size="sm"
                  onClick={() => setFilterStatus('unread')}
                  className={`text-xs h-7 sm:h-8 px-2 sm:px-3 border-0 transition-all duration-300 ${
                    filterStatus === 'unread' 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md' 
                      : 'bg-orange-50 hover:bg-orange-100 text-orange-700'
                  }`}
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  size="sm"
                  onClick={() => setFilterStatus('read')}
                  className={`text-xs h-7 sm:h-8 px-2 sm:px-3 border-0 transition-all duration-300 ${
                    filterStatus === 'read' 
                      ? 'bg-green-700 hover:bg-green-800 text-white shadow-md' 
                      : 'bg-green-50 hover:bg-green-100 text-green-700'
                  }`}
                >
                  Read ({readCount})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {filteredBookings.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 max-h-[600px] overflow-y-auto">
                {filteredBookings.map(booking => {
                  const relatedPayments = getBookingPayments(booking);
                  const hasPayment = relatedPayments.length > 0;
                  const latestPayment = relatedPayments[0];
                  
                  return (
                    <div key={booking.id} className="p-2 sm:p-3 lg:p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
                      {/* Mobile Layout */}
                      <div className="block sm:hidden">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <User className="w-3 h-3 text-gray-500 flex-shrink-0" />
                              <p className="font-medium text-gray-800 text-xs truncate">{booking.name}</p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <p className="text-sm font-bold text-green-700">₹{booking.total_amount.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate text-xs">{booking.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs">{booking.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs">{new Date(booking.start_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs">{booking.preferred_time}</span>
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <p className="text-xs text-gray-600 mb-0.5"><strong>Intention:</strong> {booking.intention_type}</p>
                          <p className="text-xs text-gray-600 mb-0.5"><strong>Description:</strong> <span className="truncate block">{booking.intention_description}</span></p>
                          <p className="text-xs text-gray-600"><strong>Days:</strong> {booking.number_of_days}</p>
                        </div>
                        
                        {/* Payment Status Indicator - Mobile */}
                        {hasPayment ? (
                          <div className="mb-2 p-1.5 bg-blue-50 rounded text-xs">
                            <div className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3 text-blue-600" />
                              <span className="text-blue-800 font-medium text-xs">Payment Submitted</span>
                            </div>
                            <p className="text-blue-700 mt-0.5 text-xs">
                              UTR: <span className="font-mono text-xs">{latestPayment.utr_number}</span>
                            </p>
                          </div>
                        ) : (
                          <div className="mb-2 p-1.5 bg-yellow-50 rounded text-xs">
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-3 h-3 text-yellow-600" />
                              <span className="text-yellow-800 font-medium text-xs">Payment Pending</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-col gap-1.5">
                          {hasPayment && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => showBookingPayments(booking)}
                              className="flex items-center justify-center gap-1 text-xs h-7 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                            >
                              <CreditCard className="w-3 h-3" />
                              View Payment
                            </Button>
                          )}
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => updateBookingStatus(booking.id, booking.status === 'read' ? 'unread' : 'read')}
                              disabled={processingId === booking.id}
                              className={`flex-1 text-xs h-7 border-0 shadow-sm hover:shadow-md transition-all duration-200 ${booking.status === 'read' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-green-700 hover:bg-green-800 text-white'}`}
                            >
                              {processingId === booking.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                booking.status === 'read' ? 'Unread' : 'Read'
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => deleteBooking(booking.id)}
                              disabled={processingId === booking.id}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs h-7 px-2 border-0 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              {processingId === booking.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:block">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <p className="font-medium text-gray-800">{booking.name}</p>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{booking.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{booking.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{booking.preferred_time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            {hasPayment && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => showBookingPayments(booking)}
                                className="flex items-center gap-1 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                              >
                                <CreditCard className="w-4 h-4" />
                                View Payment
                              </Button>
                            )}
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, booking.status === 'read' ? 'unread' : 'read')}
                                disabled={processingId === booking.id}
                                className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 ${booking.status === 'read' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-green-700 hover:bg-green-800 text-white'}`}
                              >
                                {processingId === booking.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  booking.status === 'read' ? 'Mark Unread' : 'Mark Read'
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => deleteBooking(booking.id)}
                                disabled={processingId === booking.id}
                                className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                {processingId === booking.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-600"><strong>Intention Type:</strong> {booking.intention_type}</p>
                            <p className="text-gray-600"><strong>Description:</strong> {booking.intention_description}</p>
                          </div>
                          <div className="grid md:grid-cols-3 gap-2">
                            <p className="text-gray-600">
                              <strong>Days:</strong> {booking.number_of_days}
                            </p>
                            <p className="text-gray-600">
                              <strong>Amount:</strong> <span className="text-green-700 font-medium">₹{booking.total_amount}</span>
                            </p>
                            <p className="text-gray-600">
                              <strong>Submitted:</strong> {formatDate(booking.created_at)}
                            </p>
                          </div>
                          
                          {/* Payment Status Indicator - Desktop */}
                          {hasPayment ? (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-3 h-3 text-blue-600" />
                                <span className="text-blue-800 font-medium">Payment Submitted</span>
                              </div>
                              <p className="text-blue-700 mt-1">
                                UTR: <span className="font-mono">{latestPayment.utr_number}</span> | 
                                Status: <span className="capitalize">{latestPayment.status}</span>
                              </p>
                            </div>
                          ) : (
                            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                              <div className="flex items-center gap-2">
                                <IndianRupee className="w-3 h-3 text-yellow-600" />
                                <span className="text-yellow-800 font-medium">Payment Pending</span>
                              </div>
                              <p className="text-yellow-700 mt-1">No payment submitted yet</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-green-600">
                <Calendar className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-sm sm:text-base">No bookings found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto mx-2 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-green-800 text-sm sm:text-base lg:text-lg">
                Payment Details - {selectedBooking?.name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium mb-2 text-sm sm:text-base text-green-800">Booking Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <p><strong>Name:</strong> {selectedBooking.name}</p>
                    <p><strong>Email:</strong> {selectedBooking.email}</p>
                    <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                    <p><strong>Amount:</strong> ₹{selectedBooking.total_amount.toLocaleString()}</p>
                    <p><strong>Date:</strong> {new Date(selectedBooking.start_date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {selectedBooking.preferred_time}</p>
                    <p><strong>Days:</strong> {selectedBooking.number_of_days}</p>
                    <p><strong>Intention:</strong> {selectedBooking.intention_type}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs sm:text-sm"><strong>Description:</strong></p>
                    <p className="text-xs sm:text-sm text-gray-600">{selectedBooking.intention_description}</p>
                  </div>
                </div>
                
                {bookingPayments.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm sm:text-base text-green-800">Payment Submissions</h4>
                    {bookingPayments.map((payment, index) => (
                      <div key={payment.id} className="bg-green-50 rounded-lg p-4 border border-green-200 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs sm:text-sm font-medium mb-1 text-green-800">UTR Number:</p>
                            <p className="font-mono bg-white px-2 py-1 rounded text-xs sm:text-sm break-all border border-green-200">
                              {payment.utr_number}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium mb-1 text-green-800">Status:</p>
                            <span className={`px-2 py-1 rounded text-xs ${
                              payment.status === 'verified' ? 'bg-green-100 text-green-800' :
                              payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-xs sm:text-sm font-medium mb-2 text-green-800">Payment Screenshot:</p>
                          <div className="text-center">
                            <img
                              src={`/uploads/payments/${payment.screenshot_name}`}
                              alt="Payment Screenshot"
                              className="max-w-full h-auto rounded-lg max-h-64 mx-auto shadow-sm border border-green-200"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.svg';
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          <p>Submitted: {formatDate(payment.created_at)}</p>
                          <p>Amount: ₹{payment.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-green-600">
                    <CreditCard className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-sm sm:text-base">No payment submissions found for this booking.</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
