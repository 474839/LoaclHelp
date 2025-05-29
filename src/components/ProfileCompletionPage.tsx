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
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "./ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

enum UserType { Hire = "hire", Job = "job" }

export default function ProfileCompletionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date_of_birth: "",
    user_type: UserType.Hire, // Default to hiring
    // Add other questions here as needed
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    // Add validation for current step if needed
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
      const { error } = await supabase
        .from("user_profiles")
        .update({
          date_of_birth: formData.date_of_birth,
          user_type: formData.user_type,
          // Add other fields to update here
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile information saved!",
      });
      navigate("/profile"); // Redirect to the main profile page
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

  // Basic form validation (can be expanded)
  const isStep1Valid = formData.date_of_birth !== "";
  // Add validation for other steps as they are added

  if (!user) {
    return <div className="container py-8">Please sign in to complete your profile.</div>;
  }

  return (
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
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="user_type">What are you looking for?</Label>
                      <RadioGroup value={formData.user_type} onValueChange={handleRadioChange}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={UserType.Hire} id="hire" />
                          <Label htmlFor="hire">I'm looking to hire someone</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={UserType.Job} id="job" />
                          <Label htmlFor="job">I'm looking for a job</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {/* Add more questions for step 1 here */}
                  </div>
                )}

                {/* Add more steps here with conditional rendering based on 'step' */}

              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}

              {step < 2 ? ( // Change '2' to the total number of steps you have
                <Button type="button" onClick={handleNext} disabled={!isStep1Valid}> {/* Add validation check */}
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !isStep1Valid}> {/* Add validation check */}
                  {isLoading ? "Saving..." : "Finish Setup"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 