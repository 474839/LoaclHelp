import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, ChevronDown, MapPin, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import ServiceForm from "./ServiceForm";
import ServiceGrid from "./ServiceGrid";
import ServiceDetail from "./ServiceDetail";

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Mock categories for demonstration
  const categories = [
    { id: 1, name: "Tutoring", icon: "📚" },
    { id: 2, name: "Cleaning", icon: "🧹" },
    { id: 3, name: "Tech Help", icon: "💻" },
    { id: 4, name: "Moving", icon: "📦" },
    { id: 5, name: "Pet Sitting", icon: "🐾" },
    { id: 6, name: "Gardening", icon: "🌱" },
    { id: 7, name: "Handyman", icon: "🔧" },
    { id: 8, name: "Cooking", icon: "🍳" },
  ];

  // Mock featured services
  const featuredServices = [
    {
      id: 1,
      title: "Math Tutoring for High School Students",
      category: "Tutoring",
      location: "Downtown",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80",
      provider: "Alex Johnson",
      description:
        "Experienced math tutor specializing in calculus and algebra. Available weekday evenings and weekends.",
      contact: "alex@example.com",
    },
    {
      id: 2,
      title: "Home Deep Cleaning Services",
      category: "Cleaning",
      location: "Westside",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80",
      provider: "Maria Garcia",
      description:
        "Professional home cleaning with eco-friendly products. Kitchen, bathroom, living areas, and more.",
      contact: "maria@example.com",
    },
    {
      id: 3,
      title: "Computer Repair & Tech Support",
      category: "Tech Help",
      location: "Eastside",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=500&q=80",
      provider: "David Kim",
      description:
        "Fix computer issues, software installation, virus removal, and general tech support for all devices.",
      contact: "david@example.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-teal-600">
              LocalHelp
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search services..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <nav className="flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-teal-600">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-teal-600">
                About
              </Link>
              <Link
                to="/how-it-works"
                className="text-gray-700 hover:text-teal-600"
              >
                How It Works
              </Link>
            </nav>
            <Link to="/auth">
              <Button variant="outline">Sign In/Sign Up</Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Post a Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <ServiceForm />
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white px-4 py-3 shadow-lg">
            <div className="relative mb-3">
              <Input
                type="text"
                placeholder="Search services..."
                className="pl-10 w-full"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-teal-600 py-1">
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-teal-600 py-1"
              >
                About
              </Link>
              <Link
                to="/how-it-works"
                className="text-gray-700 hover:text-teal-600 py-1"
              >
                How It Works
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-teal-600 hover:bg-teal-700 w-full mt-2">
                    Post a Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <ServiceForm />
                </DialogContent>
              </Dialog>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-500 to-blue-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find or Offer Help in Your Community
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with local service providers or offer your skills to help
              others in your neighborhood.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-white text-teal-600 hover:bg-gray-100"
                  >
                    Offer a Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <ServiceForm />
                </DialogContent>
              </Dialog>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                Find Help
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="text-center hover:shadow-md transition-shadow cursor-pointer bg-white"
                >
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-medium">{category.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Services</h2>
              <Button
                variant="ghost"
                className="text-teal-600 hover:text-teal-700"
              >
                View All <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-teal-600">
                      {service.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{service.location}</span>
                      <div className="flex items-center ml-4">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                        <span>{service.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-600 line-clamp-2">
                      {service.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedService(service)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Listings */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Recent Listings</h2>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tutoring">Tutoring</TabsTrigger>
                <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
                <TabsTrigger value="tech">Tech Help</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <ServiceGrid />
              </TabsContent>
              <TabsContent value="tutoring">
                <ServiceGrid />
              </TabsContent>
              <TabsContent value="cleaning">
                <ServiceGrid />
              </TabsContent>
              <TabsContent value="tech">
                <ServiceGrid />
              </TabsContent>
              <TabsContent value="other">
                <ServiceGrid />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-teal-100 rounded-full p-6 mb-4">
                  <Search className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Find Services</h3>
                <p className="text-gray-600">
                  Browse through various categories or search for specific
                  services in your area.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-teal-100 rounded-full p-6 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-teal-600"
                  >
                    <path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-1"></path>
                    <path d="M7 8H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4l4-4h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H9l-4-4H7Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Directly</h3>
                <p className="text-gray-600">
                  Contact service providers directly through their preferred
                  contact method.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-teal-100 rounded-full p-6 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-teal-600"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Get Things Done</h3>
                <p className="text-gray-600">
                  Arrange details with the service provider and get the help you
                  need.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LocalHelp</h3>
              <p className="text-gray-300">
                Connecting communities through local services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-gray-300 hover:text-white"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-300 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <p className="text-yellow-300 font-bold mb-2">⚠️ Disclaimer:</p>
              <p className="text-gray-300 text-sm">
                This platform is a free listing service for the community. We do
                not verify users, handle payments, or take responsibility for
                any interactions, payments, or services provided. Use at your
                own discretion.
              </p>
            </div>
            <p className="text-center text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} LocalHelp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Service Detail Modal */}
      {selectedService && (
        <Dialog
          open={!!selectedService}
          onOpenChange={() => setSelectedService(null)}
        >
          <DialogContent className="sm:max-w-[800px]">
            <ServiceDetail service={selectedService} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HomePage;
