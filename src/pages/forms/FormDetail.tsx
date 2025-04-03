import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Printer, 
  Edit, 
  Trash2,
  AlertTriangle,
  Share2,
  Download,
  User,
  File,
  ClipboardCopy,
  Check,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
import { useToast } from '@/components/ui/use-toast';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

// Mock Form data
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
        
        <!-- Loan Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Loan Information</h3>
          
          <div class="space-y-1">
            <label for="loanType" class="block text-sm font-medium">Loan Type Requested *</label>
            <select id="loanType" name="loanType" required class="w-full p-2 border rounded">
              <option value="">Select Loan Type</option>
              <option value="purchase">Purchase</option>
              <option value="refinance">Refinance</option>
              <option value="heloc">HELOC</option>
              <option value="reverse">Reverse Mortgage</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="estimatedAmount" class="block text-sm font-medium">Estimated Loan Amount *</label>
              <input type="number" id="estimatedAmount" name="estimatedAmount" required class="w-full p-2 border rounded" />
            </div>
            
            <div class="space-y-1">
              <label for="propertyType" class="block text-sm font-medium">Property Type *</label>
              <select id="propertyType" name="propertyType" required class="w-full p-2 border rounded">
                <option value="">Select Property Type</option>
                <option value="singleFamily">Single Family</option>
                <option value="multiFamily">Multi-Family</option>
                <option value="condo">Condominium</option>
                <option value="townhouse">Townhouse</option>
                <option value="manufactured">Manufactured Home</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div class="space-y-1">
            <label for="timeframe" class="block text-sm font-medium">Purchase/Refinance Timeframe *</label>
            <select id="timeframe" name="timeframe" required class="w-full p-2 border rounded">
              <option value="">Select Timeframe</option>
              <option value="immediately">Immediately (0-30 days)</option>
              <option value="soon">Soon (1-3 months)</option>
              <option value="planning">Planning (3-6 months)</option>
              <option value="future">Future (6+ months)</option>
            </select>
          </div>
        </div>
        
        <!-- Lead Source Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Lead Source Information</h3>
          
          <div class="space-y-1">
            <label for="leadSource" class="block text-sm font-medium">Lead Source *</label>
            <select id="leadSource" name="leadSource" required class="w-full p-2 border rounded">
              <option value="">Select Lead Source</option>
              <option value="website">Company Website</option>
              <option value="referral">Referral</option>
              <option value="realtor">Realtor Partner</option>
              <option value="returning">Returning Customer</option>
              <option value="social">Social Media</option>
              <option value="advertising">Advertising</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div class="space-y-1">
            <label for="sourceDetails" class="block text-sm font-medium">Source Details</label>
            <input type="text" id="sourceDetails" name="sourceDetails" class="w-full p-2 border rounded" placeholder="e.g., Referral name, Website URL, Ad campaign" />
          </div>
          
          <div class="space-y-1">
            <label for="leadQuality" class="block text-sm font-medium">Lead Quality Rating (1-5) *</label>
            <select id="leadQuality" name="leadQuality" required class="w-full p-2 border rounded">
              <option value="">Select Rating</option>
              <option value="5">5 - Excellent (Ready to proceed)</option>
              <option value="4">4 - Good (Highly interested)</option>
              <option value="3">3 - Average (Interested but with questions)</option>
              <option value="2">2 - Fair (Just exploring options)</option>
              <option value="1">1 - Poor (Minimal interest)</option>
            </select>
          </div>
        </div>
        
        <!-- Additional Notes -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Additional Notes</h3>
          
          <div class="space-y-1">
            <label for="notes" class="block text-sm font-medium">Notes</label>
            <textarea id="notes" name="notes" rows="4" class="w-full p-2 border rounded" placeholder="Add any additional information about the lead..."></textarea>
          </div>
          
          <div class="space-y-1">
            <label for="followUpDate" class="block text-sm font-medium">Recommended Follow-up Date *</label>
            <input type="date" id="followUpDate" name="followUpDate" required class="w-full p-2 border rounded" />
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
      { id: 'loanType', label: 'Loan Type Requested', type: 'select', required: true },
      { id: 'estimatedAmount', label: 'Estimated Loan Amount', type: 'number', required: true },
      { id: 'propertyType', label: 'Property Type', type: 'select', required: true },
      { id: 'timeframe', label: 'Purchase/Refinance Timeframe', type: 'select', required: true },
      { id: 'leadSource', label: 'Lead Source', type: 'select', required: true },
      { id: 'sourceDetails', label: 'Source Details', type: 'text', required: false },
      { id: 'leadQuality', label: 'Lead Quality Rating', type: 'select', required: true },
      { id: 'notes', label: 'Notes', type: 'textarea', required: false },
      { id: 'followUpDate', label: 'Recommended Follow-up Date', type: 'date', required: true },
    ],
  },
  '2': {
    id: 2,
    title: 'Credit Pull Authorization',
    category: 'Credit',
    lastUpdated: '2023-05-22',
    description: 'Authorization form for pulling credit reports during the application process.',
    instructions: `
      <h3>Form Usage Instructions</h3>
      <p>This form must be completed and signed by each applicant before a credit report can be pulled. Both electronic and physical signatures are acceptable.</p>
      
      <h4>Key Points:</h4>
      <ul>
        <li>Verify the applicant's identity before proceeding with the credit pull</li>
        <li>Ensure all fields are completed accurately, especially Social Security Numbers</li>
        <li>The applicant must acknowledge all disclosures by checking the boxes</li>
        <li>File the completed authorization in the client's folder for audit purposes</li>
      </ul>
      
      <h4>Regulatory Compliance:</h4>
      <p>This form complies with FCRA requirements for credit authorization. The form should be retained for at least 2 years after the credit report is pulled.</p>
    `,
    formCode: `
      <form id="creditPullAuth" class="space-y-6">
        <!-- Header Section -->
        <div class="text-center py-4">
          <h2 class="text-xl font-bold">Credit Report Authorization Form</h2>
          <p class="text-sm text-gray-600">Authorization to Release Information to [Company Name]</p>
        </div>
        
        <!-- Applicant Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Applicant Information</h3>
          
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
              <label for="middleInitial" class="block text-sm font-medium">Middle Initial</label>
              <input type="text" id="middleInitial" name="middleInitial" maxlength="1" class="w-full p-2 border rounded" />
            </div>
            
            <div class="space-y-1">
              <label for="suffixName" class="block text-sm font-medium">Suffix</label>
              <select id="suffixName" name="suffixName" class="w-full p-2 border rounded">
                <option value="">None</option>
                <option value="Jr">Jr.</option>
                <option value="Sr">Sr.</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
              </select>
            </div>
          </div>
          
          <div class="space-y-1">
            <label for="ssn" class="block text-sm font-medium">Social Security Number *</label>
            <input type="text" id="ssn" name="ssn" required pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" placeholder="XXX-XX-XXXX" class="w-full p-2 border rounded" />
            <p class="text-xs text-gray-500">Format: XXX-XX-XXXX</p>
          </div>
          
          <div class="space-y-1">
            <label for="dob" class="block text-sm font-medium">Date of Birth *</label>
            <input type="date" id="dob" name="dob" required class="w-full p-2 border rounded" />
          </div>
        </div>
        
        <!-- Current Address -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Current Address</h3>
          
          <div class="space-y-1">
            <label for="currentAddress" class="block text-sm font-medium">Street Address *</label>
            <input type="text" id="currentAddress" name="currentAddress" required class="w-full p-2 border rounded" />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-1">
              <label for="currentCity" class="block text-sm font-medium">City *</label>
              <input type="text" id="currentCity" name="currentCity" required class="w-full p-2 border rounded" />
            </div>
            
            <div class="space-y-1">
              <label for="currentState" class="block text-sm font-medium">State *</label>
              <select id="currentState" name="currentState" required class="w-full p-2 border rounded">
                <option value="">Select State</option>
                <!-- State options would be listed here -->
              </select>
            </div>
            
            <div class="space-y-1">
              <label for="currentZip" class="block text-sm font-medium">ZIP Code *</label>
              <input type="text" id="currentZip" name="currentZip" required pattern="[0-9]{5}(-[0-9]{4})?" class="w-full p-2 border rounded" />
            </div>
          </div>
          
          <div class="space-y-1">
            <label for="timeAtAddress" class="block text-sm font-medium">Time at Current Address *</label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <input type="number" id="yearsAtAddress" name="yearsAtAddress" required min="0" placeholder="Years" class="w-full p-2 border rounded" />
              </div>
              <div>
                <input type="number" id="monthsAtAddress" name="monthsAtAddress" required min="0" max="11" placeholder="Months" class="w-full p-2 border rounded" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Authorization and Disclosures -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Authorizations and Disclosures</h3>
          
          <div class="space-y-2">
            <div class="flex items-start">
              <input type="checkbox" id="authCreditPull" name="authCreditPull" required class="mt-1 mr-2" />
              <label for="authCreditPull" class="text-sm">
                I hereby authorize [Company Name] to obtain my credit report including my credit score, credit history, and public record information. I understand that the information obtained will be used to determine my eligibility for a mortgage loan and for other permissible purposes.
              </label>
            </div>
            
            <div class="flex items-start">
              <input type="checkbox" id="authFCRA" name="authFCRA" required class="mt-1 mr-2" />
              <label for="authFCRA" class="text-sm">
                I acknowledge that I have received a copy of the "Fair Credit Reporting Act Notice" and understand my rights under the FCRA.
              </label>
            </div>
            
            <div class="flex items-start">
              <input type="checkbox" id="authAccuracy" name="authAccuracy" required class="mt-1 mr-2" />
              <label for="authAccuracy" class="text-sm">
                I certify that the information provided on this form is true and correct to the best of my knowledge.
              </label>
            </div>
          </div>
        </div>
        
        <!-- Signature -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Signature</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="signatureDate" class="block text-sm font-medium">Date *</label>
              <input type="date" id="signatureDate" name="signatureDate" required class="w-full p-2 border rounded" />
            </div>
            
            <div class="space-y-1">
              <label for="signature" class="block text-sm font-medium">Applicant Signature *</label>
              <div class="border rounded p-4 bg-gray-50 h-20 flex items-center justify-center">
                <p class="text-sm text-gray-500">E-signature capability would be implemented here</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Form Submission -->
        <div class="flex justify-end space-x-4">
          <button type="reset" class="px-4 py-2 border rounded bg-gray-100">Clear Form</button>
          <button type="submit" class="px-4 py-2 rounded bg-primary text-white">Submit Authorization</button>
        </div>
      </form>
    `,
    formFields: [
      { id: 'firstName', label: 'First Name', type: 'text', required: true },
      { id: 'lastName', label: 'Last Name', type: 'text', required: true },
      { id: 'middleInitial', label: 'Middle Initial', type: 'text', required: false },
      { id: 'suffixName', label: 'Suffix', type: 'select', required: false },
      { id: 'ssn', label: 'Social Security Number', type: 'text', required: true },
      { id: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { id: 'currentAddress', label: 'Street Address', type: 'text', required: true },
      { id: 'currentCity', label: 'City', type: 'text', required: true },
      { id: 'currentState', label: 'State', type: 'select', required: true },
      { id: 'currentZip', label: 'ZIP Code', type: 'text', required: true },
      { id: 'yearsAtAddress', label: 'Years at Current Address', type: 'number', required: true },
      { id: 'monthsAtAddress', label: 'Months at Current Address', type: 'number', required: true },
      { id: 'authCreditPull', label: 'Credit Pull Authorization', type: 'checkbox', required: true },
      { id: 'authFCRA', label: 'FCRA Acknowledgment', type: 'checkbox', required: true },
      { id: 'authAccuracy', label: 'Information Accuracy', type: 'checkbox', required: true },
      { id: 'signatureDate', label: 'Signature Date', type: 'date', required: true },
      { id: 'signature', label: 'Applicant Signature', type: 'signature', required: true }
    ]
  }
};

const FormDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [copyButtonText, setCopyButtonText] = useState<string>("Copy Code");

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchForm = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        if (id && MOCK_FORM_DATA[id]) {
          setForm(MOCK_FORM_DATA[id]);
        }
        setLoading(false);
      }, 500);
    };

    fetchForm();
  }, [id]);

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  // Handle delete form
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

  // Handle code copy
  const handleCopyCode = () => {
    if (form) {
      navigator.clipboard.writeText(form.formCode);
      setCopyButtonText("Copied!");
      toast({
        title: "Code copied",
        description: "Form code copied to clipboard"
      });
      setTimeout(() => setCopyButtonText("Copy Code"), 2000);
    }
  };

  // Disable right-click for content protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Only prevent context menu on protected elements
      if ((e.target as HTMLElement).closest('.protected-content')) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/forms">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <div className="flex space-x-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="rounded-full bg-yellow-100 p-4 text-yellow-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-center">Form Not Found</h2>
        <p className="text-gray-600 text-center max-w-md">
          The form you're looking for doesn't exist or you don't have access to view it.
        </p>
        <Button onClick={() => navigate('/forms')}>
          Back to Forms
        </Button>
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
            <BreadcrumbLink>{form.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2 items-center text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last updated: {form.lastUpdated}</span>
            </div>
            <span>•</span>
            <Badge variant="outline" className="ml-2">{form.category}</Badge>
          </div>
          <p className="mt-2 text-muted-foreground">{form.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
          
          {isAdmin() && (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate(`/forms/edit/${form.id}`)}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              
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
            </>
          )}
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Form Preview</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="code">Form Code</TabsTrigger>
        </TabsList>
        
        {/* Form Preview Tab */}
        <TabsContent value="preview">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="print:pt-8">
                {/* Notice about form preview */}
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 print:hidden flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800">Form Preview</h3>
                    <p className="text-sm text-amber-700 mt-0.5">
                      This is a preview of the form. For actual form submission, please use the embedded form on your application system.
                    </p>
                  </div>
                </div>

                {/* The actual Form preview */}
                <div 
                  className="form-preview protected-content" 
                  dangerouslySetInnerHTML={{ __html: form.formCode }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Instructions Tab */}
        <TabsContent value="instructions">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div 
                className="prose prose-slate max-w-none protected-content" 
                dangerouslySetInnerHTML={{ __html: form.instructions }}
              ></div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Form Code Tab */}
        <TabsContent value="code">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Form HTML Code</CardTitle>
                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                  {copyButtonText === "Copy Code" ? (
                    <Copy className="h-4 w-4 mr-1" />
                  ) : (
                    <Check className="h-4 w-4 mr-1" />
                  )}
                  {copyButtonText}
                </Button>
              </div>
              <CardDescription>
                This HTML code can be used to embed the form in your application or website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="p-4 bg-gray-50 rounded-md border overflow-x-auto text-sm font-mono h-[400px] overflow-y-auto">
                  {form.formCode}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormDetail;