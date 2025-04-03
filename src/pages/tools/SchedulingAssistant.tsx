import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, UserPlus, X, CheckCircle, Filter, ChevronLeft, ChevronRight, Plus, AlertCircle, User, Phone, Mail, MessageCircle, Video, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@radix-ui/react-switch';

type MeetingType = 'phone' | 'video' | 'in-person' | 'other';

interface Appointment {
  id: number;
  title: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: MeetingType;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
}

const SchedulingAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAppointmentForm, setShowAppointmentForm] = useState<boolean>(false);
  const [meetingType, setMeetingType] = useState<MeetingType>('phone');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  // Form fields
  const [appointmentTitle, setAppointmentTitle] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [appointmentNotes, setAppointmentNotes] = useState<string>('');
  
  // Mock data for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      title: 'Initial Consultation',
      clientName: 'John Smith',
      clientEmail: 'john.smith@example.com',
      clientPhone: '555-123-4567',
      date: '2023-08-15',
      startTime: '09:00',
      endTime: '10:00',
      type: 'phone',
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Loan Application Review',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah.j@example.com',
      clientPhone: '555-987-6543',
      date: '2023-08-15',
      startTime: '14:00',
      endTime: '15:00',
      type: 'video',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Document Collection Meeting',
      clientName: 'Michael Brown',
      clientEmail: 'mbrown@example.com',
      clientPhone: '555-456-7890',
      date: '2023-08-16',
      startTime: '11:00',
      endTime: '12:00',
      type: 'in-person',
      status: 'scheduled'
    }
  ]);
  
  // Generate time slots for the selected day
  const timeSlots: TimeSlot[] = Array.from({ length: 17 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const time = `${hour.toString().padStart(2, '0')}:${minute}`;
    
    // Check if time slot is available (not booked already)
    const isAvailable = !appointments.some(
      app => app.date === formatDate(selectedDate) && 
             app.startTime <= time && 
             app.endTime > time &&
             app.status !== 'cancelled'
    );
    
    return {
      id: i,
      time,
      available: isAvailable
    };
  });
  
  // Format date to yyyy-mm-dd
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Format date for display
  const formatDateDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Handle date navigation
  const nextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };
  
  const prevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };
  
  // Handle time slot selection
  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time);
    
    // Calculate end time (1 hour later)
    const [hour, minute] = time.split(':').map(Number);
    const endHour = hour + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Set default appointment title based on time
    setAppointmentTitle(`Meeting on ${formatDateDisplay(selectedDate)} at ${time}`);
  };
  
  // Create new appointment
  const handleCreateAppointment = () => {
    if (!selectedTimeSlot) return;
    
    // Calculate end time (1 hour later)
    const [hour, minute] = selectedTimeSlot.split(':').map(Number);
    const endHour = hour + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    const newAppointment: Appointment = {
      id: appointments.length + 1,
      title: appointmentTitle,
      clientName,
      clientEmail,
      clientPhone,
      date: formatDate(selectedDate),
      startTime: selectedTimeSlot,
      endTime,
      type: meetingType,
      status: 'scheduled',
      notes: appointmentNotes
    };
    
    setAppointments([...appointments, newAppointment]);
    
    // Reset form
    setAppointmentTitle('');
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setAppointmentNotes('');
    setSelectedTimeSlot(null);
    setShowAppointmentForm(false);
  };
  
  // Cancel appointment
  const handleCancelAppointment = (id: number) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'cancelled' } : app
    ));
  };
  
  // Get appointments for selected date
  const appointmentsForSelectedDate = appointments.filter(
    app => app.date === formatDate(selectedDate) && app.status !== 'cancelled'
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  // Get today's appointments
  const todayAppointments = appointments.filter(
    app => app.date === formatDate(new Date()) && app.status !== 'cancelled'
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  // Get upcoming appointments (not today, not cancelled)
  const upcomingAppointments = appointments.filter(
    app => app.date > formatDate(new Date()) && app.status !== 'cancelled'
  ).sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/tools">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tools
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scheduling Assistant</h1>
        <p className="text-gray-500">Manage appointments, schedule meetings, and set reminders</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          {/* Date Navigation */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={prevDay}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous Day
                </Button>
                <h2 className="text-lg font-semibold">{formatDateDisplay(selectedDate)}</h2>
                <Button variant="outline" size="sm" onClick={nextDay}>
                  Next Day <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Time Slot Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Available Time Slots
              </CardTitle>
              <CardDescription>
                Select a time slot to schedule a new appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() => {
                      handleTimeSlotSelect(slot.time);
                      setShowAppointmentForm(true);
                    }}
                    className="flex-1"
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Appointments for selected day */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Appointments for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {appointmentsForSelectedDate.map((appointment) => (
                    <div key={appointment.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          appointment.type === 'phone' ? 'bg-blue-100 text-blue-600' :
                          appointment.type === 'video' ? 'bg-purple-100 text-purple-600' :
                          appointment.type === 'in-person' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {appointment.type === 'phone' && <Phone className="h-5 w-5" />}
                          {appointment.type === 'video' && <Video className="h-5 w-5" />}
                          {appointment.type === 'in-person' && <User className="h-5 w-5" />}
                          {appointment.type === 'other' && <Calendar className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-medium">{appointment.title}</div>
                          <div className="text-sm text-gray-500">
                            {appointment.startTime} - {appointment.endTime} • {appointment.clientName}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No Appointments</h3>
                  <p className="text-gray-500 mt-1">
                    You don't have any appointments scheduled for this day.
                  </p>
                  <Button className="mt-4" onClick={() => setShowAppointmentForm(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Schedule New Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* New Appointment Form */}
          {showAppointmentForm && selectedTimeSlot && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <UserPlus className="mr-2 h-5 w-5 text-primary" />
                  Schedule New Appointment
                </CardTitle>
                <CardDescription>
                  {formatDateDisplay(selectedDate)} at {selectedTimeSlot}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentTitle">Appointment Title</Label>
                  <Input
                    id="appointmentTitle"
                    value={appointmentTitle}
                    onChange={(e) => setAppointmentTitle(e.target.value)}
                    placeholder="E.g., Initial Consultation, Loan Application Review"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Enter client name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meetingType">Meeting Type</Label>
                    <select 
                      id="meetingType"
                      className="w-full h-10 pl-3 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      value={meetingType}
                      onChange={(e) => setMeetingType(e.target.value as MeetingType)}
                    >
                      <option value="phone">Phone Call</option>
                      <option value="video">Video Conference</option>
                      <option value="in-person">In-Person Meeting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="Enter client email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Client Phone</Label>
                    <Input
                      id="clientPhone"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Enter client phone number"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appointmentNotes">Notes</Label>
                  <textarea
                    id="appointmentNotes"
                    className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    placeholder="Add any notes about this appointment"
                  ></textarea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowAppointmentForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAppointment}>
                  <CheckCircle className="h-4 w-4 mr-1" /> Schedule Appointment
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          appointment.type === 'phone' ? 'bg-blue-100 text-blue-600' :
                          appointment.type === 'video' ? 'bg-purple-100 text-purple-600' :
                          appointment.type === 'in-person' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {appointment.type === 'phone' && <Phone className="h-5 w-5" />}
                          {appointment.type === 'video' && <Video className="h-5 w-5" />}
                          {appointment.type === 'in-person' && <User className="h-5 w-5" />}
                          {appointment.type === 'other' && <Calendar className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-medium">{appointment.title}</div>
                          <div className="text-sm text-gray-500">
                            {appointment.startTime} - {appointment.endTime} • {appointment.clientName}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" /> Notify
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No Appointments Today</h3>
                  <p className="text-gray-500 mt-1">
                    You don't have any appointments scheduled for today.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          appointment.type === 'phone' ? 'bg-blue-100 text-blue-600' :
                          appointment.type === 'video' ? 'bg-purple-100 text-purple-600' :
                          appointment.type === 'in-person' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {appointment.type === 'phone' && <Phone className="h-5 w-5" />}
                          {appointment.type === 'video' && <Video className="h-5 w-5" />}
                          {appointment.type === 'in-person' && <User className="h-5 w-5" />}
                          {appointment.type === 'other' && <Calendar className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-medium">{appointment.title}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} •
                            {appointment.startTime} - {appointment.endTime} • {appointment.clientName}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" /> Notify
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No Upcoming Appointments</h3>
                  <p className="text-gray-500 mt-1">
                    You don't have any appointments scheduled in the future.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Scheduling Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Working Hours</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <select 
                      id="startTime"
                      className="w-full h-10 pl-3 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      defaultValue="08:00"
                    >
                      <option value="07:00">7:00 AM</option>
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <select 
                      id="endTime"
                      className="w-full h-10 pl-3 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      defaultValue="17:00"
                    >
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Working Days</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox id={`day-${index}`} defaultChecked={index < 5} />
                      <Label htmlFor={`day-${index}`}>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Meeting Duration</Label>
                <select 
                  className="w-full h-10 pl-3 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="60"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Calendar Sync</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Google Calendar</div>
                        <div className="text-sm text-gray-500">Sync your Google Calendar</div>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Outlook Calendar</div>
                        <div className="text-sm text-gray-500">Sync your Outlook Calendar</div>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Preferences</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for new and updated appointments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text message reminders for upcoming appointments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Reminder Time</Label>
                <select 
                  className="w-full h-10 pl-3 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="60"
                >
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="120">2 hours before</option>
                  <option value="1440">1 day before</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchedulingAssistant;