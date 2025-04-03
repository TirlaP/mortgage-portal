import React, { useState, useEffect, ChangeEvent } from 'react';
import { ArrowLeft, Calculator, DollarSign, Percent, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const MortgageCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(300000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationRow[]>([]);

  // Calculate mortgage when inputs change
  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateMortgage = () => {
    // Convert annual interest rate to monthly rate
    const monthlyRate = interestRate / 100 / 12;
    
    // Convert years to months
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly payment using formula: P = L[r(1+r)^n]/[(1+r)^n-1]
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Calculate total payment and interest
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    setMonthlyPayment(monthlyPayment);
    setTotalInterest(totalInterest);
    setTotalPayment(totalPayment);
    
    // Generate amortization schedule (first 12 months for preview)
    let balance = loanAmount;
    const schedule = [];
    
    for (let i = 1; i <= Math.min(12, numberOfPayments); i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance
      });
    }
    
    setAmortizationSchedule(schedule);
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
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
        <h1 className="text-2xl font-bold tracking-tight">Mortgage Calculator</h1>
        <p className="text-gray-500">Calculate monthly payments, total interest, and amortization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input fields */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calculator className="mr-2 h-5 w-5 text-primary" />
              Input Values
            </CardTitle>
            <CardDescription>
              Enter loan details to calculate mortgage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  min="1000"
                  step="1000"
                  className="pl-7"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="interest-rate" className="text-sm font-medium flex items-center">
                <Percent className="h-4 w-4 mr-1 text-gray-500" />
                Interest Rate (%)
              </label>
              <div className="relative">
                <Input
                  id="interest-rate"
                  type="number"
                  min="0.1"
                  step="0.1"
                  max="20"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="loan-term" className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                Loan Term (years)
              </label>
              <select
                id="loan-term"
                className="w-full h-10 pl-3 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              >
                <option value="30">30 years</option>
                <option value="20">20 years</option>
                <option value="15">15 years</option>
                <option value="10">10 years</option>
                <option value="5">5 years</option>
              </select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={calculateMortgage}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate
            </Button>
          </CardFooter>
        </Card>

        {/* Results summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Mortgage Summary</CardTitle>
            <CardDescription>
              Based on your inputs, here's your mortgage breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Monthly Payment</div>
                <div className="text-2xl font-bold">{formatCurrency(monthlyPayment)}</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Total Interest</div>
                <div className="text-2xl font-bold">{formatCurrency(totalInterest)}</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Total Payment</div>
                <div className="text-2xl font-bold">{formatCurrency(totalPayment)}</div>
              </div>
            </div>

            {/* Amortization preview */}
            <div>
              <h3 className="text-lg font-medium mb-3">Amortization Schedule (First Year)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {amortizationSchedule.map((row) => (
                      <tr key={row.month}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{row.month}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(row.payment)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(row.principal)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(row.interest)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              Print Results
            </Button>
            <Button variant="outline">
              Export Full Schedule
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default MortgageCalculator;