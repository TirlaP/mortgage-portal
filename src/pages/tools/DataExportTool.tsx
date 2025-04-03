import React, { useState } from 'react';
import { ArrowLeft, Database, Download, Calendar, FileText, Filter, Clock, Table, BarChart, User, Briefcase, FileDown, ChevronDown, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface ExportField {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

interface ExportHistory {
  id: number;
  name: string;
  date: string;
  type: string;
  format: string;
  size: string;
  records: number;
}

interface SavedReport {
  id: number;
  name: string;
  description: string;
  lastRun: string;
  schedule: string | null;
  fields: string[];
  filters: string[];
}

const DataExportTool: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('new-export');
  const [exportName, setExportName] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('last-30-days');
  const [exportFormat, setExportFormat] = useState<string>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [saveReportName, setSaveReportName] = useState<string>('');
  const [saveReportDescription, setSaveReportDescription] = useState<string>('');
  
  // Available export fields
  const availableFields: ExportField[] = [
    // Loan Information
    { id: 'loan_number', name: 'Loan Number', category: 'loan', selected: true },
    { id: 'loan_amount', name: 'Loan Amount', category: 'loan', selected: true },
    { id: 'loan_type', name: 'Loan Type', category: 'loan', selected: true },
    { id: 'loan_purpose', name: 'Loan Purpose', category: 'loan', selected: true },
    { id: 'loan_term', name: 'Loan Term', category: 'loan', selected: false },
    { id: 'interest_rate', name: 'Interest Rate', category: 'loan', selected: true },
    { id: 'status', name: 'Loan Status', category: 'loan', selected: true },
    { id: 'application_date', name: 'Application Date', category: 'loan', selected: true },
    { id: 'closing_date', name: 'Closing Date', category: 'loan', selected: false },
    { id: 'funding_date', name: 'Funding Date', category: 'loan', selected: false },
    
    // Borrower Information
    { id: 'borrower_name', name: 'Borrower Name', category: 'borrower', selected: true },
    { id: 'borrower_email', name: 'Borrower Email', category: 'borrower', selected: false },
    { id: 'borrower_phone', name: 'Borrower Phone', category: 'borrower', selected: false },
    { id: 'borrower_address', name: 'Borrower Address', category: 'borrower', selected: false },
    { id: 'borrower_credit_score', name: 'Credit Score', category: 'borrower', selected: true },
    { id: 'borrower_income', name: 'Annual Income', category: 'borrower', selected: false },
    { id: 'borrower_dti', name: 'Debt-to-Income Ratio', category: 'borrower', selected: false },
    
    // Property Information
    { id: 'property_address', name: 'Property Address', category: 'property', selected: true },
    { id: 'property_city', name: 'Property City', category: 'property', selected: true },
    { id: 'property_state', name: 'Property State', category: 'property', selected: true },
    { id: 'property_zip', name: 'Property ZIP', category: 'property', selected: true },
    { id: 'property_type', name: 'Property Type', category: 'property', selected: false },
    { id: 'property_value', name: 'Property Value', category: 'property', selected: true },
    
    // Loan Officer Information
    { id: 'lo_name', name: 'Loan Officer Name', category: 'loan_officer', selected: true },
    { id: 'lo_email', name: 'Loan Officer Email', category: 'loan_officer', selected: false },
    { id: 'lo_phone', name: 'Loan Officer Phone', category: 'loan_officer', selected: false },
    { id: 'lo_nmls', name: 'Loan Officer NMLS ID', category: 'loan_officer', selected: false },
    
    // Commission & Revenue
    { id: 'loan_fee', name: 'Loan Origination Fee', category: 'revenue', selected: false },
    { id: 'commission', name: 'Commission Amount', category: 'revenue', selected: false },
    { id: 'revenue', name: 'Total Revenue', category: 'revenue', selected: false },
    { id: 'profit_margin', name: 'Profit Margin', category: 'revenue', selected: false },
  ];
  
  // Export history
  const exportHistory: ExportHistory[] = [
    {
      id: 1,
      name: 'Q2 Loan Production',
      date: '2023-07-01',
      type: 'Loan Data',
      format: 'CSV',
      size: '1.2 MB',
      records: 43
    },
    {
      id: 2,
      name: 'June Pipeline Report',
      date: '2023-07-01',
      type: 'Pipeline Data',
      format: 'XLSX',
      size: '896 KB',
      records: 28
    },
    {
      id: 3,
      name: 'Revenue Analysis',
      date: '2023-06-15',
      type: 'Revenue Data',
      format: 'CSV',
      size: '455 KB',
      records: 72
    },
    {
      id: 4,
      name: 'Team Performance',
      date: '2023-06-01',
      type: 'Performance Data',
      format: 'XLSX',
      size: '1.7 MB',
      records: 65
    },
  ];
  
  // Saved reports
  const savedReports: SavedReport[] = [
    {
      id: 1,
      name: 'Monthly Pipeline Report',
      description: 'All active loans with status and borrower details',
      lastRun: '2023-07-01',
      schedule: 'Monthly (1st)',
      fields: ['loan_number', 'loan_amount', 'status', 'borrower_name', 'property_address', 'lo_name'],
      filters: ['Status: Active', 'Application Date: Last 90 days']
    },
    {
      id: 2,
      name: 'Quarterly Revenue Analysis',
      description: 'Detailed revenue breakdown by loan officer',
      lastRun: '2023-06-30',
      schedule: 'Quarterly',
      fields: ['loan_number', 'loan_amount', 'closing_date', 'lo_name', 'commission', 'revenue', 'profit_margin'],
      filters: ['Status: Closed', 'Closing Date: Current Quarter']
    },
    {
      id: 3,
      name: 'Team Performance Report',
      description: 'Performance metrics for all loan officers',
      lastRun: '2023-06-15',
      schedule: null,
      fields: ['lo_name', 'lo_nmls', 'loan_number', 'loan_amount', 'status', 'application_date', 'closing_date'],
      filters: ['Status: Any', 'Application Date: Year to Date']
    }
  ];
  
  // Get field categories
  const fieldCategories = [...new Set(availableFields.map(field => field.category))];
  
  // Toggle field selection
  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(id => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };
  
  // Toggle all fields in a category
  const toggleCategory = (category: string, selected: boolean) => {
    const categoryFieldIds = availableFields
      .filter(field => field.category === category)
      .map(field => field.id);
    
    if (selected) {
      // Add all fields from this category that aren't already selected
      const fieldsToAdd = categoryFieldIds.filter(id => !selectedFields.includes(id));
      setSelectedFields([...selectedFields, ...fieldsToAdd]);
    } else {
      // Remove all fields from this category
      setSelectedFields(selectedFields.filter(id => !categoryFieldIds.includes(id)));
    }
  };
  
  // Check if all fields in a category are selected
  const isCategorySelected = (category: string): boolean => {
    const categoryFieldIds = availableFields
      .filter(field => field.category === category)
      .map(field => field.id);
    
    return categoryFieldIds.every(id => selectedFields.includes(id));
  };
  
  // Check if some fields in a category are selected
  const isCategoryPartiallySelected = (category: string): boolean => {
    const categoryFieldIds = availableFields
      .filter(field => field.category === category)
      .map(field => field.id);
    
    const someSelected = categoryFieldIds.some(id => selectedFields.includes(id));
    const allSelected = categoryFieldIds.every(id => selectedFields.includes(id));
    
    return someSelected && !allSelected;
  };
  
  // Handle export
  const handleExport = () => {
    if (!exportName.trim()) {
      toast({
        title: "Export Name Required",
        description: "Please provide a name for your export",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedFields.length === 0) {
      toast({
        title: "No Fields Selected",
        description: "Please select at least one field to export",
        variant: "destructive"
      });
      return;
    }
    
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      
      toast({
        title: "Export Successful",
        description: `Your export "${exportName}" has been generated and is ready to download.`,
      });
      
      // Optionally show save report modal
      setShowSaveModal(true);
    }, 2000);
  };
  
  // Format category name for display
  const formatCategoryName = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Handle save report
  const handleSaveReport = () => {
    if (!saveReportName.trim()) {
      toast({
        title: "Report Name Required",
        description: "Please provide a name for the saved report",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save the report to the backend
    toast({
      title: "Report Saved",
      description: `Your report "${saveReportName}" has been saved and can be accessed from the Saved Reports tab.`,
    });
    
    setShowSaveModal(false);
    setSaveReportName('');
    setSaveReportDescription('');
  };
  
  // Run a saved report
  const runSavedReport = (reportId: number) => {
    const report = savedReports.find(r => r.id === reportId);
    
    if (!report) return;
    
    toast({
      title: "Running Report",
      description: `Generating "${report.name}" report...`,
    });
    
    // In a real app, this would run the report with the saved settings
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: `Your report "${report.name}" has been generated and is ready to download.`,
      });
    }, 2000);
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

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Export Tool</h1>
        <p className="text-gray-500">Export loan data and generate reports for analysis</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new-export">New Export</TabsTrigger>
          <TabsTrigger value="saved-reports">Saved Reports</TabsTrigger>
          <TabsTrigger value="export-history">Export History</TabsTrigger>
        </TabsList>
        
        {/* New Export Tab */}
        <TabsContent value="new-export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Export Settings */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileDown className="mr-2 h-5 w-5 text-primary" />
                  Export Settings
                </CardTitle>
                <CardDescription>
                  Configure your data export options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exportName">Export Name</Label>
                  <Input
                    id="exportName"
                    placeholder="e.g., June 2023 Loan Pipeline"
                    value={exportName}
                    onChange={(e) => setExportName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select 
                    value={dateRange} 
                    onValueChange={setDateRange}
                  >
                    <SelectTrigger id="dateRange">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                      <SelectItem value="current-month">Current Month</SelectItem>
                      <SelectItem value="previous-month">Previous Month</SelectItem>
                      <SelectItem value="current-quarter">Current Quarter</SelectItem>
                      <SelectItem value="year-to-date">Year to Date</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" type="date" />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="exportFormat">Export Format</Label>
                  <Select 
                    value={exportFormat} 
                    onValueChange={setExportFormat}
                  >
                    <SelectTrigger id="exportFormat">
                      <SelectValue placeholder="Select export format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
                      <SelectItem value="xlsx">XLSX (Excel)</SelectItem>
                      <SelectItem value="pdf">PDF (Portable Document Format)</SelectItem>
                      <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exportFilters">Filters (Optional)</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Select defaultValue="status">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select filter field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="status">Loan Status</SelectItem>
                          <SelectItem value="loan_type">Loan Type</SelectItem>
                          <SelectItem value="loan_amount">Loan Amount</SelectItem>
                          <SelectItem value="loan_officer">Loan Officer</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="equals">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="greater_than">Greater Than</SelectItem>
                          <SelectItem value="less_than">Less Than</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Input placeholder="Filter value" defaultValue="Active" />
                    
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-1" /> Add Another Filter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Field Selection */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Table className="mr-2 h-5 w-5 text-primary" />
                  Field Selection
                </CardTitle>
                <CardDescription>
                  Select the fields to include in your export
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Selected {selectedFields.length} of {availableFields.length} fields
                  </p>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedFields(availableFields.map(f => f.id))}
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedFields([])}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
                
                <Accordion type="multiple" className="w-full" defaultValue={fieldCategories}>
                  {fieldCategories.map((category) => {
                    const isAllSelected = isCategorySelected(category);
                    const isPartiallySelected = isCategoryPartiallySelected(category);
                    
                    return (
                      <AccordionItem value={category} key={category}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={isAllSelected}
                              indeterminate={isPartiallySelected}
                              onCheckedChange={(checked) => toggleCategory(category, !!checked)}
                              id={`category-${category}`}
                            />
                            <Label 
                              htmlFor={`category-${category}`}
                              className="cursor-pointer text-base font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {formatCategoryName(category)}
                            </Label>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6 pt-2">
                            {availableFields
                              .filter(field => field.category === category)
                              .map(field => (
                                <div className="flex items-center space-x-2" key={field.id}>
                                  <Checkbox 
                                    id={field.id}
                                    checked={selectedFields.includes(field.id)}
                                    onCheckedChange={() => toggleField(field.id)}
                                  />
                                  <Label 
                                    htmlFor={field.id}
                                    className="cursor-pointer"
                                  >
                                    {field.name}
                                  </Label>
                                </div>
                              ))
                            }
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Preview Data</Button>
                <Button 
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Generate Export
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Sample Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Database className="mr-2 h-5 w-5 text-primary" />
                Sample Data Preview
              </CardTitle>
              <CardDescription>
                Preview of the data that will be included in your export
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Loan #</th>
                      <th className="px-4 py-2 text-left">Loan Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Borrower</th>
                      <th className="px-4 py-2 text-left">Property Address</th>
                      <th className="px-4 py-2 text-left">Loan Officer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2">LN-2023-10405</td>
                      <td className="px-4 py-2">$425,000</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </td>
                      <td className="px-4 py-2">John Smith</td>
                      <td className="px-4 py-2">123 Main St, Springfield IL</td>
                      <td className="px-4 py-2">Sarah Johnson</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">LN-2023-10392</td>
                      <td className="px-4 py-2">$380,000</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Processing
                        </Badge>
                      </td>
                      <td className="px-4 py-2">Maria Garcia</td>
                      <td className="px-4 py-2">456 Oak Ave, Springfield IL</td>
                      <td className="px-4 py-2">Robert Chen</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">LN-2023-10385</td>
                      <td className="px-4 py-2">$520,000</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          Underwriting
                        </Badge>
                      </td>
                      <td className="px-4 py-2">David Lee</td>
                      <td className="px-4 py-2">789 Elm St, Springfield IL</td>
                      <td className="px-4 py-2">Sarah Johnson</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 text-center text-sm text-muted-foreground">
                Showing 3 of 45 records matching your criteria
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Saved Reports Tab */}
        <TabsContent value="saved-reports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Saved Reports
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Create Report
                </Button>
              </div>
              <CardDescription>
                Run saved reports or manage your report templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{report.name}</CardTitle>
                          <CardDescription className="mt-1">{report.description}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {report.schedule && (
                            <Badge variant="outline" className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {report.schedule}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">Selected Fields:</div>
                          <div className="flex flex-wrap gap-1">
                            {report.fields.map((field, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {availableFields.find(f => f.id === field)?.name || field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Applied Filters:</div>
                          <div className="flex flex-wrap gap-1">
                            {report.filters.map((filter, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {filter}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-xs text-muted-foreground">
                          Last run: {report.lastRun}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button size="sm" onClick={() => runSavedReport(report.id)}>
                            <Download className="h-4 w-4 mr-1" /> Run Report
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Export History Tab */}
        <TabsContent value="export-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Export History
              </CardTitle>
              <CardDescription>
                View and download your previous exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs border-b">
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Date</th>
                      <th className="py-3 px-4 font-medium">Type</th>
                      <th className="py-3 px-4 font-medium">Format</th>
                      <th className="py-3 px-4 font-medium">Size</th>
                      <th className="py-3 px-4 font-medium">Records</th>
                      <th className="py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exportHistory.map((export_item) => (
                      <tr key={export_item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{export_item.name}</td>
                        <td className="py-3 px-4">{export_item.date}</td>
                        <td className="py-3 px-4">{export_item.type}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {export_item.format}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{export_item.size}</td>
                        <td className="py-3 px-4">{export_item.records}</td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" /> Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary" />
                Export Analytics
              </CardTitle>
              <CardDescription>
                Analytics on your export usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Total Exports</div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Most Exported Fields</div>
                  <div className="text-base font-medium">Loan Amount, Status, LO Name</div>
                  <div className="text-xs text-gray-500 mt-1">Used in 87% of exports</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Popular Export Format</div>
                  <div className="text-base font-medium">XLSX (Excel)</div>
                  <div className="text-xs text-gray-500 mt-1">Used in 65% of exports</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Save Report Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Save Report Template</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="saveReportName">Report Name</Label>
                <Input
                  id="saveReportName"
                  placeholder="e.g., Monthly Pipeline Report"
                  value={saveReportName}
                  onChange={(e) => setSaveReportName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saveReportDescription">Description (Optional)</Label>
                <Textarea
                  id="saveReportDescription"
                  placeholder="What does this report show?"
                  value={saveReportDescription}
                  onChange={(e) => setSaveReportDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduleReport">Schedule (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Never (Run Manually)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never (Run Manually)</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowSaveModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveReport}>
                Save Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExportTool;