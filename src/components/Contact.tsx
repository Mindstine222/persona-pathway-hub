
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    services: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const serviceOptions = [
    "Individual Assessments",
    "Team Building Workshops", 
    "Leadership Development",
    "Conflict Resolution",
    "HR Consulting",
    "Personal Branding (Resume & LinkedIn Optimization)",
    "Interview Preparation & Salary Negotiation",
    "Networking Strategies",
    "Job Search Support/Career Transition/Outplacement",
    "Leadership and Manager Coaching/Workshops",
    "Talent Acquisition",
    "Employee Development Programs",
    "Employee Engagement and Culture Initiatives",
    "Rewards Planning",
    "Change Management",
    "Setting up HR in New Locations",
    "Day-to-Day Work Support",
    "Conflict Resolution & Communication",
    "Mentorship",
    "Work-Life Balance",
    "Dealing with a Tough Manager",
    "Enabling Results Through Others",
    "Individual INTRA16 Assessments",
    "Team INTRA16 Analysis",
    "Leadership Style Assessment",
    "Communication Workshops",
    "Team Building Sessions",
    "Personality-Based Coaching",
    "Starter Package ($99/month)",
    "Business Package ($299/month)",
    "Enterprise Package (Custom)",
    "Monthly Subscription ($49/month)",
    "Annual Subscription ($490/year)"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
        services: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to discover your personality type or implement INTRA16 in your organization? Contact us today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="services">Service of Interest</Label>
                  <Select value={formData.services} onValueChange={(value) => setFormData(prev => ({ ...prev, services: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {serviceOptions.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us about your needs and how we can help..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>info@intra16.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>123 Business Ave, Suite 100<br />City, State 12345</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose INTRA16?</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Scientifically validated personality assessments</li>
                  <li>• Expert consultation and interpretation</li>
                  <li>• Customized solutions for organizations</li>
                  <li>• Proven track record of success</li>
                  <li>• Ongoing support and development</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
