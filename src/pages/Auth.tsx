
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ForgotPassword from "@/components/ForgotPassword";
import { linkAssessmentsToUser } from "@/utils/assessmentLinker";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase(); // ✅ normalize once
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        } else if (data.user && !data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          toast({
            title: "Email verification required",
            description: "Please verify your email to access your dashboard. Check your inbox for the verification link.",
            variant: "destructive",
          });
        } else if (data.user) {
          // Link any existing assessments to this user
          await linkAssessmentsToUser(data.user.id, data.user.email!);
          
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate("/dashboard");
        }
      } else {
        const redirectUrl = window.location.hostname === 'localhost' 
          ? `${window.location.origin}/dashboard`
          : 'https://duskydunes.com/dashboard';
        
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              first_name: firstName,
              last_name: lastName,
            }
          }
        });

        if (error) {
          if (error.message.includes("already registered") || 
              error.message.includes("already been registered") ||
              error.message.includes("User already registered")) {
            toast({
              title: "Account already exists",
              description: "This email is already registered. Please log in or use 'Forgot Password' to reset your password.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Signup failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else if (data.user && !data.session) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account. You'll be redirected to your dashboard after verification.",
          });
        } else if (data.user && data.session) {
          // Link any existing assessments to this user
          await linkAssessmentsToUser(data.user.id, data.user.email!);
          
          toast({
            title: "Account created!",
            description: "Welcome to INTRA16!",
          });
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900 dark:via-gray-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <ForgotPassword onBack={() => setShowForgotPassword(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900 dark:via-gray-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">INTRA16</span>
            </div>
            <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            {!isLogin && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Join thousands discovering their personality type
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required={!isLogin}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required={!isLogin}
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                  {isLogin && (
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
                {!isLogin && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Minimum 6 characters required
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <Button
                  variant="link"
                  className="ml-1 p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </Button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                  🔒 Your data is secure and will never be shared
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
