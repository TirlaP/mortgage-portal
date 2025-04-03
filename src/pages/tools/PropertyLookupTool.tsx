import React, { useState } from 'react';
import { ArrowLeft, Map, Search, Building, Home, Landmark, Info, Files, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface PropertyDetails {
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqFt: number;
  yearBuilt: number;
  lotSize: string;
  lastSoldPrice: number;
  lastSoldDate: string;
  estimatedValue: number;
  taxAssessment: number;
  taxYear: number;
  propertyTax: number;
  parcelNumber: string;
  zoning: string;
}

interface Comparable {
  id: number;
  address: string;
  distance: string;
  salePrice: number;
  saleDate: string;
  bedrooms: number;
  bathrooms: number;
  sqFt: number;
  yearBuilt: number;
  pricePerSqFt: number;
}

const PropertyLookupTool: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('details');
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [comparables, setComparables] = useState<Comparable[]>([]);

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock property data
      setPropertyDetails({
        address: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zip: '62704',
        propertyType: 'Single Family',
        bedrooms: 4,
        bathrooms: 2.5,
        sqFt: 2450,
        yearBuilt: 2005,
        lotSize: '0.25 acres',
        lastSoldPrice: 375000,
        lastSoldDate: '2021-06-15',
        estimatedValue: 425000,
        taxAssessment: 350000,
        taxYear: 2023,
        propertyTax: 5250,
        parcelNumber: '18-34-200-023',
        zoning: 'R1 - Residential'
      });
      
      // Mock comparable properties
      setComparables([
        {
          id: 1,
          address: '135 Main Street',
          distance: '0.2 miles',
          salePrice: 380000,
          saleDate: '2023-02-10',
          bedrooms: 4,
          bathrooms: 2.5,
          sqFt: 2300,
          yearBuilt: 2007,
          pricePerSqFt: 165.22
        },
        {
          id: 2,
          address: '245 Oak Avenue',
          distance: '0.5 miles',
          salePrice: 410000,
          saleDate: '2023-01-05',
          bedrooms: 4,
          bathrooms: 3,
          sqFt: 2600,
          yearBuilt: 2010,
          pricePerSqFt: 157.69
        },
        {
          id: 3,
          address: '78 Maple Drive',
          distance: '0.3 miles',
          salePrice: 365000,
          saleDate: '2022-11-18',
          bedrooms: 3,
          bathrooms: 2.5,
          sqFt: 2200,
          yearBuilt: 2003,
          pricePerSqFt: 165.91
        }
      ]);
      
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
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
        <h1 className="text-2xl font-bold tracking-tight">Property Lookup Tool</h1>
        <p className="text-gray-500">Search for property information, tax records, and comparable sales</p>
      </div>

      {/* Search form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Search className="mr-2 h-5 w-5 text-primary" />
            Property Search
          </CardTitle>
          <CardDescription>
            Enter an address, parcel number, or owner name to search properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                placeholder="123 Main St, Springfield, IL 62704"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => setSearchQuery('')}
                >
                  <span className="sr-only">Clear search</span>
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Results */}
      {hasSearched && (
        <div className="space-y-6">
          {propertyDetails ? (
            <>
              {/* Property Overview */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{propertyDetails.address}</CardTitle>
                      <CardDescription>
                        {propertyDetails.city}, {propertyDetails.state} {propertyDetails.zip}
                      </CardDescription>
                    </div>
                    <Badge>{propertyDetails.propertyType}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-xs text-gray-500 uppercase">Est. Value</div>
                      <div className="text-2xl font-bold mt-1">{formatCurrency(propertyDetails.estimatedValue)}</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-xs text-gray-500 uppercase">Last Sold</div>
                      <div className="text-2xl font-bold mt-1">{formatCurrency(propertyDetails.lastSoldPrice)}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatDate(propertyDetails.lastSoldDate)}</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                      <div className="text-xs text-gray-500 uppercase">Property Tax</div>
                      <div className="text-2xl font-bold mt-1">{formatCurrency(propertyDetails.propertyTax)}</div>
                      <div className="text-xs text-gray-500 mt-1">{propertyDetails.taxYear}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for different property data */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="details">Property Details</TabsTrigger>
                  <TabsTrigger value="tax">Tax Information</TabsTrigger>
                  <TabsTrigger value="comparables">Comparable Sales</TabsTrigger>
                </TabsList>
                
                {/* Property Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Building className="mr-2 h-5 w-5 text-primary" />
                        Building Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Bedrooms</div>
                          <div className="font-medium">{propertyDetails.bedrooms}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Bathrooms</div>
                          <div className="font-medium">{propertyDetails.bathrooms}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Square Feet</div>
                          <div className="font-medium">{propertyDetails.sqFt.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Year Built</div>
                          <div className="font-medium">{propertyDetails.yearBuilt}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Lot Size</div>
                          <div className="font-medium">{propertyDetails.lotSize}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Property Type</div>
                          <div className="font-medium">{propertyDetails.propertyType}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-primary" />
                        Sales History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <div>
                            <div className="font-medium">{formatDate(propertyDetails.lastSoldDate)}</div>
                            <div className="text-sm text-gray-500">Sale</div>
                          </div>
                          <div className="text-lg font-bold">{formatCurrency(propertyDetails.lastSoldPrice)}</div>
                        </div>
                        {/* Additional sales history would go here */}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Tax Information Tab */}
                <TabsContent value="tax" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Landmark className="mr-2 h-5 w-5 text-primary" />
                        Tax Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Tax Year</div>
                          <div className="font-medium">{propertyDetails.taxYear}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Assessed Value</div>
                          <div className="font-medium">{formatCurrency(propertyDetails.taxAssessment)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Annual Property Tax</div>
                          <div className="font-medium">{formatCurrency(propertyDetails.propertyTax)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Monthly Tax Escrow</div>
                          <div className="font-medium">{formatCurrency(propertyDetails.propertyTax / 12)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Parcel Number</div>
                          <div className="font-medium">{propertyDetails.parcelNumber}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Zoning</div>
                          <div className="font-medium">{propertyDetails.zoning}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Comparable Sales Tab */}
                <TabsContent value="comparables">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Home className="mr-2 h-5 w-5 text-primary" />
                        Comparable Properties
                      </CardTitle>
                      <CardDescription>
                        Recently sold properties similar to this one
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4">Address</th>
                              <th className="text-left py-3 px-4">Distance</th>
                              <th className="text-left py-3 px-4">Sale Date</th>
                              <th className="text-left py-3 px-4">Sale Price</th>
                              <th className="text-left py-3 px-4">Bed/Bath</th>
                              <th className="text-left py-3 px-4">Sq Ft</th>
                              <th className="text-left py-3 px-4">Price/Sq Ft</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparables.map((comp) => (
                              <tr key={comp.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{comp.address}</td>
                                <td className="py-3 px-4">{comp.distance}</td>
                                <td className="py-3 px-4">{formatDate(comp.saleDate)}</td>
                                <td className="py-3 px-4">{formatCurrency(comp.salePrice)}</td>
                                <td className="py-3 px-4">{comp.bedrooms}/{comp.bathrooms}</td>
                                <td className="py-3 px-4">{comp.sqFt.toLocaleString()}</td>
                                <td className="py-3 px-4">{formatCurrency(comp.pricePerSqFt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                  <Files className="mr-2 h-4 w-4" />
                  Export Property Report
                </Button>
                <Button variant="outline">
                  <Map className="mr-2 h-4 w-4" />
                  View on Map
                </Button>
                <Button>
                  <Info className="mr-2 h-4 w-4" />
                  Add to Loan File
                </Button>
              </div>
            </>
          ) : (
            <Card className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Info className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No Property Found</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                We couldn't find a property matching your search criteria. Try a different address, or check the formatting.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyLookupTool;