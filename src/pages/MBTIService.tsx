import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SubscriptionForm from "@/components/SubscriptionForm";
import { Check, Users, TrendingUp, Award, Target, Lightbulb, MessageSquare, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const MBTIService = () => {
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");

  const handlePackageSelect = (packageType: string) => {
    setSelectedPackage(packageType);
    setShowSubscriptionForm(true);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If contact section is on a different page, navigate to home and then scroll
      window.location.href = '/#contact';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete MBTI
              <span className="text-blue-600 block">Assessment Services</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Unlock the power of personality insights with our comprehensive Myers-Briggs Type Indicator services. 
              Perfect for individuals, teams, and organizations seeking deeper understanding and improved performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessment">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Start Free Assessment
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={scrollToContact}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Comprehensive Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our range of MBTI assessment services designed to meet your unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Individual Assessments */}
            <Card className="bg-white hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <Lightbulb className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">Individual Assessments</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Gain personal insights and understand your unique strengths and preferences.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Detailed personality report</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Personalized development tips</span>
                  </li>
                </ul>
                <Button className="mt-4 w-full">Learn More</Button>
              </CardContent>
            </Card>

            {/* Team Building Workshops */}
            <Card className="bg-white hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <Users className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">Team Building Workshops</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Enhance team collaboration and communication through MBTI-based workshops.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Improved team dynamics</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Conflict resolution strategies</span>
                  </li>
                </ul>
                <Button className="mt-4 w-full">Explore Workshops</Button>
              </CardContent>
            </Card>

            {/* Leadership Development */}
            <Card className="bg-white hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <Target className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">Leadership Development</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Develop effective leadership skills with personalized MBTI insights.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Strategic decision-making</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Enhanced communication skills</span>
                  </li>
                </ul>
                <Button className="mt-4 w-full">View Programs</Button>
              </CardContent>
            </Card>

            {/* Conflict Resolution */}
            <Card className="bg-white hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <MessageSquare className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">Conflict Resolution</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Resolve workplace conflicts by understanding different personality types.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Improved communication</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Understanding different perspectives</span>
                  </li>
                </ul>
                <Button className="mt-4 w-full">Explore Solutions</Button>
              </CardContent>
            </Card>

            {/* HR Consulting */}
            <Card className="bg-white hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <BarChart3 className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">HR Consulting</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Optimize your HR strategies with MBTI-based insights and consulting.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Data-driven HR decisions</span>
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Improved employee satisfaction</span>
                  </li>
                </ul>
                <Button className="mt-4 w-full">Get Consulting</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your MBTI Package
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect solution for your needs, from individual assessments to enterprise-wide implementations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Package */}
            <Card className="relative border-2 hover:border-blue-200 transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Starter Package</CardTitle>
                <div className="text-4xl font-bold text-blue-600 my-4">$99<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600">Perfect for small teams and startups</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Up to 25 assessments per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Basic personality reports</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Team compatibility analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full mt-6"
                  onClick={() => handlePackageSelect('starter')}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Business Package */}
            <Card className="relative border-2 border-blue-500 hover:border-blue-600 transition-all duration-300">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Business Package</CardTitle>
                <div className="text-4xl font-bold text-blue-600 my-4">$299<span className="text-lg text-gray-500">/month</span></div>
                <p className="text-gray-600">Ideal for growing businesses</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Up to 100 assessments per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Comprehensive personality reports</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Advanced team dynamics analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Leadership development insights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handlePackageSelect('business')}
                >
                  Choose Business
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Package */}
            <Card className="relative border-2 hover:border-blue-200 transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Enterprise Package</CardTitle>
                <div className="text-4xl font-bold text-blue-600 my-4">Custom</div>
                <p className="text-gray-600">Tailored for large organizations</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Unlimited assessments</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Custom reporting and analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>On-site training and workshops</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>24/7 premium support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full mt-6"
                  onClick={() => handlePackageSelect('enterprise')}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Options */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Flexible Subscription Options</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4"
                onClick={() => handlePackageSelect('monthly')}
              >
                Monthly Subscription ($49/month)
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4"
                onClick={() => handlePackageSelect('annual')}
              >
                Annual Subscription ($490/year - Save 17%)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Organization?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations that have unlocked their potential with our MBTI services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assessment">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Start Free Assessment
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
              onClick={scrollToContact}
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Subscription Form Modal */}
      {showSubscriptionForm && (
        <SubscriptionForm
          packageType={selectedPackage}
          onClose={() => setShowSubscriptionForm(false)}
        />
      )}
    </div>
  );
};

export default MBTIService;
