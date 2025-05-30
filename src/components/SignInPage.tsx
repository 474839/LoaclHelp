import React, { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "./ui/use-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  // console.log('SignInPage component render - user:', user); // Removed console log for clarity
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    location: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Effect to navigate after successful sign-in or signup based on profile completion
  useEffect(() => {
    async function checkProfileCompletionAndNavigate() {
      console.log('useEffect - user:', user);
      if (user) {
        console.log('useEffect - User is authenticated, checking profile completion...');
        const supabase = createSupabaseBrowserClient();
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('phone_number, location') // Fetch phone_number and location
          .eq('user_id', user.id)
          .single();

        console.log('useEffect - Profile fetch result:', profile, 'Error:', error);

        if (error && error.details?.includes('0 rows')) {
           console.log('useEffect - Profile record does not exist, navigating to /complete-profile');
           navigate("/complete-profile");
        } else if (error) {
          console.error("useEffect - Error fetching profile completion status:", error);
          // Handle other errors if necessary, maybe stay on signin page or show a message
        } else if (profile && (!profile.phone_number || !profile.location)) {
           console.log('useEffect - Profile exists but phone_number or location is missing, navigating to /complete-profile');
           navigate("/complete-profile");
        } else {
          console.log('useEffect - Profile complete, navigating to /');
          navigate("/");
        }
      } else {
        console.log('useEffect - User is null, staying on signin page.');
      }
    }

    checkProfileCompletionAndNavigate();
  }, [user, navigate]); // Depend on user and navigate

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) throw error;
      // Navigation will be handled by the useEffect hook
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Error",
        description: "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      
      // Sign up the user with email and password
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Success",
        description: "Account created! Please check your email to verify your account.",
      });
      // Navigation will be handled by the useEffect hook after auth state changes
    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to LocalHelp</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="grid gap-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                    className="pr-10" // Add padding to make space for the icon
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center top-5"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showPassword ? "hide" : "show"}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="grid gap-2 relative">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Create a password"
                    className="pr-10" // Add padding to make space for the icon
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center top-5"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                     <AnimatePresence mode="wait">
                      <motion.div
                        key={showPassword ? "hide" : "show"}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your location"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 