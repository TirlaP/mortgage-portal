import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Search, Filter, Download, Tag, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Document {
  id: number;
  name: string;
  category: string;
  loanTypes: string[];
  description: string;
  required: boolean;
  availableFormats: string[];
  lastUpdated: string;
}

// Document categories for filtering
const DOCUMENT_CATEGORIES = [
  'All Categories',
  'Income',
  'Assets',
  'Property',
  'Identity',
  'Credit',
  'Disclosures',
  'Compliance',
];

// Loan types for filtering
const LOAN_TYPES = [
  'All Types',
  'Conventional',
  'FHA',
  'VA',
  'USDA',
  'Jumbo',
];

// Mock documents data
const MOCK_DOCUMENTS: Document[] = [
  {
    id: 1,
    name: 'Borrower Authorization Form',
    category: 'Compliance',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    description: 'Authorization for the lender to verify information and pull credit reports.',
    required: true,
    availableFormats: ['PDF', 'DocuSign'],
    lastUpdated: '2023-05-15',
  },
  {
    id: 2,
    name: 'Pay Stubs (30 days)',
    category: 'Income',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    description: 'Most recent 30 days of pay stubs showing year-to-date earnings.',
    required: true,
    availableFormats: ['PDF', 'JPG', 'PNG'],
    lastUpdated: '2023-06-10',
  },
  {
    id: 3,
    name: 'W-2 Statements (2 years)',
    category: 'Income',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    description: 'W-2 forms for the past two years for all borrowers.',
    required: true,
    availableFormats: ['PDF', 'JPG', 'PNG'],
    lastUpdated: '2023-04-22',
  },
  {
    id: 4,
    name: 'Bank Statements (2 months)',
    category: 'Assets',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    description: 'Last two months of bank statements from all accounts showing sufficient funds for closing.',
    required: true,
    availableFormats: ['PDF', 'CSV'],
    lastUpdated: '2023-07-01',
  },
  {
    id: 5,
    name: 'Government-Issued ID',
    category: 'Identity',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    description: "Valid driver's license, passport, or other government-issued photo ID.",
    required: true,
    availableFormats: ['PDF', 'JPG', 'PNG'],
    lastUpdated: '2023-03-18',
  },
  {
    id: 6,
    name: 'Certificate of Eligibility',
    category: 'Compliance',
    loanTypes: ['VA'],
    description: 'Certificate of Eligibility (COE) issued by the Department of Veterans Affairs.',
    required: true,
    availableFormats: ['PDF'],
    lastUpdated: '2023-06-25',
  },
  {
    id: 7,
    name: 'Self-Employment Documentation',
    category: 'Income',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    description: 'Business tax returns for past two years, profit and loss statements, and business bank statements.',
    required: false,
    availableFormats: ['PDF', 'XLS', 'CSV'],
    lastUpdated: '2023-05-30',
  },
  {
    id: 8,
    name: 'Purchase Agreement',
    category: 'Property',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    description: 'Signed purchase agreement/contract including all addendums and revisions.',
    required: true,
    availableFormats: ['PDF', 'DocuSign'],
    lastUpdated: '2023-04-12',
  },
  {
    id: 9,
    name: 'Gift Letter',
    category: 'Assets',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA'],
    description: 'Letter from the donor stating the amount and that repayment is not expected.',
    required: false,
    availableFormats: ['PDF', 'DOC'],
    lastUpdated: '2023-06-18',
  },
  {
    id: 10,
    name: 'Divorce Decree/Separation Agreement',
    category: 'Income',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    description: 'Documentation for alimony or child support payments that affect income or liabilities.',
    required: false,
    availableFormats: ['PDF', 'JPG'],
    lastUpdated: '2023-02-05',
  },
  {
    id: 11,
    name: 'Home Appraisal',
    category: 'Property',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    description: 'Professional appraisal of the property value (ordered by the lender).',
    required: true,
    availableFormats: ['PDF'],
    lastUpdated: '2023-03-28',
  },
  {
    id: 12,
    name: 'Loan Estimate',
    category: 'Disclosures',
    loanTypes: ['Conventional', 'FHA', 'VA', 'USDA', 'Jumbo'],
    description: 'Disclosure provided by the lender within three business days of application.',
    required: true,
    availableFormats: ['PDF', 'DocuSign'],
    lastUpdated: '2023-07-10',
  },
];

const DocumentFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedLoanType, setSelectedLoanType] = useState<string>('All Types');
  const [requiredOnly, setRequiredOnly] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [viewMode, setViewMode] = useState<string>('grid');

  // Filter documents based on search, category, loan type, and required status
  useEffect(() => {
    let filteredDocuments = MOCK_DOCUMENTS;
    
    // Apply search filter
    if (searchTerm) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => 
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.category === selectedCategory
      );
    }
    
    // Apply loan type filter
    if (selectedLoanType !== 'All Types') {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.loanTypes.includes(selectedLoanType)
      );
    }
    
    // Apply required only filter
    if (requiredOnly) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => doc.required
      );
    }
    
    setDocuments(filteredDocuments);
  }, [searchTerm, selectedCategory, selectedLoanType, requiredOnly]);

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedLoanType('All Types');
    setRequiredOnly(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/tools">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tools
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Finder</h1>
          <p className="text-gray-500">Search and locate required documents for various loan types</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
            {viewMode === 'grid' ? 'Table View' : 'Grid View'}
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents by name or description..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-auto flex-1 min-w-[200px]">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-auto flex-1 min-w-[200px]">
                <Select value={selectedLoanType} onValueChange={setSelectedLoanType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiredOnly}
                    onChange={() => setRequiredOnly(!requiredOnly)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Required documents only</span>
                </label>
              </div>
            </div>
            
            {/* Active filters */}
            {(searchTerm || selectedCategory !== 'All Categories' || selectedLoanType !== 'All Types' || requiredOnly) && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                
                {selectedCategory !== 'All Categories' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {selectedCategory}
                  </Badge>
                )}
                
                {selectedLoanType !== 'All Types' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {selectedLoanType}
                  </Badge>
                )}
                
                {requiredOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Required Only
                  </Badge>
                )}
                
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-xs">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document List - Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {doc.name}
                      {doc.required ? 
                        <Badge className="ml-1 bg-red-100 text-red-800 hover:bg-red-100">Required</Badge> : 
                        <Badge variant="outline" className="ml-1">Optional</Badge>
                      }
                    </CardTitle>
                    <CardDescription>{doc.category}</CardDescription>
                  </div>
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{doc.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {doc.loanTypes.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <span>Available formats:</span>
                  <div className="flex ml-2 gap-1">
                    {doc.availableFormats.map((format) => (
                      <Badge key={format} variant="secondary" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <span className="text-xs text-gray-500">
                  Updated: {doc.lastUpdated}
                </span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Download Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Document List - Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Document Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Loan Types</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead className="w-[120px]">Formats</TableHead>
                    <TableHead className="w-[100px]">Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        {doc.name}
                      </TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {doc.loanTypes.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.required ? 
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" /> Yes
                          </span> : 
                          <span className="flex items-center text-gray-400">
                            <XCircle className="h-4 w-4 mr-1" /> No
                          </span>
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {doc.availableFormats.map((format) => (
                            <Badge key={format} variant="secondary" className="text-xs">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{doc.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {documents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="rounded-full bg-gray-100 p-4 text-gray-500">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium">No Documents Found</h3>
          <p className="text-gray-500 max-w-md text-center">
            We couldn't find any documents matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <Button onClick={resetFilters}>Reset All Filters</Button>
        </div>
      )}

      {/* Document guides section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Understanding Required Documents</CardTitle>
          <CardDescription>
            Overview of common documents needed for mortgage applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">General Documents</TabsTrigger>
                <TabsTrigger value="income">Income Verification</TabsTrigger>
                <TabsTrigger value="assets">Asset Documentation</TabsTrigger>
                <TabsTrigger value="property">Property Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="pt-4 space-y-4">
                <p className="text-sm text-gray-700">
                  All mortgage applications require certain basic documentation regardless of loan type. These documents establish your identity and allow lenders to verify your information.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Government-Issued ID</h3>
                    <p className="text-sm text-gray-600">Used to verify your identity. Typically a driver's license, passport, or other government-issued photo ID.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Social Security Number</h3>
                    <p className="text-sm text-gray-600">Required for credit checks and tax verification. Provide your SSN card or other official documentation.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Borrower Authorization Form</h3>
                    <p className="text-sm text-gray-600">Gives the lender permission to verify your employment, income, assets, and pull your credit report.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Application Form</h3>
                    <p className="text-sm text-gray-600">The Uniform Residential Loan Application (Form 1003) with your personal and financial information.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="income" className="pt-4 space-y-4">
                <p className="text-sm text-gray-700">
                  Income documentation proves your ability to repay the loan. Different employment types require different documentation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">W-2 Forms</h3>
                    <p className="text-sm text-gray-600">Past two years of W-2 statements from all employers during that period.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Pay Stubs</h3>
                    <p className="text-sm text-gray-600">Most recent 30 days of pay stubs showing year-to-date earnings.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Tax Returns</h3>
                    <p className="text-sm text-gray-600">Past two years of federal tax returns, particularly important for self-employed borrowers.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Additional Income Documents</h3>
                    <p className="text-sm text-gray-600">Documentation for other income sources like alimony, child support, retirement, or rental income.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="assets" className="pt-4 space-y-4">
                <p className="text-sm text-gray-700">
                  Asset documentation shows you have funds for the down payment, closing costs, and reserves.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Bank Statements</h3>
                    <p className="text-sm text-gray-600">Last two months of statements from all accounts (checking, savings, investments).</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Retirement Account Statements</h3>
                    <p className="text-sm text-gray-600">Recent statements from 401(k), IRA, or other retirement accounts if using for reserves.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Gift Letter</h3>
                    <p className="text-sm text-gray-600">If using gift funds for down payment, a letter from the donor stating the amount and that repayment is not expected.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Proof of Sale</h3>
                    <p className="text-sm text-gray-600">If using funds from selling another property, documentation showing the sale and proceeds.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="property" className="pt-4 space-y-4">
                <p className="text-sm text-gray-700">
                  Property documents provide information about the home you're buying and the terms of the purchase.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Purchase Agreement</h3>
                    <p className="text-sm text-gray-600">Signed contract between you and the seller, including all addendums and counteroffers.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Property Tax Bills</h3>
                    <p className="text-sm text-gray-600">Recent property tax information to calculate escrow requirements.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Homeowners Insurance</h3>
                    <p className="text-sm text-gray-600">Proof of insurance policy for the property before closing.</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Homeowners Association Documents</h3>
                    <p className="text-sm text-gray-600">HOA agreements, fees, and financial information if applicable.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentFinder;