import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { MapPin, Phone, Mail, Calendar, Search, Filter } from "lucide-react";

// Import the fetchServices function
import { fetchServices, fetchCategories, type Category } from "../lib/supabaseData";

export interface Service {
  id: string;
  title: string;
  description: string;
  category_id: string;
  location: string;
  availability: string;
  provider_id: string;
  created_at: string;
  status: 'active' | 'inactive';
  images: string[];
}

interface ServiceGridProps {
  onServiceClick?: (service: Service) => void;
}

const ServiceGrid = ({
  onServiceClick = () => {},
}: ServiceGridProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Fetch services from Supabase when the component mounts
  React.useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      const fetchedServices = await fetchServices();
      if (fetchedServices) {
        setServices(fetchedServices);
      }
      setLoading(false);
    };
    getServices();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch categories from Supabase when the component mounts
  React.useEffect(() => {
    const getCategories = async () => {
      setCategoriesLoading(true);
      const fetchedCategories = await fetchCategories();
      if (fetchedCategories) {
        setCategories(fetchedCategories);
      }
      setCategoriesLoading(false);
    };
    getCategories();
  }, []); // Empty dependency array ensures this runs only once on mount

  const locations = [
    "all",
    ...new Set(services.map((service) => service.location)),
  ];

  // Filter services based on search term and filters
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Find the selected category object to get its ID
    const selectedCategoryObject = categories.find(cat => cat.name === selectedCategory);
    const matchesCategory = 
      selectedCategory === "all" || 
      (selectedCategoryObject && service.category_id === selectedCategoryObject.id);

    const matchesLocation =
      selectedLocation === "all" || service.location === selectedLocation;

    // Also filter by status === 'active' as per RLS policy for viewing
    const matchesStatus = service.status === 'active';

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  // Function to get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <div className="w-full bg-background">
      {/* Search and filter section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">
                    All Categories
                  </SelectItem>
                  {!categoriesLoading && categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location === "all" ? "All Locations" : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredServices.length}{" "}
        {filteredServices.length === 1 ? "service" : "services"}
      </div>

      {/* Service grid */}
      {loading ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-lg font-medium">Loading services...</p>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="h-full cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onServiceClick(service)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <Badge variant="secondary">{getCategoryName(service.category_id)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {service.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{service.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{service.availability}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex flex-col items-start">
                <p className="font-medium text-sm mb-1">
                  Provider ID: {service.provider_id.substring(0, 6)}...
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" className="h-8">
                    Contact
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-lg font-medium">No services found</p>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

// Remove default services as we fetch from Supabase now
// const defaultServices: Service[] = [
// // ... mock data ...
// ];

export default ServiceGrid;
