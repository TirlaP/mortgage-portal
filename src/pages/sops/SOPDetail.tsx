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

// Define SOP interface
interface SOP {
  id: number;
  title: string;
  category: string;
  lastUpdated: string;
  author: string;
  version: string;
  content: string;
}

// Mock SOP content data
const MOCK_SOP_CONTENT: Record<string, SOP> = {
  '1': {
    id: 1,
    title: 'Loan Application Process',
    category: 'Loan Processing',
    lastUpdated: '2023-04-15',
    author: 'John Smith',
    version: '2.3',
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
  '2': {
    id: 2,
    title: 'Credit Check Guidelines',
    category: 'Credit Verification',
    lastUpdated: '2023-05-22',
    author: 'Sarah Johnson',
    version: '1.5',
    content: `
      <h2>1. Introduction</h2>
      <p>This SOP establishes the guidelines for performing credit checks and analyzing credit reports as part of the mortgage approval process.</p>
      
      <h2>2. Purpose</h2>
      <p>The purpose of these guidelines is to ensure consistent and thorough evaluation of borrower creditworthiness in compliance with applicable regulations and internal standards.</p>
      
      <h2>3. Credit Report Requirements</h2>
      <h3>3.1 Report Types</h3>
      <ul>
        <li>Tri-merge credit report (all three credit bureaus) is required for all loan applications</li>
        <li>Single-bureau reports may be used for preliminary screening only</li>
        <li>Reports must be no older than 30 days at the time of loan submission</li>
      </ul>
      
      <h3>3.2 Authorization Requirements</h3>
      <ul>
        <li>Written authorization must be obtained from all applicants before pulling credit</li>
        <li>Authorization forms must be stored in the loan file</li>
        <li>Verbal authorizations must be documented with date, time, and loan officer name</li>
      </ul>
      
      <h2>4. Credit Analysis Procedure</h2>
      <h3>4.1 Credit Score Evaluation</h3>
      <ol>
        <li>Record the middle score from the three bureaus (not the average)</li>
        <li>For multiple applicants, use the lowest middle score for qualification</li>
        <li>Document score differences greater than 20 points between bureaus</li>
      </ol>
      
      <h3>4.2 Credit History Review</h3>
      <ol>
        <li>Analyze payment history for the past 24 months</li>
        <li>Identify all late payments, collections, charge-offs, and public records</li>
        <li>Review credit inquiries within the last 120 days</li>
        <li>Calculate debt-to-income ratio including all tradelines</li>
      </ol>
      
      <h3>4.3 Red Flag Identification</h3>
      <p>Document and investigate the following red flags:</p>
      <ul>
        <li>Address discrepancies or frequent changes</li>
        <li>Recent significant increases in revolving debt</li>
        <li>Multiple recent credit inquiries</li>
        <li>Disputed accounts or fraud alerts</li>
        <li>Authorized user accounts comprising major portion of credit history</li>
      </ul>
      
      <h2>5. Documentation Requirements</h2>
      <ol>
        <li>Complete the Credit Analysis Worksheet for each application</li>
        <li>Obtain written explanations for all derogatory items within the last 24 months</li>
        <li>Include supporting documentation for any disputed information</li>
        <li>Document compensating factors for borderline credit profiles</li>
      </ol>
      
      <h2>6. Regulatory Compliance</h2>
      <p>Ensure compliance with:</p>
      <ul>
        <li>Fair Credit Reporting Act (FCRA)</li>
        <li>Equal Credit Opportunity Act (ECOA)</li>
        <li>Risk-based pricing notification requirements</li>
        <li>Adverse action notice requirements when applicable</li>
      </ul>
    `,
  },
};

const SOPDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sop, setSop] = useState<SOP | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchSOP = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        if (id && MOCK_SOP_CONTENT[id]) {
          setSop(MOCK_SOP_CONTENT[id]);
        }
        setLoading(false);
      }, 500);
    };

    fetchSOP();
  }, [id]);

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  // Handle delete SOP
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
            <Link to="/sops">
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

  if (!sop) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="rounded-full bg-yellow-100 p-4 text-yellow-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-center">SOP Not Found</h2>
        <p className="text-gray-600 text-center max-w-md">
          The SOP you're looking for doesn't exist or you don't have access to view it.
        </p>
        <Button onClick={() => navigate('/sops')}>
          Back to SOPs
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
            <BreadcrumbLink href="/sops">SOPs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{sop.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{sop.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2 items-center text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Last updated: {sop.lastUpdated}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>Author: {sop.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Version: {sop.version}</span>
            </div>
            <Badge variant="outline" className="ml-2">{sop.category}</Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
          
          {isAdmin() && (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate(`/sops/edit/${sop.id}`)}>
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
            </>
          )}
        </div>
      </div>

      {/* SOP Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="print:pt-8">
            {/* Notice about copy protection */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 print:hidden flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">Confidential Document</h3>
                <p className="text-sm text-amber-700 mt-0.5">
                  This document is protected. Unauthorized copying or distribution is prohibited.
                </p>
              </div>
            </div>

            {/* The actual SOP content - protected from copying */}
            <div 
              className="prose prose-slate max-w-none protected-content" 
              dangerouslySetInnerHTML={{ __html: sop.content }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SOPDetail;