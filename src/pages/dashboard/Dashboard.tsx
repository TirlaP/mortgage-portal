import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  PenTool, 
  // Tool, 
  User,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

interface Metric {
  id: number;
  name: string;
  value: string;
}

interface Update {
  id: number;
  title: string;
  date: string;
  type: string;
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  // Dashboard metrics (mock data)
  const metrics: Metric[] = [
    { id: 1, name: 'SOPs Available', value: '45' },
    { id: 2, name: 'Training Scripts', value: '28' },
    { id: 3, name: 'Recent Updates', value: '12' },
    { id: 4, name: 'Forms', value: '8' },
  ];

  // Recent updates (mock data)
  const recentUpdates: Update[] = [
    { id: 1, title: 'New Loan Process SOP Added', date: '2 days ago', type: 'SOPs' },
    { id: 2, title: 'Credit Pull Form Updated', date: '3 days ago', type: 'Forms' },
    { id: 3, title: 'Refinance Script Updated', date: '5 days ago', type: 'Scripts' },
    { id: 4, title: 'Rate Lock Policy Updated', date: '1 week ago', type: 'SOPs' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Welcome card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Welcome, {currentUser.name}</CardTitle>
          <CardDescription>
            Here's what's happening in your mortgage team portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              SOPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Access standard operating procedures and documentation.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/sops">View SOPs</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Scripts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Access call scripts and conversation guides.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/scripts">View Scripts</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <PenTool className="mr-2 h-5 w-5 text-primary" />
              Forms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Access lead intake, credit pull requests, and other forms.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/forms">View Forms</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              {/* <Tool className="mr-2 h-5 w-5 text-primary" /> */}
              Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Access calculators and reference tools.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/tools">View Tools</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUpdates.map((update) => (
              <div
                key={update.id}
                className="border-b border-gray-200 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{update.title}</h3>
                    <p className="text-sm text-gray-500">{update.date}</p>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {update.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Updates</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;