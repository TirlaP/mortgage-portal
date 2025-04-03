import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, FileText, ChevronRight, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, UserRole } from '@/contexts/AuthContext';

// Define Script interface
interface Script {
  id: number;
  title: string;
  category: string;
  lastUpdated: string;
  description: string;
}

// Script categories
const SCRIPT_CATEGORIES = [
  'All Categories',
  'Sales',
  'Customer Service',
  'Processing',
  'Closing',
];

// Mock scripts data
const MOCK_SCRIPTS: Script[] = [
  {
    id: 1,
    title: 'First-Time Homebuyer Call Script',
    category: 'Sales',
    lastUpdated: '2023-05-18',
    description: 'Guide for speaking with first-time homebuyers about the mortgage process.',
  },
  {
    id: 2,
    title: 'Refinance Opportunity Script',
    category: 'Sales',
    lastUpdated: '2023-06-01',
    description: 'Script for discussing refinance options with existing homeowners.',
  },
  {
    id: 3,
    title: 'Rate Increase Notification',
    category: 'Customer Service',
    lastUpdated: '2023-04-22',
    description: 'Script for notifying clients about a rate increase during the application process.',
  },
  {
    id: 4,
    title: 'Document Collection Call',
    category: 'Processing',
    lastUpdated: '2023-03-15',
    description: 'Guide for requesting additional documentation from applicants.',
  },
  {
    id: 5,
    title: 'Pre-Approval Consultation',
    category: 'Sales',
    lastUpdated: '2023-06-10',
    description: 'Script for pre-approval consultations with potential borrowers.',
  },
  {
    id: 6,
    title: 'Closing Process Explanation',
    category: 'Closing',
    lastUpdated: '2023-05-05',
    description: 'Detailed explanation of the closing process for applicants.',
  },
];

// Script card component
interface ScriptCardProps {
  script: Script;
  viewMode: 'grid' | 'list';
}

const ScriptCard: React.FC<ScriptCardProps> = ({ script, viewMode }) => {
  const { isAdmin } = useAuth();
  
  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">{script.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{script.category}</Badge>
              <span className="text-xs text-muted-foreground">
                Updated: {script.lastUpdated}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/scripts/${script.id}`}>
              View
            </Link>
          </Button>
          {isAdmin() && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/scripts/edit/${script.id}`}>
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
            <CardTitle className="text-base">{script.title}</CardTitle>
            <CardDescription className="text-xs">{script.category}</CardDescription>
          </div>
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <FileText className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-700 line-clamp-2 protected-content">{script.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <span className="text-xs text-muted-foreground">
          Last updated: {script.lastUpdated}
        </span>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-primary">
          <Link to={`/scripts/${script.id}`}>
            View <ChevronRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const Scripts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState<boolean>(false);
  const { isAdmin } = useAuth();

  // Filter scripts based on search term and category
  const filteredScripts = MOCK_SCRIPTS.filter((script) => {
    const matchesSearch =
      script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'All Categories' || script.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Call & Training Scripts</h1>
          <p className="text-muted-foreground">Access conversation guides and training scripts</p>
        </div>
        {isAdmin() && (
          <Button asChild>
            <Link to="/scripts/edit/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Script
            </Link>
          </Button>
        )}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scripts..."
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
                {SCRIPT_CATEGORIES.map((category) => (
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

      {/* Scripts List */}
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
              {filteredScripts.map((script) => (
                <ScriptCard key={script.id} script={script} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredScripts.map((script) => (
                <ScriptCard key={script.id} script={script} viewMode={viewMode} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {filteredScripts.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="rounded-full bg-gray-100 p-4 text-gray-500">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium">No Scripts Found</h3>
          <p className="text-muted-foreground max-w-md text-center">
            We couldn't find any scripts matching your search criteria. Try adjusting your filters or search terms.
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

export default Scripts;