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

// Define Script interface
interface Script {
  id: number;
  title: string;
  category: string;
  lastUpdated: string;
  author: string;
  version: string;
  content: string;
  description?: string;
}

// Mock Script categories
const SCRIPT_CATEGORIES = [
  'Sales',
  'Customer Service',
  'Processing',
  'Closing',
];

// Mock Script content data
const MOCK_SCRIPT_CONTENT: Record<string, Script> = {
  '1': {
    id: 1,
    title: 'First-Time Homebuyer Call Script',
    category: 'Sales',
    lastUpdated: '2023-05-18',
    author: 'Jane Smith',
    version: '1.4',
    description: 'Guide for speaking with first-time homebuyers about the mortgage process.',
    content: `
      <h2>First-Time Homebuyer Call Script</h2>
      
      <h3>Introduction</h3>
      <p>"Hello, this is [Your Name] from [Company Name]. I understand you're interested in exploring mortgage options for your first home purchase. Is now a good time to talk?"</p>
      
      <h3>Build Rapport</h3>
      <ul>
        <li>"What prompted you to start looking into homeownership at this time?"</li>
        <li>"Have you started looking at properties yet, or are you just beginning the process?"</li>
        <li>"What areas or neighborhoods are you considering?"</li>
      </ul>
      
      <h3>Gather Initial Information</h3>
      <p>"I'd like to understand your situation better so I can provide the most relevant information:"</p>
      <ul>
        <li>"What's your ideal timeframe for purchasing a home?"</li>
        <li>"Have you been pre-approved for a mortgage before?"</li>
        <li>"Do you have a budget in mind for your home purchase?"</li>
        <li>"Are you currently renting or living with family?"</li>
        <li>"Have you been saving for a down payment? If so, approximately how much do you have saved?"</li>
      </ul>
      
      <h3>Address Common Concerns</h3>
      <p><strong>Concern: "I don't know where to start."</strong></p>
      <p>"Many first-time buyers feel the same way. The process can seem overwhelming, but I'm here to guide you through each step. We typically start with a pre-approval to help you understand your budget, then we can discuss specific loan programs designed for first-time buyers, like FHA loans or programs with lower down payment requirements."</p>
      
      <p><strong>Concern: "I don't think I have enough for a down payment."</strong></p>
      <p>"There are actually several loan programs designed specifically for first-time buyers that require as little as 3% down. Additionally, there may be down payment assistance programs in your area. I'd be happy to explore these options with you."</p>
      
      <p><strong>Concern: "I'm worried about my credit score."</strong></p>
      <p>"While credit is important, there are loan programs available for a range of credit profiles. Let's discuss your specific situation and find the right fit. We might even identify some quick ways to improve your score before applying."</p>
      
      <h3>Explain the Pre-Approval Process</h3>
      <p>"The first concrete step I recommend is getting pre-approved. This will:"</p>
      <ul>
        <li>"Give you a clear understanding of your budget"</li>
        <li>"Make your offers stronger in a competitive market"</li>
        <li>"Identify any potential issues early in the process"</li>
        <li>"Potentially save time once you find a home you want to purchase"</li>
      </ul>
      <p>"The pre-approval process involves reviewing your income, assets, and credit history. We'll need some documentation like pay stubs, tax returns, and bank statements. Would you like me to send you a checklist of the documents we'll need?"</p>
      
      <h3>Discuss First-Time Homebuyer Programs</h3>
      <p>"Let me tell you about some programs specifically designed for first-time homebuyers:"</p>
      <ul>
        <li>"FHA loans: These require as little as 3.5% down and have more flexible credit requirements"</li>
        <li>"Conventional 97 loans: These allow for just 3% down payment"</li>
        <li>"VA loans: If you've served in the military, you might qualify for a zero-down loan"</li>
        <li>"USDA loans: For properties in rural areas, offering zero-down financing"</li>
        <li>"State and local assistance programs: Many states and cities offer special programs for first-time buyers"</li>
      </ul>
      
      <h3>Explain the Homebuying Timeline</h3>
      <p>"Let me give you a quick overview of the typical homebuying timeline:"</p>
      <ol>
        <li>"Pre-approval: 1-3 days"</li>
        <li>"Home shopping with a realtor: Varies, typically 1-3 months"</li>
        <li>"Making an offer and negotiation: 1-7 days"</li>
        <li>"Under contract to closing: Typically 30-45 days"</li>
      </ol>
      <p>"The entire process usually takes about 2-4 months from pre-approval to closing, but can vary based on your specific situation and the local market conditions."</p>
      
      <h3>Address Questions</h3>
      <p>"What questions do you have about the mortgage process or any of the programs I've mentioned?"</p>
      
      <h3>Set Clear Next Steps</h3>
      <p>"Based on our conversation, I'd recommend the following next steps:"</p>
      <ol>
        <li>"Complete a pre-approval application (I can send you a link)"</li>
        <li>"Gather the necessary documentation (I'll send a checklist)"</li>
        <li>"Schedule a follow-up call to review your pre-approval results (how does [specific date/time] work for you?)"</li>
      </ol>
      
      <h3>Closing</h3>
      <p>"Thank you for your time today. I'm excited to help you navigate this journey to homeownership. Please don't hesitate to call or email me with any questions that come up, even outside of business hours. My goal is to make this process as smooth as possible for you."</p>
    `,
  },
};

