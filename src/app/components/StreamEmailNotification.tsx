import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Bell, 
  Mail, 
  Check, 
  X, 
  Settings,
  Clock,
  Calendar,
  Radio
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailSubscription {
  email: string;
  notify_live_streams: boolean;
  notify_scheduled_streams: boolean;
  notify_special_events: boolean;
  notify_mass_times: boolean;
}

interface StreamEmailNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  streamTitle?: string;
  streamTime?: string;
}

export const StreamEmailNotification: React.FC<StreamEmailNotificationProps> = ({
  isOpen,
  onClose,
  streamTitle,
  streamTime
}) => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState<EmailSubscription>({
    email: '',
    notify_live_streams: true,
    notify_scheduled_streams: true,
    notify_special_events: true,
    notify_mass_times: false
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      const subscriptionData = {
        ...preferences,
        email: email
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Email subscription:', subscriptionData);
      
      setIsSubscribed(true);
      toast.success('Successfully subscribed to stream notifications!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
        onClose();
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof EmailSubscription, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isSubscribed) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Subscription Confirmed!
            </h3>
            <p className="text-gray-600 mb-4">
              You'll receive email notifications for live streams and events.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                📧 Check your email for a confirmation message
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" />
            Stream Notifications
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubscribe} className="space-y-6">
          {streamTitle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-1">Get notified for:</h4>
              <p className="text-blue-800">{streamTitle}</p>
              {streamTime && (
                <p className="text-sm text-blue-600 mt-1">{streamTime}</p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="mt-1"
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Notification Preferences
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Live Stream Alerts</p>
                    <p className="text-sm text-gray-600">When a stream goes live</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notify_live_streams}
                  onCheckedChange={(checked) => handlePreferenceChange('notify_live_streams', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Scheduled Streams</p>
                    <p className="text-sm text-gray-600">Upcoming stream reminders</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notify_scheduled_streams}
                  onCheckedChange={(checked) => handlePreferenceChange('notify_scheduled_streams', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Special Events</p>
                    <p className="text-sm text-gray-600">Feast days & ceremonies</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notify_special_events}
                  onCheckedChange={(checked) => handlePreferenceChange('notify_special_events', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Daily Mass Times</p>
                    <p className="text-sm text-gray-600">Regular mass schedule</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notify_mass_times}
                  onCheckedChange={(checked) => handlePreferenceChange('notify_mass_times', checked)}
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You can unsubscribe at any time using the link in our emails. 
              We respect your privacy and will never share your email address.
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe to Notifications
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Quick notification button component
export const QuickNotifyButton: React.FC<{
  streamTitle?: string;
  streamTime?: string;
  className?: string;
}> = ({ streamTitle, streamTime, className = "" }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setShowDialog(true)}
        className={`bg-green-600 hover:bg-green-700 ${className}`}
      >
        <Bell className="w-4 h-4 mr-2" />
        Get Notified
      </Button>
      
      <StreamEmailNotification
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        streamTitle={streamTitle}
        streamTime={streamTime}
      />
    </>
  );
};