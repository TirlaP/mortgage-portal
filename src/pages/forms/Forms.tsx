import React, { useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Search, ChevronRight, File, Filter, Plus, LayoutGrid, List } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
  id: number;
  title: string;
  category: string;
  lastUpdated: string;
  description: string;
}

// Mock forms data
const MOCK_FORMS: FormData[] = [
  {
    id: 1,
    title: 'Lead Intake Form',
    category: 'Lead Management',
    lastUpdated: '2023-06-05',
    description: 'Form for collecting new lead information and initiating the follow-up process.',
  },
  {
    id: 2,
    title: 'Credit Pull Authorization',
    category: 'Credit',
    lastUpdated: '2023-05-22',
    description: 'Authorization form for pulling credit reports during the application process.',
  },
  {
    id: 3,
    title: 'Income Verification Request',
    category: 'Verification',
    lastUpdated: '2023-04-18',
    description: 'Form to request income verification from employers.',
  },
  {
    id: 4,
    title: 'Document Checklist',
    category: 'Processing',
    lastUpdated: '2023-06-12',
    description: 'Checklist of required documents for loan application submission.',
  },
  {
    id: 5,
    title: 'Rate Lock Request',
    category: 'Rate Management',
    lastUpdated: '2023-05-30',
    description: 'Form to request locking in an interest rate for a specific loan.',
  },
  {
    id: 6,
    title: 'Loan Application Update',
    category: 'Processing',
    lastUpdated: '2023-06-20',
    description: 'Form to update information on an existing loan application.',
  },
];

// Form categories
const FORM_CATEGORIES = [
  'All Categories',
  'Lead Management',
  'Credit',
  'Verification',
  'Processing',
  'Rate Management',
];

// Form card component
interface FormCardProps {
  form: FormData;
  viewMode: 'grid' | 'list';
}

const FormCard: React.FC<FormCardProps> = ({ form, viewMode }) => {
  const { isAdmin } = useAuth();
  
  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <File className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">{form.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{form.category}</Badge>
              <span className="text-xs text-muted-foreground">
                Updated: {form.lastUpdated}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/forms/${form.id}`}>
              View
            </Link>
          </Button>
          {isAdmin() && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/forms/edit/${form.id}`}>
                Edit
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-base">{form.title}</CardTitle>
            <CardDescription className="text-xs">{form.category}</CardDescription>
          </div>
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <File className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-700 line-clamp-2 protected-content">{form.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <span className="text-xs text-muted-foreground">
          Last updated: {form.lastUpdated}
        </span>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-primary">
          <Link to={`/forms/${form.id}`}>
            View <ChevronRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Forms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState<boolean>(false);
  const { isAdmin } = useAuth();

  // Filter forms based on search term and category
  const filteredForms = MOCK_FORMS.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'All Categories' || form.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground">Access and submit internal forms for various processes</p>
        </div>
        {isAdmin() && (
          <Button asChild>
            <Link to="/forms/edit/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Form
            </Link>
          </Button>
        )}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                {selectedCategory !== 'All Categories' ? selectedCategory : 'Category'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {FORM_CATEGORIES.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-primary/10" : ""}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-none ${viewMode === 'grid' ? 'bg-muted' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-none ${viewMode === 'list' ? 'bg-muted' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Forms List */}
      {loading ? (
        <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4`}>
          {Array(6).fill(0).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-20 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-full" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form) => (
                <FormCard key={form.id} form={form} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredForms.map((form) => (
                <FormCard key={form.id} form={form} viewMode={viewMode} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {filteredForms.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="rounded-full bg-gray-100 p-4 text-gray-500">
            <File className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium">No Forms Found</h3>
          <p className="text-muted-foreground max-w-md text-center">
            We couldn't find any forms matching your search criteria. Try adjusting your filters or search terms.
          </p>
          {searchTerm || selectedCategory !== 'All Categories' ? (
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
            }}>
              Clear Filters
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Forms;