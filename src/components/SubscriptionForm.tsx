
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface SubscriptionFormProps {
  packageType: string;
  onClose: () => void;
}

const SubscriptionForm = ({ packageType, onClose }: SubscriptionFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_name: "",
    team_size: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Insert subscription request into database
      const { error: dbError } = await supabase
        .from('subscription_requests')
        .insert([{
          ...formData,
          package_type: packageType
        }]);

      if (dbError) throw dbError;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-subscription-confirmation', {
        body: { 
          ...formData, 
          package_type: packageType 
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw error - subscription is still recorded
      }

      toast({
        title: "Request Submitted!",
        description: "Thank you for your interest. We'll contact you soon to confirm payment and activate your subscription.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting subscription request:', error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPackageTitle = () => {
    switch (packageType) {
      case 'starter': return 'Starter Package';
      case 'business': return 'Business Package';
      case 'enterprise': return 'Enterprise Package';
      case 'monthly': return 'Monthly Subscription';
      case 'annual': return 'Annual Subscription';
      default: return 'Subscription Package';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{getPackageTitle()}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="team_size">Team Size</Label>
              <Select onValueChange={(value) => setFormData({...formData, team_size: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="message">Additional Requirements</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Tell us about your specific needs..."
              />
            </div>
            
            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionForm;
