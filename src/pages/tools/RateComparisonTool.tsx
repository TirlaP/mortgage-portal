import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart, DollarSign, Percent, Calendar, RefreshCcw, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RateOption {
  id: number;
  loanType: string;
  term: number;
  rate: number;
  apr: number;
  points: number;
  monthlyPayment: number;
  totalInterest: number;
  bestFor: string;
}

const RateComparisonTool: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(300000);
  const [loanType, setLoanType] = useState<string>('all');
  const [loanTerm, setLoanTerm] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rateOptions, setRateOptions] = useState<RateOption[]>([]);

  // Mock rate options
  const mockRateOptions: RateOption[] = [
    {
      id: 1,
      loanType: 'Conventional',
      term: 30,
      rate: 4.25,
      apr: 4.35,
      points: 0,
      monthlyPayment: 1475.82,
      totalInterest: 231295.20,
      bestFor: 'Low monthly payments'
    },
    {
      id: 2,
      loanType: 'Conventional',
      term: 15,
      rate: 3.75,
      apr: 3.85,
      points: 0.25,
      monthlyPayment: 2181.73,
      totalInterest: 92711.40,
      bestFor: 'Faster equity building'
    },
    {
      id: 3,
      loanType: 'FHA',
      term: 30,
      rate: 4.00,
      apr: 4.75,
      points: 0,
      monthlyPayment: 1432.25,
      totalInterest: 215610.00,
      bestFor: 'Lower credit scores'
    },
    {
      id: 4,
      loanType: 'VA',
      term: 30,
      rate: 3.75,
      apr: 3.95,
      points: 0.5,
      monthlyPayment: 1389.35,
      totalInterest: 200165.00,
      bestFor: 'Military veterans'
    },
    {
      id: 5,
      loanType: 'Jumbo',
      term: 30,
      rate: 4.50,
      apr: 4.65,
      points: 0.75,
      monthlyPayment: 1520.06,
      totalInterest: 247221.60,
      bestFor: 'High-value properties'
    },
    {
      id: 6,
      loanType: 'Conventional',
      term: 20,
      rate: 4.00,
      apr: 4.15,
      points: 0.25,
      monthlyPayment: 1817.94,
      totalInterest: 136305.60,
      bestFor: 'Balance of term and interest'
    },
    {
      id: 7,
      loanType: 'USDA',
      term: 30,
      rate: 3.85,
      apr: 4.35,
      points: 0,
      monthlyPayment: 1405.77,
      totalInterest: 206077.20,
      bestFor: 'Rural properties'
    },
  ];

  // Filter options based on user selections
  useEffect(() => {
    let filteredOptions = mockRateOptions;
    
    if (loanType !== 'all') {
      filteredOptions = filteredOptions.filter(option => option.loanType === loanType);
    }
    
    if (loanTerm !== 'all') {
      filteredOptions = filteredOptions.filter(option => option.term === parseInt(loanTerm));
    }
    
    // Calculate monthly payment and total interest based on current loan amount
    const recalculatedOptions = filteredOptions.map(option => {
      const monthlyRate = option.rate / 100 / 12;
      const numberOfPayments = option.term * 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      const totalInterest = (monthlyPayment * numberOfPayments) - loanAmount;
      
      return {
        ...option,
        monthlyPayment,
        totalInterest
      };
    });
    
    setRateOptions(recalculatedOptions);
  }, [loanAmount, loanType, loanTerm]);

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  // Format percent
  const formatPercent = (value: number): string => {
    return value.toFixed(3) + '%';
  };

  // Get loan type badge color
  const getLoanTypeBadgeColor = (loanType: string): string => {
    switch(loanType) {
      case 'Conventional': return 'bg-blue-100 text-blue-800';
      case 'FHA': return 'bg-green-100 text-green-800';
      case 'VA': return 'bg-purple-100 text-purple-800';
      case 'Jumbo': return 'bg-amber-100 text-amber-800';
      case 'USDA': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Refresh rates
  const refreshRates = () => {
    // In a real app, this would fetch the latest rates from an API
    setLastUpdated(new Date().toISOString().split('T')[0]);
    // For this demo, we'll just randomize the rates slightly
    const updatedOptions = mockRateOptions.map(option => {
      const rateChange = (Math.random() - 0.5) * 0.2; // Random change between -0.1 and +0.1
      return {
        ...option,
        rate: parseFloat((option.rate + rateChange).toFixed(3)),
        apr: parseFloat((option.apr + rateChange).toFixed(3))
      };
    });
    
    setRateOptions(updatedOptions);
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
          <h1 className="text-2xl font-bold tracking-tight">Rate Comparison Tool</h1>
          <p className="text-gray-500">Compare current rates across different loan programs and terms</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Last updated: {lastUpdated}</span>
          <Button variant="outline" size="sm" onClick={refreshRates}>
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh Rates
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Loan Details</CardTitle>
          <CardDescription>
            Enter your loan amount and preferences to compare rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="loan-amount" className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                Loan Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  id="loan-amount"
                  type="number"
                  min="50000"
                  step="10000"
                  className="pl-7"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="loan-type" className="text-sm font-medium flex items-center">
                <BarChart className="h-4 w-4 mr-1 text-gray-500" />
                Loan Type
              </label>
              <Select value={loanType} onValueChange={setLoanType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Conventional">Conventional</SelectItem>
                  <SelectItem value="FHA">FHA</SelectItem>
                  <SelectItem value="VA">VA</SelectItem>
                  <SelectItem value="Jumbo">Jumbo</SelectItem>
                  <SelectItem value="USDA">USDA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="loan-term" className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                Loan Term
              </label>
              <Select value={loanTerm} onValueChange={setLoanTerm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="30">30 Years</SelectItem>
                  <SelectItem value="20">20 Years</SelectItem>
                  <SelectItem value="15">15 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate comparison table */}
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-4">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Rate Options</CardTitle>
              <CardDescription>
                Based on a loan amount of {formatCurrency(loanAmount)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan Type</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>APR</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Monthly Payment</TableHead>
                      <TableHead>Total Interest</TableHead>
                      <TableHead>Best For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rateOptions.map((option) => (
                      <TableRow key={option.id}>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getLoanTypeBadgeColor(option.loanType)}`}>
                            {option.loanType}
                          </span>
                        </TableCell>
                        <TableCell>{option.term} years</TableCell>
                        <TableCell>{formatPercent(option.rate)}</TableCell>
                        <TableCell>{formatPercent(option.apr)}</TableCell>
                        <TableCell>{option.points.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(option.monthlyPayment)}</TableCell>
                        <TableCell>{formatCurrency(option.totalInterest)}</TableCell>
                        <TableCell>{option.bestFor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={refreshRates}>
                <RefreshCcw className="h-4 w-4 mr-1" />
                Refresh Rates
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rateOptions.map((option) => (
              <Card key={option.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium mr-2 ${getLoanTypeBadgeColor(option.loanType)}`}>
                          {option.loanType}
                        </span>
                        {option.term}-Year Fixed
                      </CardTitle>
                      <CardDescription>
                        {option.bestFor}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{option.points} Points</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Rate</div>
                      <div className="text-xl font-bold">{formatPercent(option.rate)}</div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">APR</div>
                      <div className="text-xl font-bold">{formatPercent(option.apr)}</div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Monthly Payment</div>
                      <div className="text-xl font-bold">{formatCurrency(option.monthlyPayment)}</div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Total Interest</div>
                      <div className="text-xl font-bold">{formatCurrency(option.totalInterest)}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Apply With This Rate</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Data explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Understanding Rate Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-medium mb-2">Rate vs. APR</h3>
                <p className="text-sm text-gray-600">
                  The <strong>interest rate</strong> is the cost you pay to borrow money. The <strong>APR (Annual Percentage Rate)</strong> includes both the interest rate and other costs such as broker fees, discount points and some closing costs, expressed as a percentage.
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2">Points</h3>
                <p className="text-sm text-gray-600">
                  <strong>Discount points</strong> are fees paid directly to the lender at closing in exchange for a reduced interest rate. One point costs 1% of your mortgage amount (or $1,000 for every $100,000).
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2">Loan Types</h3>
                <p className="text-sm text-gray-600">
                  <strong>Conventional loans</strong> are not guaranteed by the government. <strong>FHA loans</strong> are insured by the Federal Housing Administration. <strong>VA loans</strong> are guaranteed by the Department of Veterans Affairs. <strong>USDA loans</strong> are guaranteed by the U.S. Department of Agriculture for rural properties.
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2">Rate Fluctuations</h3>
                <p className="text-sm text-gray-600">
                  Mortgage rates change daily based on economic factors. The rates shown here are updated regularly but may not reflect real-time rates. Contact a loan officer for current rate quotes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateComparisonTool;