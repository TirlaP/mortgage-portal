import React, { useState } from 'react';
import { ArrowLeft, Search, Map, Home, MapPin, Building, DollarSign, Info, PieChart, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PropertyDetails {
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    county: string;
  };
  property: {
    type: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt: number;
    lotSize: string;
    stories: number;
  };
  value: {
    estimatedValue: number;
    lastSoldPrice: number;
    lastSoldDate: string;
    taxAssessedValue: number;
    pricePerSqFt: number;
  };
  taxes: {
    annualAmount: number;
    year: number;
    exemptions: string[];
  };
  features: {
    interior: string[];
    exterior: string[];
    lotFeatures: string[];
  };
  schools: {
    elementary: {
      name: string;
      rating: number;
      distance: number;
    };
    middle: {
      name: string;
      rating: number;
      distance: number;
    };
    high: {
      name: string;
      rating: number;
      distance: number;
    };
  };
  comparables: Array<{
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt: number;
    distance: number;
    saleDate: string;
  }>;
}

// Mock property data
const MOCK_PROPERTY: PropertyDetails = {
  address: {
    street: "123 Main Street",
    city: "Anytown",
    state: "CA",
    zip: "90210",
    county: "Los Angeles"
  },
  property: {
    type: "Single Family Residence",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2450,
    yearBuilt: 2005,
    lotSize: "0.25 acres",
    stories: 2
  },
  value: {
    estimatedValue: 750000,
    lastSoldPrice: 680000,
    lastSoldDate: "06/15/2019",
    taxAssessedValue: 710000,
    pricePerSqFt: 306
  },
  taxes: {
    annualAmount: 8750,
    year: 2023,
    exemptions: ["Homeowner's Exemption"]
  },
  features: {
    interior: ["Central Air", "Fireplace", "Hardwood Floors", "Updated Kitchen", "Open Floor Plan"],
    exterior: ["Attached Garage", "Covered Patio", "Sprinkler System", "Fenced Yard"],
    lotFeatures: ["Corner Lot", "Landscaped", "Cul-de-sac"]
  },
  schools: {
    elementary: {
      name: "Washington Elementary",
      rating: 8,
      distance: 0.7
    },
    middle: {
      name: "Lincoln Middle School",
      rating: 7,
      distance: 1.2
    },
    high: {
      name: "Jefferson High",
      rating: 8,
      distance: 1.8
    }
  },
  comparables: [
    {
      address: "135 Oak Avenue",
      price: 735000,
      bedrooms: 4,
      bathrooms: 2.5,
      squareFeet: 2300,
      yearBuilt: 2003,
      distance: 0.3,
      saleDate: "04/10/2023"
    },
    {
      address: "421 Maple Drive",
      price: 765000,
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2500,
      yearBuilt: 2007,
      distance: 0.5,
      saleDate: "02/28/2023"
    },
    {
      address: "278 Pine Street",
      price: 725000,
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 2400,
      yearBuilt: 2004,
      distance: 0.8,
      saleDate: "03/15/2023"
    }
  ]
};

