import React, { useState, ChangeEvent, FormEvent } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  HelpCircle, 
  Save,
  Moon,
  Sun
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../contexts/AuthContext';

interface FormState {
  name: string;
  email: string;
  notifyUpdates: boolean;
  notifyEvents: boolean;
  language: string;
  sessionTimeout: string;
}

interface TabType {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
}

const Settings: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    notifyUpdates: true,
    notifyEvents: false,
    language: 'en',
    sessionTimeout: '30',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a backend
    console.log('Saving settings:', formState);
    // Show success message or toast notification
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would toggle dark mode in the app
    // document.documentElement.classList.toggle('dark');
  };

  const tabs: TabType[] = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Moon },
  ];
  
  // Admin-only tabs
  if (isAdmin()) {
    tabs.push({ id: 'advanced', name: 'Advanced Settings', icon: Lock });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and settings</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings tabs */}
        <Card className="md:w-64 shrink-0">
          <CardContent className="p-0">
            <nav className="flex flex-col space-y-1 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent ${
                    activeTab === tab.id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings content */}
        <Card className="flex-1">
          {activeTab === 'profile' && (
            <>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      Role
                    </label>
                    <Input
                      id="role"
                      value={currentUser?.role}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      Your role determines your permissions in the system. Contact an admin to change.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="language" className="text-sm font-medium">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      className="w-full h-10 pl-3 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formState.language}
                      onChange={handleInputChange}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="text-sm font-medium">
                      Current Password
                    </label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter your current password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      New Password
                    </label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter a new password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="session-timeout" className="text-sm font-medium">
                      Session Timeout (minutes)
                    </label>
                    <select
                      id="session-timeout"
                      name="sessionTimeout"
                      className="w-full h-10 pl-3 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formState.sessionTimeout}
                      onChange={handleInputChange}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="120">2 hours</option>
                    </select>
                    <p className="text-xs text-gray-500">
                      You will be automatically logged out after this period of inactivity.
                    </p>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notify-updates"
                        name="notifyUpdates"
                        checked={formState.notifyUpdates}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="notify-updates" className="text-sm font-medium">
                        Notify me about SOP and script updates
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notify-events"
                        name="notifyEvents"
                        checked={formState.notifyEvents}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="notify-events" className="text-sm font-medium">
                        Notify me about training events and webinars
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notify-email"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="notify-email" className="text-sm font-medium">
                        Receive email notifications (in addition to in-app)
                      </label>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </>
          )}

          {activeTab === 'appearance' && (
            <>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {darkMode ? (
                        <Moon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Sun className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium">
                        {darkMode ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>
                    <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-gray-200"
                      onClick={toggleDarkMode}
                    >
                      <span
                        className={`${
                          darkMode ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Font Size
                    </label>
                    <div className="flex items-center space-x-4">
                      <button className="px-3 py-1 text-sm border rounded-md">Small</button>
                      <button className="px-3 py-1 text-sm border rounded-md bg-primary text-white">Medium</button>
                      <button className="px-3 py-1 text-sm border rounded-md">Large</button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </>
          )}

          {activeTab === 'advanced' && isAdmin() && (
            <>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Admin-only settings for system configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <HelpCircle className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-amber-700">
                          These settings affect all users in the system. Use with caution.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Content Protection Level
                    </label>
                    <select
                      className="w-full h-10 pl-3 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="basic">Basic (Prevent Right-Click)</option>
                      <option value="medium">Medium (Disable Selection)</option>
                      <option value="high">High (Advanced Protection)</option>
                    </select>
                    <p className="text-xs text-gray-500">
                      Controls how strictly SOPs and scripts are protected from copying.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Integration Settings
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">Google Workspace</h4>
                          <p className="text-xs text-gray-500">Connect to Google Drive and Calendar</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">Salesforce</h4>
                          <p className="text-xs text-gray-500">Sync with Salesforce CRM</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">GoHighLevel</h4>
                          <p className="text-xs text-gray-500">Connect marketing automation</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Settings;