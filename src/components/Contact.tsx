
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    teamSize: "",
    services: [] as string[],
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const serviceOptions = [
    "MBTI Assessment",
    "Team Building Workshops", 
    "Leadership Development",
    "Career Coaching",
    "Organizational Development",
    "Communication Training",
    "Conflict Resolution",
    "Performance Management",
    "MBTI Monthly Subscription",
    "Starter Package (1-50 employees)",
    "Business Package (51-250 employees)", 
    "Enterprise Package (250+ employees)"
  ];

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(value) 
        ? prev.services.filter(s => s !== value)
        : [...prev.services, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('subscription_requests')
        .insert([{
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          company_name: formData.company || null,
          team_size: formData.teamSize || null,
          package_type: formData.services.join(', '),
          message: `Services interested in: ${formData.services.join(', ')}\n\nMessage: ${formData.message}`
        }]);

      if (error) throw error;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-subscription-confirmation', {
        body: {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          services: formData.services,
          company: formData.company,
          teamSize: formData.teamSize,
          message: formData.message
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw here, just log the error
      }

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        teamSize: "",
        services: [],
        message: ""
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Team?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Get in touch with our HR experts to discuss your organization's needs and find the perfect solution.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl md:text-2xl">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                    <Input 
                      placeholder="John" 
                      className="bg-gray-700 border-gray-600 text-white"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                    <Input 
                      placeholder="Doe" 
                      className="bg-gray-700 border-gray-600 text-white"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Email *</label>
                  <Input 
                    type="email" 
                    placeholder="john@company.com" 
                    className="bg-gray-700 border-gray-600 text-white"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                  <Input 
                    placeholder="Your Company" 
                    className="bg-gray-700 border-gray-600 text-white"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({...prev, company: e.target.value}))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                  <Input 
                    placeholder="e.g., 50-100 employees" 
                    className="bg-gray-700 border-gray-600 text-white"
                    value={formData.teamSize}
                    onChange={(e) => setFormData(prev => ({...prev, teamSize: e.target.value}))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Services of Interest *</label>
                  <Select onValueChange={handleServiceChange}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select services (click to add multiple)" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {serviceOptions.map((service) => (
                        <SelectItem 
                          key={service} 
                          value={service}
                          className="text-white hover:bg-gray-600"
                        >
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.services.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.services.map((service) => (
                        <span 
                          key={service}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-sm cursor-pointer hover:bg-red-600"
                          onClick={() => handleServiceChange(service)}
                        >
                          {service} ✕
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <Textarea 
                    placeholder="Tell us about your HR needs..."
                    className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({...prev, message: e.target.value}))}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting || formData.services.length === 0}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 sm:mb-6">Get in Touch</h3>
              <p className="text-gray-300 mb-6 sm:mb-8">
                Our team of HR experts is ready to help you unlock your organization's potential.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm sm:text-base">Visit Our Website</div>
                  <div className="text-gray-300 text-sm sm:text-base break-all">www.linkedupconsulting.com</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm sm:text-base">Call Us</div>
                  <div className="text-gray-300 text-sm sm:text-base">+1 (555) 123-MBTI</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm sm:text-base">Visit Us</div>
                  <div className="text-gray-300 text-sm sm:text-base">123 Business Ave, Suite 100<br />San Francisco, CA 94105</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm sm:text-base">Business Hours</div>
                  <div className="text-gray-300 text-sm sm:text-base">Mon - Fri: 9:00 AM - 6:00 PM PST</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
              <h4 className="font-semibold text-base sm:text-lg mb-2">Schedule a Demo</h4>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">
                See our platform in action with a personalized demo for your team.
              </p>
              <Link to="/assessment">
                <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white w-full sm:w-auto">
                  Start Free Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
