
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Globe } from "lucide-react";

const Contact = () => {
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
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <Input placeholder="John" className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <Input placeholder="Doe" className="bg-gray-700 border-gray-600 text-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Email</label>
                <Input type="email" placeholder="john@company.com" className="bg-gray-700 border-gray-600 text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                <Input placeholder="Your Company" className="bg-gray-700 border-gray-600 text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                <Input placeholder="e.g., 50-100 employees" className="bg-gray-700 border-gray-600 text-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <Textarea 
                  placeholder="Tell us about your HR needs..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                />
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Send Message
              </Button>
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
              <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white w-full sm:w-auto">
                Book Demo Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