const PropertyLookup: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Handle address input change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setSearchError("");
  };

  // Handle property search
  const handleSearch = () => {
    if (!address.trim()) {
      setSearchError("Please enter an address");
      return;
    }

    setLoading(true);
    setSearchError("");

    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would be an API call to a property data service
      setProperty(MOCK_PROPERTY);
      setLoading(false);
    }, 1500);
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  // Clear search
  const clearSearch = () => {
    setAddress("");
    setProperty(null);
    setSearchError("");
  };

  // Get school rating color
  const getSchoolRatingColor = (rating: number): string => {
    if (rating >= 8) return "bg-green-100 text-green-800";
    if (rating >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
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
          <h1 className="text-2xl font-bold tracking-tight">Property Lookup</h1>
          <p className="text-gray-500">Access property information, tax records, and comparables</p>
        </div>
      </div>

      {/* Search bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter property address..."
                  className="pl-10"
                  value={address}
                  onChange={handleAddressChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading} className="shrink-0">
                {loading ? 'Searching...' : 'Search Property'}
              </Button>
            </div>
            {searchError && (
              <p className="text-sm text-destructive">{searchError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter a complete address for best results. Example: 123 Main St, Anytown, CA 90210
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Property details */}
      {property && !loading && (
        <div className="space-y-6">
          {/* Property header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    {property.address.street}
                  </h2>
                  <p className="text-gray-500">
                    {property.address.city}, {property.address.state} {property.address.zip}
                  </p>
                  <div className="flex items-center space-x-4 pt-2">
                    <Badge variant="secondary" className="text-sm">
                      {property.property.type}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {property.address.county} County
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-sm text-gray-500">Estimated Value</div>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(property.value.estimatedValue)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(property.value.pricePerSqFt)} per sq ft
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property details tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Property Details</TabsTrigger>
              <TabsTrigger value="tax">Tax Info</TabsTrigger>
              <TabsTrigger value="schools">Schools</TabsTrigger>
              <TabsTrigger value="comparables" className="hidden lg:block">Comparables</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Property overview card */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Home className="mr-2 h-5 w-5 text-primary" />
                      Property Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Bedrooms</div>
                        <div className="text-lg font-semibold">{property.property.bedrooms}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Bathrooms</div>
                        <div className="text-lg font-semibold">{property.property.bathrooms}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Square Feet</div>
                        <div className="text-lg font-semibold">{property.property.squareFeet.toLocaleString()}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Year Built</div>
                        <div className="text-lg font-semibold">{property.property.yearBuilt}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Lot Size</div>
                        <div className="text-lg font-semibold">{property.property.lotSize}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Stories</div>
                        <div className="text-lg font-semibold">{property.property.stories}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Value history card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <DollarSign className="mr-2 h-5 w-5 text-primary" />
                      Value History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Current Estimate</div>
                        <div className="text-xl font-bold">{formatCurrency(property.value.estimatedValue)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Last Sold Price</div>
                        <div className="text-lg font-semibold">{formatCurrency(property.value.lastSoldPrice)}</div>
                        <div className="text-xs text-gray-500">Sold on {property.value.lastSoldDate}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Tax Assessed Value</div>
                        <div className="text-lg font-semibold">{formatCurrency(property.value.taxAssessedValue)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Property features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Info className="mr-2 h-5 w-5 text-primary" />
                    Property Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Interior Features</h3>
                      <ul className="space-y-1">
                        {property.features.interior.map((feature, index) => (
                          <li key={index} className="text-sm flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Exterior Features</h3>
                      <ul className="space-y-1">
                        {property.features.exterior.map((feature, index) => (
                          <li key={index} className="text-sm flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Lot Features</h3>
                      <ul className="space-y-1">
                        {property.features.lotFeatures.map((feature, index) => (
                          <li key={index} className="text-sm flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Property Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Building className="mr-2 h-5 w-5 text-primary" />
                    Detailed Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Property Characteristics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Property Type</div>
                          <div className="font-medium">{property.property.type}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Year Built</div>
                          <div className="font-medium">{property.property.yearBuilt}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Square Footage</div>
                          <div className="font-medium">{property.property.squareFeet.toLocaleString()} sq ft</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Lot Size</div>
                          <div className="font-medium">{property.property.lotSize}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Bedrooms</div>
                          <div className="font-medium">{property.property.bedrooms}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Bathrooms</div>
                          <div className="font-medium">{property.property.bathrooms}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Stories</div>
                          <div className="font-medium">{property.property.stories}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">County</div>
                          <div className="font-medium">{property.address.county}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-3">Features & Amenities</h3>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="interior">
                          <AccordionTrigger>Interior Features</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-2 pt-2">
                              {property.features.interior.map((feature, index) => (
                                <div key={index} className="text-sm flex items-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="exterior">
                          <AccordionTrigger>Exterior Features</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-2 pt-2">
                              {property.features.exterior.map((feature, index) => (
                                <div key={index} className="text-sm flex items-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="lot">
                          <AccordionTrigger>Lot Features</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-2 gap-2 pt-2">
                              {property.features.lotFeatures.map((feature, index) => (
                                <div key={index} className="text-sm flex items-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-3">Transaction History</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{property.value.lastSoldDate}</div>
                            <div className="text-sm text-gray-500">Sold</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(property.value.lastSoldPrice)}</div>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(property.value.lastSoldPrice / property.property.squareFeet)} per sq ft
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tax Info Tab */}
            <TabsContent value="tax" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <PieChart className="mr-2 h-5 w-5 text-primary" />
                    Tax Information
                  </CardTitle>
                  <CardDescription>Property tax and assessment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Annual Property Tax</div>
                        <div className="text-xl font-bold">{formatCurrency(property.taxes.annualAmount)}</div>
                        <div className="text-xs text-gray-500">For tax year {property.taxes.year}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Assessed Value</div>
                        <div className="text-xl font-bold">{formatCurrency(property.value.taxAssessedValue)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">Monthly Tax</div>
                        <div className="text-xl font-bold">{formatCurrency(property.taxes.annualAmount / 12)}</div>
                        <div className="text-xs text-gray-500">If escrowed with mortgage</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-3">Tax Exemptions</h3>
                      {property.taxes.exemptions.length > 0 ? (
                        <ul className="space-y-1">
                          {property.taxes.exemptions.map((exemption, index) => (
                            <li key={index} className="text-sm flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                              {exemption}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No tax exemptions found for this property.</p>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-3">Tax Jurisdiction</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">County</div>
                          <div className="font-medium">{property.address.county} County</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">State</div>
                          <div className="font-medium">{property.address.state}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Info className="h-5 w-5 text-amber-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-amber-800">Tax Disclaimer</h3>
                          <p className="text-sm text-amber-700 mt-0.5">
                            The tax information shown is estimated and should not be used for financial or legal decisions. 
                            Consult official county tax records for verification.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schools Tab */}
            <TabsContent value="schools" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Globe className="mr-2 h-5 w-5 text-primary" />
                    Nearby Schools
                  </CardTitle>
                  <CardDescription>Schools serving this property address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">Elementary School</CardTitle>
                          <Badge 
                            className={getSchoolRatingColor(property.schools.elementary.rating)}
                          >
                            {property.schools.elementary.rating}/10
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="font-medium">{property.schools.elementary.name}</div>
                          <div className="text-sm text-gray-500">
                            {property.schools.elementary.distance} miles away
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">Middle School</CardTitle>
                          <Badge 
                            className={getSchoolRatingColor(property.schools.middle.rating)}
                          >
                            {property.schools.middle.rating}/10
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="font-medium">{property.schools.middle.name}</div>
                          <div className="text-sm text-gray-500">
                            {property.schools.middle.distance} miles away
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">High School</CardTitle>
                          <Badge 
                            className={getSchoolRatingColor(property.schools.high.rating)}
                          >
                            {property.schools.high.rating}/10
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="font-medium">{property.schools.high.name}</div>
                          <div className="text-sm text-gray-500">
                            {property.schools.high.distance} miles away
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-xs text-gray-500 pt-4 border-t">
                    <p>
                      <strong>Note:</strong> School attendance boundaries are subject to change. Contact the school district to confirm enrollment eligibility.
                    </p>
                    <p className="mt-1">
                      School ratings are based on test scores, college readiness, equity, and other factors. Ratings are on a scale of 1-10, with 10 being the highest.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comparables Tab */}
            <TabsContent value="comparables" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Map className="mr-2 h-5 w-5 text-primary" />
                    Comparable Properties
                  </CardTitle>
                  <CardDescription>Recent sales of similar properties in the area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {property.comparables.map((comp, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <h3 className="font-medium">{comp.address}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {comp.distance} miles away • Sold {comp.saleDate}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {comp.bedrooms} beds
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {comp.bathrooms} baths
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {comp.squareFeet.toLocaleString()} sq ft
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Built {comp.yearBuilt}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">{formatCurrency(comp.price)}</div>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(comp.price / comp.squareFeet)} per sq ft
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* No results state */}
      {!property && !loading && address && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="rounded-full bg-gray-100 p-4 text-gray-500">
            <Home className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium">No Results Found</h3>
          <p className="text-gray-500 max-w-md text-center">
            We couldn't find property information for the address you entered. Try checking the address and search again.
          </p>
          <Button onClick={clearSearch}>Clear Search</Button>
        </div>
      )}

      {/* Data disclaimer */}
      <Card className="bg-muted/40">
        <CardContent className="pt-6">
          <div className="text-xs text-muted-foreground">
            <h3 className="font-semibold mb-1">Data Sources & Disclaimer</h3>
            <p>
              Property data is sourced from public records, MLS listings, and proprietary valuation models. Information is deemed reliable but not guaranteed. 
              Estimated values are not appraisals; they are automated estimates and should be used for informational purposes only.
            </p>
            <p className="mt-1">
              For lending decisions, a professional appraisal is required. Tax information shown may not reflect recent changes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyLookup;