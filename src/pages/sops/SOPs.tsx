import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Folder, ChevronRight, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
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

// Define SOP interface
interface SOP {
  id: number;
  title: string;
  category: string;
  lastUpdated: string;
  description: string;
}

// SOP categories for filtering
const SOP_CATEGORIES = [
  'All Categories',
  'Loan Processing',
  'Credit Verification',
  'Verification',
  'Rate Management',
  'Closing',
  'Quality Control',
];

// Mock SOP data
const MOCK_SOPS: SOP[] = [
  {
    id: 1,
    title: 'Loan Application Process',
    category: 'Loan Processing',
    lastUpdated: '2023-04-15',
    description: 'Standard operating procedure for processing loan applications from start to finish.',
  },
  {
    id: 2,
    title: 'Credit Check Guidelines',
    category: 'Credit Verification',
    lastUpdated: '2023-05-22',
    description: 'Guidelines for performing credit checks and analyzing credit reports.',
  },
  {
    id: 3,
    title: 'Document Verification',
    category: 'Verification',
    lastUpdated: '2023-06-10',
    description: 'Procedure for verifying income, employment, and asset documentation.',
  },
  {
    id: 4,
    title: 'Rate Lock Procedures',
    category: 'Rate Management',
    lastUpdated: '2023-04-30',
    description: 'Process for locking in interest rates and managing rate lock expirations.',
  },
  {
    id: 5,
    title: 'Closing Preparation',
    category: 'Closing',
    lastUpdated: '2023-07-05',
    description: 'Steps to prepare for loan closing, including final document review.',
  },
  {
    id: 6,
    title: 'Post-Closing Quality Control',
    category: 'Quality Control',
    lastUpdated: '2023-06-28',
    description: 'Quality control procedures after loan closing.',
  },
];

// SOP card component
interface SOPCardProps {
  sop: SOP;
  viewMode: 'grid' | 'list';
}

const SOPCard: React.FC<SOPCardProps> = ({ sop, viewMode }) => {
  const { isAdmin } = useAuth();
  
  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Folder className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">{sop.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{sop.category}</Badge>
              <span className="text-xs text-muted-foreground">
                Updated: {sop.lastUpdated}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/sops/${sop.id}`}>
              View
            </Link>
          </Button>
          {isAdmin() && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/sops/edit/${sop.id}`}>
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
            <CardTitle className="text-base">{sop.title}</CardTitle>
            <CardDescription className="text-xs">{sop.category}</CardDescription>
          </div>
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Folder className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-700 line-clamp-2 protected-content">{sop.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <span className="text-xs text-muted-foreground">
          Last updated: {sop.lastUpdated}
        </span>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-primary">
          <Link to={`/sops/${sop.id}`}>
            View <ChevronRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const SOPs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAdmin } = useAuth();

  // Filter SOPs based on search term and category
  const filteredSOPs = MOCK_SOPS.filter((sop) => {
    const matchesSearch =
      sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sop.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'All Categories' || sop.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Standard Operating Procedures</h1>
          <p className="text-muted-foreground">Access and search all SOPs for the mortgage team</p>
        </div>
        {isAdmin() && (
          <Button asChild>
            <Link to="/sops/edit/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New SOP
            </Link>
          </Button>
        )}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search SOPs..."
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
                {SOP_CATEGORIES.map((category) => (
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

      {/* SOPs List */}
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
              {filteredSOPs.map((sop) => (
                <SOPCard key={sop.id} sop={sop} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredSOPs.map((sop) => (
                <SOPCard key={sop.id} sop={sop} viewMode={viewMode} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {filteredSOPs.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="rounded-full bg-gray-100 p-4 text-gray-500">
            <Folder className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium">No SOPs Found</h3>
          <p className="text-muted-foreground max-w-md text-center">
            We couldn't find any SOPs matching your search criteria. Try adjusting your filters or search terms.
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

export default SOPs;