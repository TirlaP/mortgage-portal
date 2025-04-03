import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  AlertTriangle,
  FileText,
  Plus,
  X
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
import { Checkbox } from '@/components/ui/checkbox';

// Define Form interface
interface Form {
  id: number;
  title: string;
  category: string;
  lastUpdated: string;
  description: string;
  formCode: string;
  formFields: FormField[];
  instructions: string;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

// Mock Form categories
const FORM_CATEGORIES = [
  'Lead Management',
  'Credit',
  'Verification',
  'Processing',
  'Rate Management',
];

// Field types
const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email Input' },
  { value: 'tel', label: 'Phone Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'date', label: 'Date Input' },
  { value: 'select', label: 'Select Dropdown' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'file', label: 'File Upload' },
  { value: 'signature', label: 'Signature Field' },
];

// Mock Form data for editing
const MOCK_FORM_DATA: Record<string, Form> = {
  '1': {
    id: 1,
    title: 'Lead Intake Form',
    category: 'Lead Management',
    lastUpdated: '2023-06-05',
    description: 'Form for collecting new lead information and initiating the follow-up process.',
    instructions: `
      <h3>Form Usage Instructions</h3>
      <p>This form should be completed for all new leads. The information collected will be used to initiate the follow-up process and qualify leads for appropriate mortgage products.</p>
      
      <h4>Key Points:</h4>
      <ul>
        <li>Complete all fields marked as required</li>
        <li>For inquiries from websites, include the specific source URL</li>
        <li>Rate leads based on initial conversation using our 1-5 qualification scale</li>
        <li>Submit the form after completion for automatic assignment to the appropriate loan officer</li>
      </ul>
      
      <h4>Data Protection:</h4>
      <p>This form collects personal information covered under privacy regulations. Ensure you have verbal consent to collect and process this data. The submitted information should not be shared outside the company or used for purposes other than mortgage-related communications.</p>
    `,
    formCode: `
      <form id="leadIntakeForm" class="space-y-6">
        <!-- Personal Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Personal Information</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="firstName" class="block text-sm font-medium">First Name *</label>
              <input type="text" id="firstName" name="firstName" required class="w-full p-2 border rounded" />
            </div>
            
            <div class="space-y-1">
              <label for="lastName" class="block text-sm font-medium">Last Name *</label>
              <input type="text" id="lastName" name="lastName" required class="w-full p-2 border rounded" />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="email" class="block text-sm font-medium">Email Address *</label>
              <input type="email" id="email" name="email" required class="w-full p-2 border rounded" />
            </div>
            
            <div class="space-y-1">
              <label for="phone" class="block text-sm font-medium">Phone Number *</label>
              <input type="tel" id="phone" name="phone" required class="w-full p-2 border rounded" />
            </div>
          </div>
          
          <div class="space-y-1">
            <label for="address" class="block text-sm font-medium">Address</label>
            <input type="text" id="address" name="address" class="w-full p-2 border rounded" />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-1">
              <label for="city" class="block text-sm font-medium">City</label>
              <input type="text" id="city" name="city" class="w-full p-2 border rounded" />
            </div>
            
            <div class="space-y-1">
              <label for="state" class="block text-sm font-medium">State</label>
              <select id="state" name="state" class="w-full p-2 border rounded">
                <option value="">Select State</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <!-- More states here -->
                <option value="WY">Wyoming</option>
              </select>
            </div>
            
            <div class="space-y-1">
              <label for="zip" class="block text-sm font-medium">ZIP Code</label>
              <input type="text" id="zip" name="zip" class="w-full p-2 border rounded" />
            </div>
          </div>
        </div>
        
        <!-- Form Submission -->
        <div class="flex justify-end space-x-4">
          <button type="reset" class="px-4 py-2 border rounded bg-gray-100">Reset Form</button>
          <button type="submit" class="px-4 py-2 rounded bg-primary text-white">Submit Lead</button>
        </div>
      </form>
    `,
    formFields: [
      { id: 'firstName', label: 'First Name', type: 'text', required: true },
      { id: 'lastName', label: 'Last Name', type: 'text', required: true },
      { id: 'email', label: 'Email Address', type: 'email', required: true },
      { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { id: 'address', label: 'Address', type: 'text', required: false },
      { id: 'city', label: 'City', type: 'text', required: false },
      { id: 'state', label: 'State', type: 'select', required: false },
      { id: 'zip', label: 'ZIP Code', type: 'text', required: false },
    ],
  }
};

// Default empty form
const DEFAULT_NEW_FORM: Omit<Form, 'id'> = {
  title: '',
  category: 'Lead Management',
  lastUpdated: new Date().toISOString().split('T')[0],
  description: '',
  formCode: `
    <form id="newForm" class="space-y-6">
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Form Section</h3>
        
        <div class="space-y-1">
          <label for="field1" class="block text-sm font-medium">Field Label</label>
          <input type="text" id="field1" name="field1" class="w-full p-2 border rounded" />
        </div>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button type="reset" class="px-4 py-2 border rounded bg-gray-100">Reset</button>
        <button type="submit" class="px-4 py-2 rounded bg-primary text-white">Submit</button>
      </div>
    </form>
  `,
  formFields: [
    { id: 'field1', label: 'Field Label', type: 'text', required: false }
  ],
  instructions: `
    <h3>Form Usage Instructions</h3>
    <p>Instructions for using this form go here.</p>
  `,
};

const FormEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [form, setForm] = useState<Form | (Omit<Form, 'id'> & { id?: number })>(
    isEditing ? { 
      id: 0, 
      title: '', 
      category: '', 
      lastUpdated: '', 
      description: '', 
      formCode: '', 
      formFields: [], 
      instructions: '' 
    } : DEFAULT_NEW_FORM
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchForm = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        if (isEditing && id && MOCK_FORM_DATA[id]) {
          setForm(MOCK_FORM_DATA[id]);
        }
        setLoading(false);
      }, 500);
    };

    fetchForm();
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setForm(prev => ({ ...prev, category: value }));
  };

  const handleSave = () => {
    setSaving(true);
    
    // Update last updated date
    const updatedForm = {
      ...form,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setSaving(false);
      
      toast({
        title: isEditing ? "Form updated" : "Form created",
        description: isEditing 
          ? `Form "${form.title}" has been updated successfully` 
          : `Form "${form.title}" has been created successfully`,
      });
      
      navigate(isEditing ? `/forms/${id}` : '/forms');
    }, 1000);
  };

  const handleDelete = () => {
    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "Form deleted",
        description: "The form was successfully deleted",
      });
      navigate('/forms');
    }, 500);
  };

  // Handle form field operations
  const handleAddField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false
    };
    
    setForm(prev => ({
      ...prev,
      formFields: [...prev.formFields, newField]
    }));
  };

  const handleRemoveField = (fieldId: string) => {
    setForm(prev => ({
      ...prev,
      formFields: prev.formFields.filter(field => field.id !== fieldId)
    }));
  };

  const handleFieldChange = (fieldId: string, property: keyof FormField, value: any) => {
    setForm(prev => ({
      ...prev,
      formFields: prev.formFields.map(field => 
        field.id === fieldId ? { ...field, [property]: value } : field
      )
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/forms">
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
            <BreadcrumbLink href="/forms">Forms</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{isEditing ? `Edit: ${form.title}` : "Create New Form"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? `Edit Form: ${form.title}` : "Create New Form"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update the form details, fields, and code" : "Create a new internal form"}
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
                    This action cannot be undone. This will permanently delete the form
                    "{form.title}" and remove it from the system.
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
            {saving ? 'Saving...' : 'Save Form'}
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="fields">Form Fields</TabsTrigger>
          <TabsTrigger value="code">HTML Code</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Form Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Form Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={form.title} 
                    onChange={handleChange} 
                    placeholder="Enter form title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={form.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORM_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  placeholder="Enter a brief description of this form"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Form Fields Tab */}
        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Form Fields
                </CardTitle>
                <Button size="sm" onClick={handleAddField}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {form.formFields.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-gray-50">
                  <p className="text-muted-foreground">No fields added yet. Click "Add Field" to get started.</p>
                </div>
              ) : (
                form.formFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-2 top-2 h-8 w-8 p-0" 
                      onClick={() => handleRemoveField(field.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${field.id}-label`}>Field Label</Label>
                        <Input 
                          id={`${field.id}-label`}
                          value={field.label}
                          onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${field.id}-type`}>Field Type</Label>
                        <Select 
                          value={field.type}
                          onValueChange={(value) => handleFieldChange(field.id, 'type', value)}
                        >
                          <SelectTrigger id={`${field.id}-type`}>
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                          <SelectContent>
                            {FIELD_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${field.id}-required`}
                          checked={field.required}
                          onCheckedChange={(checked) => handleFieldChange(field.id, 'required', !!checked)}
                        />
                        <Label htmlFor={`${field.id}-required`}>Required Field</Label>
                      </div>
                    </div>
                    
                    {field.type === 'select' || field.type === 'radio' ? (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`${field.id}-options`}>Options (one per line)</Label>
                        <Textarea 
                          id={`${field.id}-options`}
                          value={field.options?.join('\n') || ''}
                          onChange={(e) => handleFieldChange(field.id, 'options', e.target.value.split('\n'))}
                          placeholder="Enter options, one per line"
                          className="min-h-[80px]"
                        />
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* HTML Code Tab */}
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Form HTML Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="formCode">HTML Code</Label>
                <div className="border rounded-md">
                  <Textarea 
                    id="formCode" 
                    name="formCode" 
                    value={form.formCode} 
                    onChange={handleChange} 
                    placeholder="Enter the form HTML code"
                    className="min-h-[400px] font-mono text-sm border-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You can edit the HTML directly or use the Form Fields tab to generate the basic structure.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Instructions Tab */}
        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Form Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions (HTML)</Label>
                <div className="border rounded-md">
                  <Textarea 
                    id="instructions" 
                    name="instructions" 
                    value={form.instructions} 
                    onChange={handleChange} 
                    placeholder="Enter instructions for using this form (HTML format)"
                    className="min-h-[300px] font-mono text-sm border-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You can use HTML tags to format the instructions. Common tags: &lt;h3&gt;, &lt;h4&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Footer Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/forms')}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" /> 
          {saving ? 'Saving...' : 'Save Form'}
        </Button>
      </div>
    </div>
  );
};

export default FormEdit;