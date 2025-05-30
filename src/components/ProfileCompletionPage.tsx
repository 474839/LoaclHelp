import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { createSupabaseBrowserClient } from "../lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "./ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "./Navigation";

enum UserType { 
  HIRE = "hire", 
  OFFER = "offer" 
}

export default function ProfileCompletionPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    user_type: UserType.HIRE,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      user_type: value as UserType,
    }));
  };

  const handleNext = () => {
    if (step === 1 && !isStep1Valid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const supabase = createSupabaseBrowserClient();

    try {
      // Update user profile information in the user_profiles table
      const { error } = await supabase
        .from("user_profiles")
        .update({
          phone_number: formData.phone,
          location: formData.location,
          user_type: formData.user_type,
          updated_at: new Date().toISOString(), // Update the timestamp
        })
        .eq("user_id", user.id); // Target the current user's profile

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile information saved!",
      });

      // Redirect based on user type
      if (formData.user_type === UserType.HIRE) {
        navigate("/"); // Redirect to home page for hiring users
      } else {
        // We'll handle the service offering flow later
        navigate("/profile"); // Or a confirmation/next steps page for service providers
      }
    } catch (error) {
      console.error("Error saving profile information:", error);
      toast({
        title: "Error",
        description: "Failed to save profile information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = formData.phone.trim() !== "" && formData.location.trim() !== "";

  if (!user) {
    return <div className="container py-8">Please sign in to complete your profile.</div>;
  }

  return (
    <div>
      <Navigation />
      <div className="container max-w-md py-8">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Please provide some additional information to set up your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          type="text"
                          placeholder="Enter your location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label>What would you like to do?</Label>
                        <RadioGroup 
                          value={formData.user_type} 
                          onValueChange={handleRadioChange}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={UserType.HIRE} id="hire" />
                            <Label htmlFor="hire" className="font-normal">
                              I'm looking to hire someone
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={UserType.OFFER} id="offer" />
                            <Label htmlFor="offer" className="font-normal">
                              I want to offer a service
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}

                {step < 2 ? (
                  <Button 
                    type="button" 
                    onClick={handleNext} 
                    disabled={!isStep1Valid}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Complete Setup"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 