// Default new Script template
const DEFAULT_NEW_SCRIPT: Omit<Script, 'id'> = {
  title: '',
  category: 'Sales',
  lastUpdated: new Date().toISOString().split('T')[0],
  author: '',
  version: '1.0',
  description: '',
  content: `
    <h2>Script Title</h2>
    
    <h3>Introduction</h3>
    <p>Write your opening remarks here...</p>
    
    <h3>Key Talking Points</h3>
    <ul>
      <li>First key point</li>
      <li>Second key point</li>
      <li>Third key point</li>
    </ul>
    
    <h3>Common Questions and Responses</h3>
    <p><strong>Question: "..."</strong></p>
    <p>Response: "..."</p>
    
    <p><strong>Question: "..."</strong></p>
    <p>Response: "..."</p>
    
    <h3>Closing</h3>
    <p>Write your closing remarks here...</p>
  `,
};

const ScriptEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const [script, setScript] = useState<Script | (Omit<Script, 'id'> & { id?: number })>(
    isEditing ? { id: 0, title: '', category: '', lastUpdated: '', author: '', version: '', content: '' } : DEFAULT_NEW_SCRIPT
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchScript = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        if (isEditing && id && MOCK_SCRIPT_CONTENT[id]) {
          setScript(MOCK_SCRIPT_CONTENT[id]);
        } else if (!isEditing) {
          // Set default author to current user
          setScript({
            ...DEFAULT_NEW_SCRIPT,
            author: currentUser?.name || '',
          });
        }
        setLoading(false);
      }, 500);
    };

    fetchScript();
  }, [id, isEditing, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setScript(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setScript(prev => ({ ...prev, category: value }));
  };

  const handleSave = () => {
    setSaving(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setSaving(false);
      
      toast({
        title: isEditing ? "Script updated" : "Script created",
        description: isEditing 
          ? `Script "${script.title}" has been updated successfully` 
          : `Script "${script.title}" has been created successfully`,
      });
      
      navigate(isEditing ? `/scripts/${id}` : '/scripts');
    }, 1000);
  };

  const handleDelete = () => {
    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "Script deleted",
        description: "The script was successfully deleted",
      });
      navigate('/scripts');
    }, 500);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/scripts">
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
            <BreadcrumbLink href="/scripts">Scripts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{isEditing ? `Edit: ${script.title}` : "Create New Script"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? `Edit Script: ${script.title}` : "Create New Script"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update the script details and content" : "Create a new call or training script"}
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
                    This action cannot be undone. This will permanently delete the script
                    "{script.title}" and remove it from the system.
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
            {saving ? 'Saving...' : 'Save Script'}
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
                Script Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={script.title} 
                    onChange={handleChange} 
                    placeholder="Enter script title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={script.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCRIPT_CATEGORIES.map(category => (
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
                    value={script.author} 
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
                    value={script.version} 
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
                  value={script.description || ''}
                  onChange={handleChange} 
                  placeholder="Enter a brief description of this script"
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML)</Label>
                <div className="border rounded-md">
                  <Textarea 
                    id="content" 
                    name="content" 
                    value={script.content} 
                    onChange={handleChange} 
                    placeholder="Enter the script content in HTML format"
                    className="min-h-[400px] font-mono text-sm border-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You can use HTML tags to format the content. Common tags: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/scripts')}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1" /> 
                {saving ? 'Saving...' : 'Save Script'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>{script.title || 'Untitled Script'}</CardTitle>
              {script.description && <p className="text-muted-foreground mt-1">{script.description}</p>}
              
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                <div>Category: {script.category || 'Uncategorized'}</div>
                <div className="mx-2">•</div>
                <div>Author: {script.author || 'Unknown'}</div>
                <div className="mx-2">•</div>
                <div>Version: {script.version || '1.0'}</div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Notice about copy protection */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Content Preview</h3>
                  <p className="text-sm text-amber-700 mt-0.5">
                    This is a preview of how the script will appear to users.
                  </p>
                </div>
              </div>
              
              {/* Script content preview */}
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: script.content }}
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

export default ScriptEdit;