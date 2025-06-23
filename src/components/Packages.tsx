
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap } from "lucide-react";

const Packages = () => {
  const packages = [
    {
      name: "Starter Pack",
      description: "Perfect for small teams getting started with MBTI",
      price: "$299",
      period: "one-time",
      tests: "10 assessments",
      popular: false,
      features: [
        "10 complete MBTI assessments",
        "Individual detailed reports",
        "Basic team overview",
        "Email support",
        "6-month access to results",
        "Digital delivery"
      ]
    },
    {
      name: "Business Bundle",
      description: "Ideal for medium-sized companies",
      price: "$899",
      period: "one-time",
      tests: "50 assessments",
      popular: true,
      features: [
        "50 complete MBTI assessments",
        "Individual & team reports",
        "Team dynamics analysis",
        "Priority phone support",
        "12-month access to results",
        "Manager training session",
        "Custom team insights"
      ]
    },
    {
      name: "Enterprise Pack",
      description: "Comprehensive solution for large organizations",
      price: "$2,499",
      period: "one-time",
      tests: "200 assessments",
      popular: false,
      features: [
        "200 complete MBTI assessments",
        "Comprehensive reporting suite",
        "Advanced team analytics",
        "Dedicated account manager",
        "24-month access to results",
        "On-site training workshop",
        "Custom integration support",
        "Quarterly review sessions"
      ]
    }
  ];

  const subscriptions = [
    {
      name: "Monthly Pro",
      description: "Ongoing assessment needs with flexibility",
      price: "$199",
      period: "per month",
      tests: "20 assessments/month",
      popular: false,
      features: [
        "20 assessments per month",
        "Rollover unused tests",
        "Real-time dashboard",
        "Monthly team insights",
        "Email & chat support",
        "Cancel anytime",
        "API access available"
      ]
    },
    {
      name: "Annual Enterprise",
      description: "Best value for continuous development",
      price: "$1,999",
      period: "per year",
      tests: "300 assessments/year",
      popular: true,
      features: [
        "300 assessments per year",
        "Unlimited team reports",
        "Advanced analytics platform",
        "Dedicated success manager",
        "Quarterly strategy sessions",
        "Custom workshop series",
        "Priority feature requests",
        "2 months free"
      ]
    }
  ];

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Package
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you need bulk assessments or ongoing monthly access, we have flexible options to meet your organization's needs.
          </p>
        </div>

        {/* Bulk Purchase Packages */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Bulk Purchase Options</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-blue-500 border-2 shadow-xl' : 'border-gray-200'} hover:shadow-lg transition-all duration-300`}>
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-gray-900">{pkg.name}</CardTitle>
                  <CardDescription className="text-gray-600">{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                    <span className="text-gray-600 ml-2">{pkg.period}</span>
                  </div>
                  <div className="text-blue-600 font-semibold">{pkg.tests}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-6 ${pkg.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'} text-white`}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Packages */}
        <div>
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Monthly Subscriptions</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {subscriptions.map((sub, index) => (
              <Card key={index} className={`relative ${sub.popular ? 'border-blue-500 border-2 shadow-xl' : 'border-gray-200'} hover:shadow-lg transition-all duration-300`}>
                {sub.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Best Value
                  </Badge>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-gray-900">{sub.name}</CardTitle>
                  <CardDescription className="text-gray-600">{sub.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{sub.price}</span>
                    <span className="text-gray-600 ml-2">{sub.period}</span>
                  </div>
                  <div className="text-blue-600 font-semibold">{sub.tests}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {sub.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-6 ${sub.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'} text-white`}>
                    Start Subscription
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Packages;
