import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar as CalendarIcon,
  MessageSquare,
} from "lucide-react";

interface ServiceDetailProps {
  service?: {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    availability: {
      days: string[];
      hours: string;
    };
    contact: {
      name: string;
      email: string;
      phone?: string;
    };
    createdAt: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

const ServiceDetail = ({
  service,
  isOpen = true,
  onClose = () => {},
}: ServiceDetailProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Default service data if none provided
  const defaultService = {
    id: "1",
    title: "Math Tutoring for High School Students",
    description:
      "Experienced math tutor offering help with algebra, calculus, and statistics. I can help improve grades and build confidence in math. I have 5 years of tutoring experience and a degree in Mathematics.",
    category: "Tutoring",
    location: "Downtown Community Center",
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "4:00 PM - 7:00 PM",
    },
    contact: {
      name: "Alex Johnson",
      email: "alex.j@example.com",
      phone: "555-123-4567",
    },
    createdAt: "2023-06-15",
  };

  const serviceData = service || defaultService;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {serviceData.title}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{serviceData.category}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {serviceData.location}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {serviceData.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-2">Availability</h3>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{serviceData.availability.hours}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {serviceData.availability.days.map((day) => (
                    <Badge key={day} variant="outline">
                      {day}
                    </Badge>
                  ))}
                </div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Name:</span>
                    <span>{serviceData.contact.name}</span>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <a
                      href={`mailto:${serviceData.contact.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {serviceData.contact.email}
                    </a>
                  </div>

                  {serviceData.contact.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <a
                        href={`tel:${serviceData.contact.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {serviceData.contact.phone}
                      </a>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Mail className="mr-2 h-4 w-4" /> Email Provider
                  </Button>

                  {serviceData.contact.phone && (
                    <Button variant="outline" className="w-full" size="lg">
                      <Phone className="mr-2 h-4 w-4" /> Call Provider
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-md">
              <p className="font-medium mb-1">⚠️ Disclaimer:</p>
              <p>
                This platform is a free listing service for the community. We do
                not verify users, handle payments, or take responsibility for
                any interactions, payments, or services provided. Use at your
                own discretion.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Listed on {new Date(serviceData.createdAt).toLocaleDateString()}
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetail;
