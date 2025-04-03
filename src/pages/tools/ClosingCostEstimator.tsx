import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Home, Calculator, Save, ChevronDown, ChevronUp, Printer, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Define interfaces for the form state and estimates
interface FormState {
  loanAmount: number;
  propertyValue: number;
  downPayment: number;
  downPaymentPercentage: number;
  interestRate: number;
  loanTerm: number;
  creditScore: number;
  propertyType: string;
  propertyState: string;
  firstTimeBuyer: boolean;
  loanType: string;
  propertyTaxRate: number;
  homeownersInsurance: number;
}

interface ClosingCosts {
  loanCosts: {
    originationFee: number;
    applicationFee: number;
    underwritingFee: number;
    processingFee: number;
    creditReportFee: number;
    appraisalFee: number;
    totalLoanCosts: number;
  };
  thirdPartyCosts: {
    titleServices: number;
    surveyFee: number;
    homeInspection: number;
    attorneyFee: number;
    recordingFees: number;
    transferTaxes: number;
    prepaidInterest: number;
    escrowDeposit: number;
    totalThirdPartyCosts: number;
  };
  totalClosingCosts: number;
  cashToClose: number;
}

// State options
const STATE_OPTIONS = [
  { value: 'CA', label: 'California' },
  { value: 'FL', label: 'Florida' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'IL', label: 'Illinois' },
  { value: 'OH', label: 'Ohio' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'GA', label: 'Georgia' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'MI', label: 'Michigan' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'CO', label: 'Colorado' },
];

// Property type options
const PROPERTY_TYPES = [
  { value: 'single-family', label: 'Single-Family Home' },
  { value: 'condo', label: 'Condominium' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'multi-family', label: 'Multi-Family Home' },
];

// Loan type options
const LOAN_TYPES = [
  { value: 'conventional', label: 'Conventional' },
  { value: 'fha', label: 'FHA' },
  { value: 'va', label: 'VA' },
  { value: 'usda', label: 'USDA' },
  { value: 'jumbo', label: 'Jumbo' },
];

// Credit score options
const CREDIT_SCORE_RANGES = [
  { value: 800, label: '800+' },
  { value: 750, label: '750-799' },
  { value: 700, label: '700-749' },
  { value: 650, label: '650-699' },
  { value: 600, label: '600-649' },
  { value: 550, label: '550-599' },
];

