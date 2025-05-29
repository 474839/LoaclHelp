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

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  availability: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
}

interface ServiceGridProps {
  services?: Service[];
  onServiceClick?: (service: Service) => void;
}

const ServiceGrid = ({
  services = defaultServices,
  onServiceClick = () => {},
}: ServiceGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Extract unique categories and locations for filters
  const categories = [
    "all",
    ...new Set(services.map((service) => service.category)),
  ];
  const locations = [
    "all",
    ...new Set(services.map((service) => service.location)),
  ];

  // Filter services based on search term and filters
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" || service.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

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
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
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
      {filteredServices.length > 0 ? (
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
                  <Badge variant="secondary">{service.category}</Badge>
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
                  {service.contactName}
                </p>
                <div className="flex flex-wrap gap-3">
                  {service.contactEmail && (
                    <Button variant="outline" size="sm" className="h-8" asChild>
                      <a href={`mailto:${service.contactEmail}`}>
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        Email
                      </a>
                    </Button>
                  )}
                  {service.contactPhone && (
                    <Button variant="outline" size="sm" className="h-8" asChild>
                      <a href={`tel:${service.contactPhone}`}>
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        Call
                      </a>
                    </Button>
                  )}
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

// Default services for demonstration
const defaultServices: Service[] = [
  {
    id: "1",
    title: "Math Tutoring for High School Students",
    category: "Tutoring",
    description:
      "Experienced math tutor offering help with algebra, calculus, and statistics. Patient approach with proven results for improving grades.",
    location: "Downtown",
    availability: "Weekday evenings, Weekend mornings",
    contactName: "Alex Johnson",
    contactEmail: "alex@example.com",
    contactPhone: "555-123-4567",
    createdAt: "2023-06-15",
  },
  {
    id: "2",
    title: "House Cleaning Services",
    category: "Cleaning",
    description:
      "Thorough and efficient house cleaning. I bring my own supplies and can handle regular maintenance or deep cleaning jobs.",
    location: "Westside",
    availability: "Monday-Friday, 9am-5pm",
    contactName: "Maria Garcia",
    contactPhone: "555-987-6543",
    createdAt: "2023-06-10",
  },
  {
    id: "3",
    title: "Computer Repair & Tech Support",
    category: "Tech Help",
    description:
      "Fixing hardware issues, software problems, virus removal, and general tech support for computers and laptops.",
    location: "Eastside",
    availability: "Flexible hours, including weekends",
    contactName: "David Kim",
    contactEmail: "david@example.com",
    createdAt: "2023-06-05",
  },
  {
    id: "4",
    title: "Dog Walking & Pet Sitting",
    category: "Pet Care",
    description:
      "Reliable pet care services including daily walks, feeding, and overnight sitting. Experienced with dogs, cats, and small animals.",
    location: "Northside",
    availability: "Daily, including weekends",
    contactName: "Emma Wilson",
    contactEmail: "emma@example.com",
    contactPhone: "555-234-5678",
    createdAt: "2023-06-01",
  },
  {
    id: "5",
    title: "Moving Help - Strong Lifter",
    category: "Moving",
    description:
      "Need help moving? I can assist with heavy lifting, furniture assembly, and loading/unloading trucks. Have my own transportation.",
    location: "Downtown",
    availability: "Weekends only",
    contactName: "James Smith",
    contactPhone: "555-876-5432",
    createdAt: "2023-05-28",
  },
  {
    id: "6",
    title: "Guitar Lessons for Beginners",
    category: "Music Lessons",
    description:
      "Patient guitar teacher with 5+ years of experience. Learn popular songs quickly while developing proper technique. All ages welcome.",
    location: "Southside",
    availability: "Tuesday-Thursday afternoons, Saturdays",
    contactName: "Carlos Rodriguez",
    contactEmail: "carlos@example.com",
    createdAt: "2023-05-25",
  },
];

export default ServiceGrid;
