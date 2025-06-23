
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Brain, TrendingUp, Target, MessageSquare, Award } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Brain,
      title: "Individual MBTI Assessment",
      description: "Comprehensive personality assessment with detailed reports and actionable insights for personal development.",
      features: ["16-page detailed report", "Career guidance", "Communication style analysis"]
    },
    {
      icon: Users,
      title: "Team Dynamics Analysis",
      description: "Understand your team's collective personality profile and optimize collaboration patterns.",
      features: ["Team composition analysis", "Conflict resolution strategies", "Collaboration optimization"]
    },
    {
      icon: Target,
      title: "Leadership Development",
      description: "Specialized MBTI assessments designed for current and aspiring leaders in your organization.",
      features: ["Leadership style identification", "Executive coaching support", "Succession planning insights"]
    },
    {
      icon: MessageSquare,
      title: "Communication Training",
      description: "Improve workplace communication based on personality type preferences and styles.",
      features: ["Type-based communication", "Workshop facilitation", "Ongoing support materials"]
    },
    {
      icon: TrendingUp,
      title: "Performance Optimization",
      description: "Leverage personality insights to boost individual and team performance metrics.",
      features: ["Performance correlation analysis", "Productivity enhancement", "Goal setting alignment"]
    },
    {
      icon: Award,
      title: "Certification Programs",
      description: "Train your HR team to become certified MBTI practitioners within your organization.",
      features: ["Professional certification", "Train-the-trainer programs", "Ongoing mentorship"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive MBTI Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From individual assessments to organization-wide transformations, we provide the tools and expertise your company needs to unlock human potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