const ClosingCostEstimator: React.FC = () => {
  // Default form state
  const defaultFormState: FormState = {
    loanAmount: 300000,
    propertyValue: 350000,
    downPayment: 50000,
    downPaymentPercentage: 14.29,
    interestRate: 4.5,
    loanTerm: 30,
    creditScore: 750,
    propertyType: 'single-family',
    propertyState: 'CA',
    firstTimeBuyer: false,
    loanType: 'conventional',
    propertyTaxRate: 1.2,
    homeownersInsurance: 100,
  };
  
  // State hooks
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [closingCosts, setClosingCosts] = useState<ClosingCosts | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  
  // Calculate down payment and loan amount when property value changes
  useEffect(() => {
    if (formState.propertyValue > 0) {
      const downPaymentPercentage = (formState.downPayment / formState.propertyValue) * 100;
      setFormState(prev => ({
        ...prev,
        downPaymentPercentage: parseFloat(downPaymentPercentage.toFixed(2)),
        loanAmount: formState.propertyValue - formState.downPayment
      }));
    }
  }, [formState.propertyValue, formState.downPayment]);
  
  // Handle property value input change
  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFormState(prev => ({
      ...prev,
      propertyValue: value,
      downPayment: prev.downPaymentPercentage * value / 100,
      loanAmount: value - (prev.downPaymentPercentage * value / 100)
    }));
  };
  
  // Handle down payment input change
  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    
    // Ensure down payment doesn't exceed property value
    const validDownPayment = Math.min(value, formState.propertyValue);
    
    setFormState(prev => ({
      ...prev,
      downPayment: validDownPayment,
      downPaymentPercentage: (validDownPayment / prev.propertyValue) * 100,
      loanAmount: prev.propertyValue - validDownPayment
    }));
  };
  
  // Handle down payment percentage slider change
  const handleDownPaymentPercentageChange = (value: number[]) => {
    const percentage = value[0];
    const downPayment = (percentage / 100) * formState.propertyValue;
    
    setFormState(prev => ({
      ...prev,
      downPaymentPercentage: percentage,
      downPayment: downPayment,
      loanAmount: prev.propertyValue - downPayment
    }));
  };
  
  // Handle generic input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };
  
  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Calculate closing costs
  const calculateClosingCosts = () => {
    setIsCalculating(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Basic loan cost calculations
      let originationFee = formState.loanAmount * 0.01; // 1% of loan amount
      let applicationFee = 500;
      let underwritingFee = 750;
      let processingFee = 450;
      let creditReportFee = 25;
      let appraisalFee = 500;
      
      // Third party costs vary by state, property type, and loan type
      let titleServices = 1500;
      let surveyFee = 400;
      let attorneyFee = 800;
      let recordingFees = 125;
      let transferTaxes = formState.propertyValue * 0.001; // 0.1% by default
      
      // Adjust costs based on state
      if (formState.propertyState === 'NY' || formState.propertyState === 'NJ') {
        titleServices += 500;
        attorneyFee += 700;
        transferTaxes = formState.propertyValue * 0.004; // Higher transfer taxes in these states
      } else if (formState.propertyState === 'CA') {
        titleServices += 300;
        transferTaxes = formState.propertyValue * 0.0011;
      } else if (formState.propertyState === 'FL') {
        titleServices += 100;
        transferTaxes = formState.propertyValue * 0.007;
      }
      
      // Adjust costs based on property type
      if (formState.propertyType === 'condo') {
        surveyFee = 0; // Condos typically don't need surveys
      } else if (formState.propertyType === 'multi-family') {
        appraisalFee += 300; // More expensive for multi-family
        surveyFee += 200;
      }
      
      // Adjust costs based on loan type
      if (formState.loanType === 'fha') {
        underwritingFee += 150; // Additional FHA underwriting requirements
      } else if (formState.loanType === 'va') {
        underwritingFee += 100; // Additional VA underwriting requirements
        // VA funding fee would go here, but can vary significantly
      } else if (formState.loanType === 'jumbo') {
        appraisalFee += 250; // Jumbo loans often have more expensive appraisals
        underwritingFee += 200; // More complex underwriting
      }
      
      // Prepaids and escrow deposits
      const prepaidInterest = (formState.loanAmount * (formState.interestRate / 100) / 365) * 30; // 30 days of interest
      const homeInspection = 450;
      const escrowDeposit = (
        ((formState.propertyValue * (formState.propertyTaxRate / 100)) / 12) +
        formState.homeownersInsurance
      ) * 2; // 2 months of taxes and insurance
      
      // Calculate totals
      const totalLoanCosts = originationFee + applicationFee + underwritingFee + processingFee + creditReportFee + appraisalFee;
      const totalThirdPartyCosts = titleServices + surveyFee + homeInspection + attorneyFee + recordingFees + transferTaxes + prepaidInterest + escrowDeposit;
      const totalClosingCosts = totalLoanCosts + totalThirdPartyCosts;
      const cashToClose = totalClosingCosts + formState.downPayment;
      
      // Set the closing costs state
      setClosingCosts({
        loanCosts: {
          originationFee,
          applicationFee,
          underwritingFee,
          processingFee,
          creditReportFee,
          appraisalFee,
          totalLoanCosts
        },
        thirdPartyCosts: {
          titleServices,
          surveyFee,
          homeInspection,
          attorneyFee,
          recordingFees,
          transferTaxes,
          prepaidInterest,
          escrowDeposit,
          totalThirdPartyCosts
        },
        totalClosingCosts,
        cashToClose
      });
      
      setIsCalculating(false);
    }, 1000); // Simulate delay
  };
  
  // Format currency function
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };
  
  // Reset form to defaults
  const resetForm = () => {
    setFormState(defaultFormState);
    setClosingCosts(null);
  };
  
  // Save or print estimate
  const handleSaveEstimate = () => {
    // In a real app, this would save the estimate to a database or generate a PDF
    // For this demo, we'll just log to console
    console.log('Saving estimate:', { formState, closingCosts });
    alert('Estimate saved successfully!');
  };
  
  const handlePrintEstimate = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-3">
      <div className="flex items-center space-x-2 print:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/tools">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tools
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:border-b print:pb-2">
        <div className="print:py-2">
          <h1 className="text-2xl font-bold tracking-tight print:text-xl">Closing Cost Estimator</h1>
          <p className="text-gray-500 print:text-sm">Generate detailed closing cost estimates for clients</p>
        </div>
        
        <div className="flex items-center gap-2 print:hidden">
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-mode"
              checked={isAdvancedMode}
              onCheckedChange={setIsAdvancedMode}
            />
            <Label htmlFor="advanced-mode">Advanced Mode</Label>
          </div>
          <Button variant="outline" size="sm" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1 print:gap-4">
        {/* Input form */}
        <Card className="lg:col-span-1 print:block print:px-0 print:py-0 print:shadow-none print:border-0">
          <CardHeader className="print:pb-2 print:px-0">
            <CardTitle className="flex items-center text-lg print:text-base">
              <Home className="mr-2 h-5 w-5 text-primary print:h-4 print:w-4" />
              Loan Details
            </CardTitle>
            <CardDescription className="print:text-xs">
              Enter property and loan information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 print:space-y-2 print:px-0">
            <div className="space-y-2">
              <Label htmlFor="property-value" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                Property Value
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  id="property-value"
                  name="propertyValue"
                  type="number"
                  min="50000"
                  step="1000"
                  className="pl-7"
                  value={formState.propertyValue}
                  onChange={handlePropertyValueChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="down-payment" className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                  Down Payment
                </Label>
                <span className="text-sm text-muted-foreground">
                  {formState.downPaymentPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  id="down-payment"
                  name="downPayment"
                  type="number"
                  min="0"
                  step="1000"
                  className="pl-7"
                  value={formState.downPayment}
                  onChange={handleDownPaymentChange}
                />
              </div>
              <Slider
                defaultValue={[formState.downPaymentPercentage]}
                max={50}
                step={0.5}
                className="py-2"
                value={[formState.downPaymentPercentage]}
                onValueChange={handleDownPaymentPercentageChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan-amount" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                Loan Amount
              </Label>
              <Input
                id="loan-amount"
                name="loanAmount"
                type="number"
                value={formState.loanAmount}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interest-rate" className="text-sm">
                  Interest Rate (%)
                </Label>
                <Input
                  id="interest-rate"
                  name="interestRate"
                  type="number"
                  min="1"
                  max="15"
                  step="0.125"
                  value={formState.interestRate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loan-term" className="text-sm">
                  Loan Term (years)
                </Label>
                <Select
                  value={formState.loanTerm.toString()}
                  onValueChange={(value) => handleSelectChange('loanTerm', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 years</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property-type" className="text-sm">
                  Property Type
                </Label>
                <Select
                  value={formState.propertyType}
                  onValueChange={(value) => handleSelectChange('propertyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-state" className="text-sm">
                  Property State
                </Label>
                <Select
                  value={formState.propertyState}
                  onValueChange={(value) => handleSelectChange('propertyState', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATE_OPTIONS.map(state => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loan-type" className="text-sm">
                  Loan Type
                </Label>
                <Select
                  value={formState.loanType}
                  onValueChange={(value) => handleSelectChange('loanType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit-score" className="text-sm">
                  Credit Score
                </Label>
                <Select
                  value={formState.creditScore.toString()}
                  onValueChange={(value) => handleSelectChange('creditScore', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    {CREDIT_SCORE_RANGES.map(range => (
                      <SelectItem key={range.value} value={range.value.toString()}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="first-time-buyer"
                checked={formState.firstTimeBuyer}
                onCheckedChange={(checked) => setFormState(prev => ({ ...prev, firstTimeBuyer: checked }))}
              />
              <Label htmlFor="first-time-buyer">First-time homebuyer</Label>
            </div>

            {isAdvancedMode && (
              <div className="pt-4 border-t space-y-4">
                <h3 className="text-sm font-medium">Advanced Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property-tax-rate" className="text-sm">
                      Property Tax Rate (%)
                    </Label>
                    <Input
                      id="property-tax-rate"
                      name="propertyTaxRate"
                      type="number"
                      min="0"
                      max="5"
                      step="0.01"
                      value={formState.propertyTaxRate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeowners-insurance" className="text-sm">
                      Monthly Insurance ($)
                    </Label>
                    <Input
                      id="homeowners-insurance"
                      name="homeownersInsurance"
                      type="number"
                      min="0"
                      step="5"
                      value={formState.homeownersInsurance}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="print:hidden">
            <Button 
              className="w-full" 
              onClick={calculateClosingCosts}
              disabled={isCalculating}
            >
              <Calculator className="mr-2 h-4 w-4" />
              {isCalculating ? 'Calculating...' : 'Calculate Closing Costs'}
            </Button>
          </CardFooter>
        </Card>

        {/* Results and breakdown */}
        <Card className="lg:col-span-2 print:block print:shadow-none print:border-0 print:px-0 print:py-0">
          <CardHeader className="print:px-0 print:pb-2">
            <CardTitle className="flex items-center text-lg print:text-base">
              <Calculator className="mr-2 h-5 w-5 text-primary print:h-4 print:w-4" />
              Closing Cost Estimate
            </CardTitle>
            <CardDescription className="print:text-xs">
              Based on a {formatCurrency(formState.loanAmount)} loan amount for a {PROPERTY_TYPES.find(type => type.value === formState.propertyType)?.label.toLowerCase()} in {STATE_OPTIONS.find(state => state.value === formState.propertyState)?.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="print:px-0">
            {!closingCosts && !isCalculating && (
              <div className="text-center py-12 space-y-4">
                <Calculator className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium">No Estimate Generated Yet</h3>
                  <p className="text-gray-500 mt-1">
                    Enter your loan details and click "Calculate Closing Costs" to generate an estimate.
                  </p>
                </div>
              </div>
            )}

            {isCalculating && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Calculating your closing costs...</p>
              </div>
            )}

            {closingCosts && !isCalculating && (
              <div className="space-y-6 print:space-y-3">
                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
                  <div className="bg-primary/10 p-4 rounded-lg space-y-1 print:p-2">
                    <div className="text-sm text-gray-500 print:text-xs">Closing Costs</div>
                    <div className="text-2xl font-bold print:text-lg">{formatCurrency(closingCosts.totalClosingCosts)}</div>
                    <div className="text-xs text-gray-500 print:text-[10px]">
                      {(closingCosts.totalClosingCosts / formState.loanAmount * 100).toFixed(2)}% of loan amount
                    </div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg space-y-1 print:p-2">
                    <div className="text-sm text-gray-500 print:text-xs">Down Payment</div>
                    <div className="text-2xl font-bold print:text-lg">{formatCurrency(formState.downPayment)}</div>
                    <div className="text-xs text-gray-500 print:text-[10px]">
                      {formState.downPaymentPercentage.toFixed(2)}% of purchase price
                    </div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg space-y-1 print:p-2">
                    <div className="text-sm text-gray-500 print:text-xs">Cash to Close</div>
                    <div className="text-2xl font-bold print:text-lg">{formatCurrency(closingCosts.cashToClose)}</div>
                    <div className="text-xs text-gray-500 print:text-[10px]">
                      Total funds needed at closing
                    </div>
                  </div>
                </div>

                {/* Detailed breakdown */}
                <div className="pt-2 print:pt-1">
                  <Tabs defaultValue="breakdown" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-md print:hidden">
                      <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
                      <TabsTrigger value="summary">Summary View</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="breakdown" className="space-y-4 print:block print:space-y-2">
                      <Accordion type="single" collapsible defaultValue="loan-costs" className="print:block">
                        <AccordionItem value="loan-costs" className="print:border-0">
                          <AccordionTrigger className="py-3 print:py-1 print:text-sm">
                            Loan Costs
                            <span className="ml-auto font-semibold print:text-xs">
                              {formatCurrency(closingCosts.loanCosts.totalLoanCosts)}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="print:block">
                            <div className="space-y-2 pt-2 print:pt-0 print:space-y-1">
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Origination Fee (1%)</span>
                                <span>{formatCurrency(closingCosts.loanCosts.originationFee)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Application Fee</span>
                                <span>{formatCurrency(closingCosts.loanCosts.applicationFee)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Underwriting Fee</span>
                                <span>{formatCurrency(closingCosts.loanCosts.underwritingFee)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Processing Fee</span>
                                <span>{formatCurrency(closingCosts.loanCosts.processingFee)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Credit Report Fee</span>
                                <span>{formatCurrency(closingCosts.loanCosts.creditReportFee)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Appraisal Fee</span>
                                <span>{formatCurrency(closingCosts.loanCosts.appraisalFee)}</span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="third-party-costs" className="print:border-0">
                          <AccordionTrigger className="py-3 print:py-1 print:text-sm">
                            Third-Party Services
                            <span className="ml-auto font-semibold print:text-xs">
                              {formatCurrency(closingCosts.thirdPartyCosts.totalThirdPartyCosts)}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="print:block">
                            <div className="space-y-2 pt-2 print:pt-0 print:space-y-1">
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Title Services and Insurance</span>
                                <span>{formatCurrency(closingCosts.thirdPartyCosts.titleServices)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Survey Fee</span>
                                <span>{formatCurrency(closingCosts.thirdPartyCosts.surveyFee)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Home Inspection</span>
                                <span>{formatCurrency(closingCosts.thirdPartyCosts.homeInspection)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Attorney Fee</span>
                                <span>{formatCurrency(closingCosts.thirdPartyCosts.attorneyFee)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Recording Fees</span>
                                <span>{formatCurrency(closingCosts.thirdPartyCosts.recordingFees)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Transfer Taxes</span>
                                <span>{formatCurrency(closingCosts.thirdPartyCosts.transferTaxes)}</span>
                              </div>
                              <div className="border-t pt-2 print:pt-1 print:border-dotted">
                                <div className="flex justify-between items-center text-sm print:text-xs">
                                  <span>Prepaid Interest (30 days)</span>
                                  <span>{formatCurrency(closingCosts.thirdPartyCosts.prepaidInterest)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm print:text-xs">
                                  <span>Escrow Deposit (2 months taxes/ins)</span>
                                  <span>{formatCurrency(closingCosts.thirdPartyCosts.escrowDeposit)}</span>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="cash-to-close" className="print:border-0">
                          <AccordionTrigger className="py-3 print:py-1 print:text-sm">
                            Cash to Close
                            <span className="ml-auto font-semibold print:text-xs">
                              {formatCurrency(closingCosts.cashToClose)}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="print:block">
                            <div className="space-y-2 pt-2 print:pt-0 print:space-y-1">
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Down Payment</span>
                                <span>{formatCurrency(formState.downPayment)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm print:text-xs">
                                <span>Total Closing Costs</span>
                                <span>{formatCurrency(closingCosts.totalClosingCosts)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm font-medium pt-2 border-t print:text-xs print:pt-1 print:border-dotted">
                                <span>Total Cash Needed</span>
                                <span>{formatCurrency(closingCosts.cashToClose)}</span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TabsContent>
                    
                    <TabsContent value="summary" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Loan Summary</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span>Purchase Price</span>
                              <span className="font-medium">{formatCurrency(formState.propertyValue)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Down Payment</span>
                              <span>{formatCurrency(formState.downPayment)} ({formState.downPaymentPercentage.toFixed(1)}%)</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Loan Amount</span>
                              <span>{formatCurrency(formState.loanAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Loan Type</span>
                              <span>{LOAN_TYPES.find(type => type.value === formState.loanType)?.label}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Interest Rate</span>
                              <span>{formState.interestRate}%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Loan Term</span>
                              <span>{formState.loanTerm} years</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Closing Cost Summary</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span>Loan Costs</span>
                              <span className="font-medium">{formatCurrency(closingCosts.loanCosts.totalLoanCosts)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Third-Party Services</span>
                              <span>{formatCurrency(closingCosts.thirdPartyCosts.totalThirdPartyCosts)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-semibold border-t pt-2">
                              <span>Total Closing Costs</span>
                              <span>{formatCurrency(closingCosts.totalClosingCosts)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Down Payment</span>
                              <span>{formatCurrency(formState.downPayment)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-semibold border-t pt-2">
                              <span>Cash to Close</span>
                              <span>{formatCurrency(closingCosts.cashToClose)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Notes and disclaimers */}
                <div className="text-xs text-gray-500 border-t pt-4 space-y-2 print:text-[10px] print:pt-1 print:space-y-1">
                  <p>
                    <strong>Note:</strong> This is an estimate only and actual closing costs may vary. The estimate is based on the information provided and current market rates.
                  </p>
                  <p>
                    <strong>Disclaimer:</strong> This tool provides a general estimate of closing costs and is for informational purposes only. Final costs will be determined by the lender, title company, and other third parties involved in the transaction.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          {closingCosts && !isCalculating && (
            <CardFooter className="flex justify-between print:hidden">
              <Button variant="outline" onClick={handlePrintEstimate}>
                <Printer className="mr-2 h-4 w-4" />
                Print Estimate
              </Button>
              <Button variant="outline" onClick={handleSaveEstimate}>
                <Save className="mr-2 h-4 w-4" />
                Save Estimate
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Print header - only visible when printing */}
      <div className="hidden print:block print:mb-4">
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <h2 className="text-sm font-bold">Mortgage Team Portal</h2>
            <p className="text-xs text-gray-500">Closing Cost Estimate - Generated {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs">
              <strong>Property:</strong> {PROPERTY_TYPES.find(type => type.value === formState.propertyType)?.label}
            </p>
            <p className="text-xs">
              <strong>Location:</strong> {STATE_OPTIONS.find(state => state.value === formState.propertyState)?.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosingCostEstimator;