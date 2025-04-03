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
  Eye,
  Download,
  Clock,
  User
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

// Define Script interface
interface Script {
  id: number;
  title: string;
  category: string;
  lastUpdated: string;
  author: string;
  version: string;
  content: string;
}

// Mock Script content data
const MOCK_SCRIPT_CONTENT: Record<string, Script> = {
  '1': {
    id: 1,
    title: 'First-Time Homebuyer Call Script',
    category: 'Sales',
    lastUpdated: '2023-05-18',
    author: 'Jane Smith',
    version: '1.4',
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
  '2': {
    id: 2,
    title: 'Refinance Opportunity Script',
    category: 'Sales',
    lastUpdated: '2023-06-01',
    author: 'Mike Johnson',
    version: '1.2',
    content: `
      <h2>Refinance Opportunity Script</h2>
      
      <h3>Introduction</h3>
      <p>"Hello, this is [Your Name] from [Company Name]. Am I speaking with [Client Name]? I'm reaching out because I've identified a potential opportunity to improve your current mortgage through refinancing. Do you have a few minutes to discuss this?"</p>
      
      <h3>Build Rapport & Confirm Current Situation</h3>
      <p>"Before I share some specific options, I'd like to confirm a few details about your current mortgage:"</p>
      <ul>
        <li>"You currently have a [type of loan] at approximately [interest rate]%, is that correct?"</li>
        <li>"And you've had this mortgage since around [origination date], is that right?"</li>
        <li>"Have you considered refinancing recently?"</li>
      </ul>
      
      <h3>Explain the Potential Benefit</h3>
      <p>"Based on current market conditions and your specific situation, I believe you might benefit from refinancing. Here's why:"</p>
      
      <p><strong>For Rate Reduction:</strong> "Currently, we're seeing rates that are lower than what you have on your existing mortgage. By refinancing, you could potentially save [estimated amount] per month, which adds up to [annual savings] per year."</p>
      
      <p><strong>For Cash-Out:</strong> "Based on the appreciation in home values in your area and your current mortgage balance, you might have approximately [estimated equity] in home equity. A cash-out refinance could allow you to access some of this equity for home improvements, debt consolidation, or other financial goals."</p>
      
      <p><strong>For Term Adjustment:</strong> "If you're interested in paying off your home sooner, we could look at refinancing to a shorter term, like a 15-year mortgage. While your monthly payment might increase slightly, you'd save substantially on interest over the life of the loan and build equity faster."</p>
      
      <h3>Address Common Concerns</h3>
      <p><strong>Concern: "I've heard refinancing is expensive."</strong></p>
      <p>"That's a valid concern. There are costs associated with refinancing, typically around 2-3% of the loan amount. However, in many cases, the long-term savings outweigh these costs. I can calculate your break-even point—the time it would take for the monthly savings to cover the refinancing costs. Additionally, we often have options to roll these costs into the loan, so you don't have to pay them out of pocket."</p>
      
      <p><strong>Concern: "I don't want to restart my 30-year term."</strong></p>
      <p>"You don't have to restart with a full 30-year term. We can structure your refinance to match your remaining term, or even shorten it if paying off your home sooner is a priority."</p>
      
      <p><strong>Concern: "I just refinanced recently."</strong></p>
      <p>"I understand. Even with a recent refinance, it's worth reviewing your options, as rates have continued to change. Let's look at your specific numbers to see if another refinance makes financial sense at this time."</p>
      
      <h3>Explain the Process</h3>
      <p>"If you're interested in exploring this opportunity, here's what the refinance process would look like:"</p>
      <ol>
        <li>"Application: We'll gather some basic information and documentation"</li>
        <li>"Loan Estimate: You'll receive details about rates, terms, and costs"</li>
        <li>"Underwriting: We'll verify your income, assets, and property value"</li>
        <li>"Closing: Sign final documents and complete the refinance"</li>
      </ol>
      <p>"The entire process typically takes about 30-45 days, and we'll guide you through each step."</p>
      
      <h3>Discuss Specific Options</h3>
      <p>"Based on what you've shared, here are a few specific refinance options that might work well for you:"</p>
      <ul>
        <li>"Option 1: [Specific loan type] with [rate]% interest rate, which would lower your monthly payment by approximately [amount]"</li>
        <li>"Option 2: [Alternate loan type] with [rate]% for a 15-year term, which would increase your payment by [amount] but save you [amount] in total interest"</li>
        <li>"Option 3: Cash-out refinance that would provide you with [amount] in cash while keeping your payment similar to what you have now"</li>
      </ul>
      
      <h3>Address Questions</h3>
      <p>"What questions do you have about the refinance process or any of the options I've presented?"</p>
      
      <h3>Set Clear Next Steps</h3>
      <p>"If you'd like to move forward, here are the next steps:"</p>
      <ol>
        <li>"Complete a refinance application (I can send you a link)"</li>
        <li>"Gather some basic documentation (pay stubs, tax returns, etc.)"</li>
        <li>"Schedule a follow-up call to review your loan options in detail"</li>
      </ol>
      
      <h3>Closing</h3>
      <p>"Thank you for your time today. Even if you're not ready to refinance right now, I'm happy to be a resource for any mortgage-related questions you might have. I'll send you an email summarizing what we discussed, and please feel free to reach out if you have any other questions or when you're ready to explore refinancing further."</p>
    `,
  },
};

const ScriptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchScript = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        if (id && MOCK_SCRIPT_CONTENT[id]) {
          setScript(MOCK_SCRIPT_CONTENT[id]);
        }
        setLoading(false);
      }, 500);
    };

    fetchScript();
  }, [id]);

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  // Handle delete script
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
            <Link to="/scripts">
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

  if (!script) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="rounded-full bg-yellow-100 p-4 text-yellow-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-center">Script Not Found</h2>
        <p className="text-gray-600 text-center max-w-md">
          The script you're looking for doesn't exist or you don't have access to view it.
        </p>
        <Button onClick={() => navigate('/scripts')}>
          Back to Scripts
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
            <BreadcrumbLink href="/scripts">Scripts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{script.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{script.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2 items-center text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last updated: {script.lastUpdated}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>Author: {script.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Version: {script.version}</span>
            </div>
            <Badge variant="outline" className="ml-2">{script.category}</Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
          
          {isAdmin() && (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate(`/scripts/edit/${script.id}`)}>
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
            </>
          )}
        </div>
      </div>

      {/* Script Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="print:pt-8">
            {/* Notice about copy protection */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 print:hidden flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">Confidential Script</h3>
                <p className="text-sm text-amber-700 mt-0.5">
                  This script is protected. Unauthorized copying or distribution is prohibited.
                </p>
              </div>
            </div>

            {/* The actual Script content - protected from copying */}
            <div 
              className="prose prose-slate max-w-none protected-content" 
              dangerouslySetInnerHTML={{ __html: script.content }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScriptDetail;