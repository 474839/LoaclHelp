import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ServiceFormProps {
  onSubmit?: (formData: ServiceFormData) => void;
  isSubmitting?: boolean;
}

export interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  availability: string;
  name: string;
  contactInfo: string;
  termsAccepted: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  onSubmit = () => {},
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    availability: "",
    name: "",
    contactInfo: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Partial<ServiceFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name as keyof ServiceFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name as keyof ServiceFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, termsAccepted: checked }));

    // Clear error when checkbox is checked
    if (errors.termsAccepted) {
      setErrors((prev) => ({ ...prev, termsAccepted: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ServiceFormData> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.availability.trim())
      newErrors.availability = "Availability is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.contactInfo.trim())
      newErrors.contactInfo = "Contact information is required";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const serviceCategories = [
    { value: "tutoring", label: "Tutoring" },
    { value: "cleaning", label: "Cleaning" },
    { value: "tech-help", label: "Tech Help" },
    { value: "moving", label: "Moving Assistance" },
    { value: "pet-sitting", label: "Pet Sitting" },
    { value: "gardening", label: "Gardening" },
    { value: "handyman", label: "Handyman" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-background p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Offer Your Service
          </CardTitle>
          <CardDescription className="text-center">
            Fill out the form below to list your service in the community
            marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  Service Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g., Math Tutoring, House Cleaning, Computer Repair"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your service, experience, and what you offer"
                  value={formData.description}
                  onChange={handleChange}
                  className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category" className="text-base font-medium">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange(value, "category")
                  }
                >
                  <SelectTrigger
                    className={errors.category ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="text-base font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="E.g., Downtown, North Campus, Westside"
                  value={formData.location}
                  onChange={handleChange}
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.location}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="availability" className="text-base font-medium">
                  Availability
                </Label>
                <Input
                  id="availability"
                  name="availability"
                  placeholder="E.g., Weekends, Evenings after 6pm, Monday-Friday"
                  value={formData.availability}
                  onChange={handleChange}
                  className={errors.availability ? "border-destructive" : ""}
                />
                {errors.availability && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.availability}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="contactInfo"
                      className="text-base font-medium"
                    >
                      Contact Information
                    </Label>
                    <Input
                      id="contactInfo"
                      name="contactInfo"
                      placeholder="Email or phone number"
                      value={formData.contactInfo}
                      onChange={handleChange}
                      className={errors.contactInfo ? "border-destructive" : ""}
                    />
                    {errors.contactInfo && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.contactInfo}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Alert
                variant="destructive"
                className="bg-amber-50 border-amber-200 text-amber-800"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium">Disclaimer:</p>
                  <p className="text-sm mt-1">
                    This platform is a free listing service for the community.
                    We do not verify users, handle payments, or take
                    responsibility for any interactions, payments, or services
                    provided. Use at your own discretion.
                  </p>
                </AlertDescription>
              </Alert>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={handleCheckboxChange}
                  className={errors.termsAccepted ? "border-destructive" : ""}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I understand that this platform is a community tool only. I
                    agree to connect with others at my own risk, and I'm not
                    using this to hire or act as a professional contractor.
                  </label>
                  {errors.termsAccepted && (
                    <p className="text-sm text-destructive">
                      {errors.termsAccepted}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Post Service"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border pt-4">
          <p className="text-sm text-muted-foreground text-center">
            By posting, you agree to our community guidelines and terms of
            service.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServiceForm;
