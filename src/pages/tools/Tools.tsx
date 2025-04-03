import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Calendar, 
  Database, 
  FileSearch, 
  DollarSign, 
  BarChart, 
  Map, 
  Search,
  Settings,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES, UserRole } from '../../contexts/AuthContext';

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  color: string;
}

interface Tool {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  roles: UserRole[];
}

const ToolCard: React.FC<ToolCardProps> = ({ icon: Icon, title, description, href, color }) => (
  <Card className="transition-all hover:shadow-md cursor-pointer">
    <Link to={href}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className={`p-2 rounded-full ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Link>
  </Card>
);

const Tools: React.FC = () => {
  const { hasRole } = useAuth();
  
  // Mock tools data
  const tools: Tool[] = [
    {
      id: 1,
      title: 'Mortgage Calculator',
      description: 'Calculate monthly payments, interest, and amortization schedules.',
      icon: Calculator,
      href: '/tools/calculator',
      color: 'bg-blue-500',
      roles: [USER_ROLES.ADMIN, USER_ROLES.LOAN_OFFICER, USER_ROLES.LOAN_OFFICER_ASSISTANT],
    },
    {
      id: 2,
      title: 'Rate Comparison Tool',
      description: 'Compare current rates across different loan programs and terms.',
      icon: BarChart,
      href: '/tools/rates',
      color: 'bg-green-500',
      roles: [USER_ROLES.ADMIN, USER_ROLES.LOAN_OFFICER, USER_ROLES.LOAN_OFFICER_ASSISTANT],
    },
    {
      id: 3,
      title: 'Document Finder',
      description: 'Search and locate required documents for various loan types.',
      icon: FileSearch,
      href: '/tools/docs',
      color: 'bg-orange-500',
      roles: [USER_ROLES.ADMIN, USER_ROLES.LOAN_OFFICER, USER_ROLES.LOAN_OFFICER_ASSISTANT],
    },
    {
      id: 4,
      title: 'Closing Cost Estimator',
      description: 'Generate detailed closing cost estimates for clients.',
      icon: DollarSign,
      href: '/tools/closing-costs',
      color: 'bg-purple-500',
      roles: [USER_ROLES.ADMIN, USER_ROLES.LOAN_OFFICER],
    },
    {
      id: 5,
      title: 'Property Lookup',
      description: 'Access property information, tax records, and comparables.',
      icon: Map,
      href: '/tools/property',
      color: 'bg-red-500',
      roles: [USER_ROLES.ADMIN, USER_ROLES.LOAN_OFFICER],
    },
    {
      id: 6,
      title: 'Scheduling Assistant',
      description: 'Schedule client meetings and set follow-up reminders.',
      icon: Calendar,
      href: '/tools/schedule',
      color: 'bg-teal-500',
      roles: [USER_ROLES.ADMIN, USER_ROLES.LOAN_OFFICER, USER_ROLES.LOAN_OFFICER_ASSISTANT],
    },
    {
      id: 7,
      title: 'Loan Program Finder',
      description: 'Find the right loan programs based on client criteria.',
      icon: Search,
      href: '/tools/programs',
      color: 'bg-indigo-500',
      roles: [USER_ROLES.ADMIN, USER_ROLES.LOAN_OFFICER],
    },
    {
      id: 8,
      title: 'Data Export Tool',
      description: 'Export loan data and reports for analysis.',
      icon: Database,
      href: '/tools/export',
      color: 'bg-pink-500',
      roles: [USER_ROLES.ADMIN],
    },
  ];

  // Filter tools based on user role
  const availableTools = tools.filter(tool => {
    return tool.roles.some(role => hasRole(role));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tools & Calculators</h1>
          <p className="text-gray-500">Access productivity tools and calculators to simplify your workflow</p>
        </div>
        {hasRole(USER_ROLES.ADMIN) && (
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Manage Tools
          </Button>
        )}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {availableTools.map((tool) => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            href={tool.href}
            color={tool.color}
          />
        ))}
      </div>

      {/* Empty state (unlikely to be seen) */}
      {availableTools.length === 0 && (
        <Card className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Calculator className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">No Tools Available</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2">
            There are currently no tools available for your role. Please contact your administrator for assistance.
          </p>
        </Card>
      )}
    </div>
  );
};

export default Tools;