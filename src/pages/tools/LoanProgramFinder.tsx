import React, { useState } from 'react';
import { ArrowLeft, Search, Home, Filter, Check, DollarSign, Percent, Briefcase, Building, Wallet, AlertCircle, CheckCircle, HelpCircle, InfoIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoanProgram {
  id: number;
  name: string;
  type: 'conventional' | 'fha' | 'va' | 'usda' | 'jumbo' | 'other';
  description: string;
  minDownPayment: number;
  minCreditScore: number;
  maxLoanAmount: number;
  interestRateRange: {
    min: number;
    max: number;
  };
  termsAvailable: string[];
  eligibilityRequirements: string[];
  benefits: string[];
  considerations: string[];
  bestFor: string[];
}

interface FormState {
  propertyType: string;
  propertyUse: string;
  creditScore: number;
  downPayment: number;
  loanAmount: number;
  isFirstTimeBuyer: boolean;
  isVeteran: boolean;
  isRural: boolean;
}

const LoanProgramFinder: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    propertyType: 'single-family',
    propertyUse: 'primary',
    creditScore: 700,
    downPayment: 10,
    loanAmount: 350000,
    isFirstTimeBuyer: false,
    isVeteran: false,
    isRural: false
  });
  
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [matchingPrograms, setMatchingPrograms] = useState<LoanProgram[]>([]);
  const [savedPrograms, setSavedPrograms] = useState<LoanProgram[]>([]);
  
  // Handle form input changes
  const handleInputChange = (field: keyof FormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };
  
  // Mock loan programs
  const loanPrograms: LoanProgram[] = [
    {
      id: 1,
      name: 'Conventional 97',
      type: 'conventional',
      description: 'A conventional loan option with a low down payment requirement.',
      minDownPayment: 3,
      minCreditScore: 620,
      maxLoanAmount: 726200,
      interestRateRange: {
        min: 6.5,
        max: 7.25
      },
      termsAvailable: ['30-year fixed', '15-year fixed'],
      eligibilityRequirements: [
        'Credit score of 620 or higher',
        'Debt-to-income ratio below 45%',
        'Primary residence only',
        'First-time homebuyers or repeat buyers'
      ],
      benefits: [
        'Low down payment option (3%)',
        'Private mortgage insurance (PMI) can be cancelled',
        'Flexible property options'
      ],
      considerations: [
        'PMI required until 20% equity is reached',
        'Higher interest rates for lower credit scores',
        'Higher monthly payments with low down payment'
      ],
      bestFor: [
        'First-time homebuyers with good credit',
        'Buyers with limited savings for down payment',
        'Borrowers wanting to build equity quickly'
      ]
    },
    {
      id: 2,
      name: 'FHA 203(b)',
      type: 'fha',
      description: 'Government-backed loan with flexible qualification requirements.',
      minDownPayment: 3.5,
      minCreditScore: 580,
      maxLoanAmount: 472030,
      interestRateRange: {
        min: 6.25,
        max: 7.0
      },
      termsAvailable: ['30-year fixed', '15-year fixed'],
      eligibilityRequirements: [
        'Credit score of 580+ for 3.5% down',
        'Credit score of 500-579 for 10% down',
        'Debt-to-income ratio below 50%',
        'Primary residence only'
      ],
      benefits: [
        'Lower credit score requirements',
        'Competitive interest rates',
        'Down payment can come from gifts'
      ],
      considerations: [
        'Mortgage insurance premium (MIP) for the life of loan in most cases',
        'Upfront MIP fee (1.75% of loan amount)',
        'Property must meet minimum standards'
      ],
      bestFor: [
        'First-time homebuyers with lower credit scores',
        'Buyers with limited down payment funds',
        'Borrowers recovering from credit challenges'
      ]
    },
    {
      id: 3,
      name: 'VA Home Loan',
      type: 'va',
      description: 'Loans for veterans, active military, and eligible spouses with no down payment required.',
      minDownPayment: 0,
      minCreditScore: 620,
      maxLoanAmount: 726200,
      interestRateRange: {
        min: 6.0,
        max: 6.75
      },
      termsAvailable: ['30-year fixed', '15-year fixed'],
      eligibilityRequirements: [
        'VA eligibility based on service requirements',
        'Certificate of Eligibility (COE) required',
        'Credit score typically 620+ (lender specific)',
        'Primary residence only'
      ],
      benefits: [
        'No down payment required',
        'No monthly mortgage insurance',
        'Competitive interest rates',
        'Limited closing costs'
      ],
      considerations: [
        'VA funding fee required (unless exempt)',
        'Property must meet VA appraisal standards',
        'Some limitations on property types'
      ],
      bestFor: [
        'Eligible veterans and service members',
        'Military personnel with limited savings',
        'VA-eligible borrowers wanting to maximize buying power'
      ]
    },
    {
      id: 4,
      name: 'USDA Rural Development',
      type: 'usda',
      description: 'Zero down payment loans for moderate-income buyers in eligible rural areas.',
      minDownPayment: 0,
      minCreditScore: 640,
      maxLoanAmount: 336500,
      interestRateRange: {
        min: 6.25,
        max: 6.85
      },
      termsAvailable: ['30-year fixed'],
      eligibilityRequirements: [
        'Property must be in USDA-eligible rural area',
        'Household income within 115% of area median income',
        'Credit score typically 640+',
        'Primary residence only'
      ],
      benefits: [
        'No down payment required',
        'Lower mortgage insurance costs than FHA',
        'Competitive interest rates'
      ],
      considerations: [
        'Upfront guarantee fee (1% of loan amount)',
        'Annual fee (0.35% of outstanding balance)',
        'Income limits apply',
        'Geographic restrictions'
      ],
      bestFor: [
        'Moderate-income buyers in rural areas',
        'First-time homebuyers with limited savings',
        'Buyers wanting to purchase in smaller communities'
      ]
    },
    {
      id: 5,
      name: 'Jumbo Loan',
      type: 'jumbo',
      description: 'Loans that exceed the conforming loan limits for higher-priced properties.',
      minDownPayment: 10,
      minCreditScore: 700,
      maxLoanAmount: 2000000,
      interestRateRange: {
        min: 6.75,
        max: 7.5
      },
      termsAvailable: ['30-year fixed', '15-year fixed', '7/1 ARM', '10/1 ARM'],
      eligibilityRequirements: [
        'Credit score typically 700+',
        'Debt-to-income ratio below 43%',
        'Significant cash reserves (6-12 months)',
        'Higher income requirements'
      ],
      benefits: [
        'Finance high-value properties',
        'Competitive rates for strong borrowers',
        'Various loan terms available'
      ],
      considerations: [
        'Higher down payment requirements',
        'Stricter qualification standards',
        'More documentation required',
        'Higher closing costs'
      ],
      bestFor: [
        'High-income buyers in expensive markets',
        'Purchasers of luxury properties',
        'Borrowers with strong financial profiles'
      ]
    }
  ];
  
  // Find matching loan programs based on form inputs
  const findMatchingPrograms = () => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Filter loan programs based on criteria
      const matches = loanPrograms.filter(program => {
        // Credit score check
        if (formState.creditScore < program.minCreditScore) return false;
        
        // Down payment check (as percentage)
        if (formState.downPayment < program.minDownPayment) return false;
        
        // Loan amount check
        if (formState.loanAmount > program.maxLoanAmount) return false;
        
        // VA loan eligibility
        if (program.type === 'va' && !formState.isVeteran) return false;
        
        // USDA eligibility
        if (program.type === 'usda' && !formState.isRural) return false;
        
        return true;
      });
      
      setMatchingPrograms(matches);
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
  };
  
  // Save/unsave a program
  const toggleSaveProgram = (program: LoanProgram) => {
    const isAlreadySaved = savedPrograms.some(p => p.id === program.id);
    
    if (isAlreadySaved) {
      setSavedPrograms(savedPrograms.filter(p => p.id !== program.id));
    } else {
      setSavedPrograms([...savedPrograms, program]);
    }
  };
  
  // Check if a program is saved
  const isProgramSaved = (programId: number): boolean => {
    return savedPrograms.some(p => p.id === programId);
  };
  
  // Render a program card
  const renderProgramCard = (program: LoanProgram) => {
    const isSaved = isProgramSaved(program.id);
    
    return (
      <Card key={program.id} className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                {program.name}
                <Badge className="ml-2" variant={
                  program.type === 'conventional' ? 'default' :
                  program.type === 'fha' ? 'secondary' :
                  program.type === 'va' ? 'destructive' :
                  program.type === 'usda' ? 'outline' :
                  'default'
                }>
                  {program.type.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">{program.description}</CardDescription>
            </div>
            <Button 
              variant={isSaved ? "default" : "outline"} 
              size="sm"
              onClick={() => toggleSaveProgram(program)}
            >
              {isSaved ? <Check className="h-4 w-4 mr-1" /> : null}
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <div>
                <div className="text-sm text-gray-500">Min. Down Payment</div>
                <div className="font-medium">{program.minDownPayment}%</div>
              </div>
            </div>
            <div className="flex items-center">
              <Percent className="h-5 w-5 text-primary mr-2" />
              <div>
                <div className="text-sm text-gray-500">Interest Rate Range</div>
                <div className="font-medium">{program.interestRateRange.min}% - {program.interestRateRange.max}%</div>
              </div>
            </div>
            <div className="flex items-center">
              <Wallet className="h-5 w-5 text-primary mr-2" />
              <div>
                <div className="text-sm text-gray-500">Max Loan Amount</div>
                <div className="font-medium">{formatCurrency(program.maxLoanAmount)}</div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="eligibility">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="considerations">Considerations</TabsTrigger>
            </TabsList>
            <TabsContent value="eligibility" className="space-y-2 mt-4">
              <h4 className="text-sm font-medium">Eligibility Requirements</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {program.eligibilityRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              <div className="mt-2">
                <h4 className="text-sm font-medium">Available Terms</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {program.termsAvailable.map((term, index) => (
                    <Badge key={index} variant="outline">{term}</Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="benefits" className="mt-4">
              <h4 className="text-sm font-medium">Program Benefits</h4>
              <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                {program.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
              <div className="mt-4">
                <h4 className="text-sm font-medium">Best For</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                  {program.bestFor.map((best, index) => (
                    <li key={index}>{best}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="considerations" className="mt-4">
              <h4 className="text-sm font-medium">Important Considerations</h4>
              <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                {program.considerations.map((consideration, index) => (
                  <li key={index}>{consideration}</li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button className="w-full">View Full Program Details</Button>
        </CardFooter>
      </Card>
    );
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
        <h1 className="text-2xl font-bold tracking-tight">Loan Program Finder</h1>
        <p className="text-gray-500">Find the right loan programs based on client criteria</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Form */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Search className="mr-2 h-5 w-5 text-primary" />
                Client Criteria
              </CardTitle>
              <CardDescription>
                Enter client details to find matching loan programs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select 
                  value={formState.propertyType} 
                  onValueChange={(value) => handleInputChange('propertyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-family">Single Family Home</SelectItem>
                    <SelectItem value="condo">Condominium</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="multi-family">Multi-Family (2-4 units)</SelectItem>
                    <SelectItem value="manufactured">Manufactured Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="propertyUse">Property Use</Label>
                <RadioGroup 
                  defaultValue={formState.propertyUse}
                  onValueChange={(value) => handleInputChange('propertyUse', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="primary" id="primary" />
                    <Label htmlFor="primary">Primary Residence</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="secondary" id="secondary" />
                    <Label htmlFor="secondary">Secondary Home</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="investment" id="investment" />
                    <Label htmlFor="investment">Investment Property</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="creditScore">Credit Score: {formState.creditScore}</Label>
                </div>
                <Slider
                  id="creditScore"
                  min={500}
                  max={850}
                  step={10}
                  value={[formState.creditScore]}
                  onValueChange={(value) => handleInputChange('creditScore', value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>500</span>
                  <span>675</span>
                  <span>850</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="downPayment">Down Payment: {formState.downPayment}%</Label>
                </div>
                <Slider
                  id="downPayment"
                  min={0}
                  max={25}
                  step={1}
                  value={[formState.downPayment]}
                  onValueChange={(value) => handleInputChange('downPayment', value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>10%</span>
                  <span>25%+</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount: {formatCurrency(formState.loanAmount)}</Label>
                <Slider
                  id="loanAmount"
                  min={100000}
                  max={1000000}
                  step={10000}
                  value={[formState.loanAmount]}
                  onValueChange={(value) => handleInputChange('loanAmount', value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$100k</span>
                  <span>$500k</span>
                  <span>$1M+</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Special Eligibility</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isFirstTimeBuyer" 
                      checked={formState.isFirstTimeBuyer}
                      onCheckedChange={(checked) => handleInputChange('isFirstTimeBuyer', Boolean(checked))}
                    />
                    <Label htmlFor="isFirstTimeBuyer">First-Time Homebuyer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isVeteran" 
                      checked={formState.isVeteran}
                      onCheckedChange={(checked) => handleInputChange('isVeteran', Boolean(checked))}
                    />
                    <Label htmlFor="isVeteran">Military/Veteran Status</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isRural" 
                      checked={formState.isRural}
                      onCheckedChange={(checked) => handleInputChange('isRural', Boolean(checked))}
                    />
                    <Label htmlFor="isRural">Rural Property Location</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={findMatchingPrograms}
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Find Matching Programs'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Saved Programs */}
          {savedPrograms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                  Saved Programs ({savedPrograms.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {savedPrograms.map(program => (
                    <li key={program.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
                      <div className="flex items-center">
                        <Badge className="mr-2" variant={
                          program.type === 'conventional' ? 'default' :
                          program.type === 'fha' ? 'secondary' :
                          program.type === 'va' ? 'destructive' :
                          program.type === 'usda' ? 'outline' :
                          'default'
                        }>
                          {program.type.toUpperCase()}
                        </Badge>
                        <span>{program.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleSaveProgram(program)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Export Saved Programs
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        {/* Results Area */}
        <div className="md:col-span-2">
          {isSearching ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-center text-gray-500">Searching for matching loan programs...</p>
                </div>
              </CardContent>
            </Card>
          ) : hasSearched ? (
            <>
              {matchingPrograms.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Matching Programs ({matchingPrograms.length})
                    </h2>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" /> Filter Results
                    </Button>
                  </div>
                  
                  {matchingPrograms.map(program => renderProgramCard(program))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">No Matching Programs</h3>
                  <p className="text-gray-500 max-w-md mx-auto mt-2">
                    We couldn't find any loan programs matching your criteria. Try adjusting your search parameters or speak with a loan officer for custom options.
                  </p>
                  <div className="mt-4">
                    <Button onClick={findMatchingPrograms}>
                      Try Again
                    </Button>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <InfoIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">Find Your Ideal Loan Program</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                Enter your client's details in the form to find matching loan programs. We'll show you the best options based on their specific situation.
              </p>
              <div className="mt-4">
                <Button onClick={findMatchingPrograms}>
                  Find Matching Programs
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanProgramFinder;