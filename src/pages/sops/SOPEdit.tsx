import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Define SOP interface
interface SOP {
  id: number;
  title: string;
  category: string;
  lastUpdated: string;
  author: string;
  version: string;
  content: string;
  description?: string;
}

// Mock SOP categories
const SOP_CATEGORIES = [
  'Loan Processing',
  'Credit Verification',
  'Verification',
  'Rate Management',
  'Closing',
  'Quality Control',
];

// Mock SOP content data
const MOCK_SOP_CONTENT: Record<string, SOP> = {
  '1': {
    id: 1,
    title: 'Loan Application Process',
    category: 'Loan Processing',
    lastUpdated: '2023-04-15',
    author: 'John Smith',
    version: '2.3',
    description: 'Standard operating procedure for processing loan applications from start to finish.',
    content: `
      <h2>1. Introduction</h2>
      <p>This Standard Operating Procedure (SOP) outlines the steps and requirements for processing loan applications within our mortgage team. Following these procedures ensures consistency, compliance, and efficiency in the loan application process.</p>
      
      <h2>2. Scope</h2>
      <p>This procedure applies to all mortgage loan applications received through our various channels (online, in-person, broker referrals). It covers the initial application receipt through submission to underwriting.</p>
      
      <h2>3. Responsibilities</h2>
      <ul>
        <li><strong>Loan Officers:</strong> Initial client contact, application intake, and preliminary qualification</li>
        <li><strong>Loan Officer Assistants:</strong> Documentation collection, verification, and organization</li>
        <li><strong>Processors:</strong> Application completion, system entry, and submission preparation</li>
      </ul>
      
      <h2>4. Procedure</h2>
      <h3>4.1 Application Receipt</h3>
      <ol>
        <li>Verify applicant identity using government-issued ID</li>
        <li>Collect signed borrower authorization forms</li>
        <li>Enter initial application data in the loan origination system within 24 hours of receipt</li>
        <li>Send welcome package and disclosures within 48 hours</li>
      </ol>
      
      <h3>4.2 Document Collection</h3>
      <ol>
        <li>Create digital loan folder with standardized naming convention: [LastName]_[LoanNumber]_[Date]</li>
        <li>Request and verify the following documents:
          <ul>
            <li>Income verification (last 2 years W-2s, 1099s, tax returns)</li>
            <li>Employment verification (30 days of pay stubs)</li>
            <li>Asset documentation (2 months of bank statements)</li>
            <li>Identity documentation (government-issued photo ID)</li>
          </ul>
        </li>
        <li>Track missing documents using the Documentation Checklist form</li>
      </ol>
      
      <h3>4.3 Credit Review</h3>
      <ol>
        <li>Pull tri-merge credit report after receiving authorization</li>
        <li>Review credit scores and determine loan program eligibility</li>
        <li>Identify any credit issues requiring explanation or resolution</li>
        <li>Document all credit findings in the loan file notes</li>
      </ol>
      
      <h3>4.4 Application Submission</h3>
      <ol>
        <li>Complete application package with all required documentation</li>
        <li>Conduct quality check using the Pre-Submission Checklist</li>
        <li>Submit completed file to underwriting department</li>
        <li>Update loan status in the system and notify borrower of submission</li>
      </ol>
      
      <h2>5. Quality Control</h2>
      <p>Prior to submission to underwriting, files must undergo the following quality control checks:</p>
      <ul>
        <li>Ensure all required documents are present and properly signed</li>
        <li>Verify data consistency across all application documents</li>
        <li>Confirm preliminary DTI calculations meet program guidelines</li>
        <li>Validate property information against preliminary title report</li>
      </ul>
      
      <h2>6. References</h2>
      <ul>
        <li>Fannie Mae Selling Guide</li>
        <li>FHA Handbook 4000.1</li>
        <li>VA Lenders Handbook</li>
        <li>Internal Documentation Checklist</li>
        <li>Pre-Submission Quality Control Form</li>
      </ul>
    `,
  },
};

// Default new SOP template
const DEFAULT_NEW_SOP: Omit<SOP, 'id'> = {
  title: '',
  category: 'Loan Processing',
  lastUpdated: new Date().toISOString().split('T')[0],
  author: '',
  version: '1.0',
  description: '',
  content: `
    <h2>1. Introduction</h2>
    <p>Enter the introduction to this SOP here.</p>
    
    <h2>2. Scope</h2>
    <p>Define the scope of this procedure.</p>
    
    <h2>3. Responsibilities</h2>
    <ul>
      <li>Enter responsibilities here</li>
    </ul>
    
    <h2>4. Procedure</h2>
    <h3>4.1 [Step Title]</h3>
    <ol>
      <li>Enter procedure steps here</li>
    </ol>
    
    <h2>5. References</h2>
    <ul>
      <li>Enter references here</li>
    </ul>
  `,
};

const SOPEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [sop, setSop] = useState<SOP | (Omit<SOP, 'id'> & { id?: number })>(
    isEditing ? { id: 0, title: '', category: '', lastUpdated: '', author: '', version: '', content: '' } : DEFAULT_NEW_SOP
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchSOP = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        if (isEditing && id && MOCK_SOP_CONTENT[id]) {
          setSop(MOCK_SOP_CONTENT[id]);
        } else if (!isEditing) {
          // Set default author to current user
          setSop({
            ...DEFAULT_NEW_SOP,
            author: currentUser?.name || '',
          });
        }
        setLoading(false);
      }, 500);
    };

    fetchSOP();
  }, [id, isEditing, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSop(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setSop(prev => ({ ...prev, category: value }));
  };

  const handleSave = () => {
    setSaving(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setSaving(false);
      
      toast({
        title: isEditing ? "SOP updated" : "SOP created",
        description: isEditing 
          ? `SOP "${sop.title}" has been updated successfully` 
          : `SOP "${sop.title}" has been created successfully`,
      });
      
      navigate(isEditing ? `/sops/${id}` : '/sops');
    }, 1000);
  };

  const handleDelete = () => {
    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "SOP deleted",
        description: "The SOP was successfully deleted",
      });
      navigate('/sops');
    }, 500);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/sops">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
          <Skeleton className="h-4 w-40" />
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-60 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/sops">SOPs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{isEditing ? `Edit: ${sop.title}` : "Create New SOP"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? `Edit SOP: ${sop.title}` : "Create New SOP"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update the SOP details and content" : "Create a new standard operating procedure document"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing && (
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the SOP
                    "{sop.title}" and remove it from the system.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1" /> 
            {saving ? 'Saving...' : 'Save SOP'}
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                SOP Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={sop.title} 
                    onChange={handleChange} 
                    placeholder="Enter SOP title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={sop.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOP_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author" 
                    name="author" 
                    value={sop.author} 
                    onChange={handleChange} 
                    placeholder="Enter author name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input 
                    id="version" 
                    name="version" 
                    value={sop.version} 
                    onChange={handleChange} 
                    placeholder="Enter version (e.g., 1.0)"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={sop.description || ''}
                  onChange={handleChange} 
                  placeholder="Enter a brief description of this SOP"
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML)</Label>
                <div className="border rounded-md">
                  <Textarea 
                    id="content" 
                    name="content" 
                    value={sop.content} 
                    onChange={handleChange} 
                    placeholder="Enter the SOP content in HTML format"
                    className="min-h-[400px] font-mono text-sm border-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You can use HTML tags to format the content. Common tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/sops')}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1" /> 
                {saving ? 'Saving...' : 'Save SOP'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>{sop.title || 'Untitled SOP'}</CardTitle>
              {sop.description && <p className="text-muted-foreground mt-1">{sop.description}</p>}
              
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                <div>Category: {sop.category || 'Uncategorized'}</div>
                <div className="mx-2">•</div>
                <div>Author: {sop.author || 'Unknown'}</div>
                <div className="mx-2">•</div>
                <div>Version: {sop.version || '1.0'}</div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Notice about copy protection */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Content Preview</h3>
                  <p className="text-sm text-amber-700 mt-0.5">
                    This is a preview of how the SOP will appear to users.
                  </p>
                </div>
              </div>
              
              {/* SOP content preview */}
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: sop.content }}
              ></div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setActiveTab("edit")}>
                Back to Edit
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SOPEdit;