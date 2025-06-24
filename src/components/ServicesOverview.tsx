
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Contact, Book } from "lucide-react";
import { Link } from "react-router-dom";

const ServicesOverview = () => {
  const serviceCategories = [
    {
      title: "For Candidates and Individuals",
      description: "Personal development and career advancement services",
      icon: Contact,
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop",
      services: [
        "Personal Branding (Resume & LinkedIn Optimization)",
        "Interview Preparation & Salary Negotiation", 
        "Networking Strategies",
        "Job Search Support/Career Transition/Outplacement",
        "Leadership Development"
      ],
      color: "blue"
    },
    {
      title: "For Organizations", 
      description: "Comprehensive HR solutions for businesses",
      icon: Users,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      services: [
        "Leadership and Manager Coaching/Workshops",
        "Talent Acquisition",
        "Employee Development Programs", 
        "Employee Engagement and Culture Initiatives",
        "Rewards Planning",
        "Change Management",
        "Setting up HR in New Locations",
        "MBTI Assessments & Team Analysis"
      ],
      color: "green"
    },
    {
      title: "HR Buddy",
      description: "Ongoing support for HR professionals",
      icon: Book,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop",
      services: [
        "Day-to-Day Work Support",
        "Conflict Resolution & Communication",
        "Mentorship",
        "Work-Life Balance",
        "Dealing with a Tough Manager",
        "Enabling Results Through Others"
      ],
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          icon: "bg-blue-100 text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700"
        };
      case "green":
        return {
          bg: "bg-green-50", 
          icon: "bg-green-100 text-green-600",
          button: "bg-green-600 hover:bg-green-700"
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          icon: "bg-purple-100 text-purple-600", 
          button: "bg-purple-600 hover:bg-purple-700"
        };
      default:
        return {
          bg: "bg-gray-50",
          icon: "bg-gray-100 text-gray-600",
          button: "bg-gray-600 hover:bg-gray-700"
        };
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive HR Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're an individual looking to advance your career, an organization seeking to optimize your workforce, or an HR professional needing support, we have tailored solutions for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {serviceCategories.map((category, index) => {
            const colors = getColorClasses(category.color);
            return (
              <Card key={index} className="bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${colors.bg} opacity-80`}></div>
                  <div className="absolute top-4 left-4">
                    <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{category.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {category.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        {service}
                      </li>
                    ))}
                  </ul>
                  
                  {category.title === "For Organizations" ? (
                    <Link to="/mbti">
                      <Button className={`w-full ${colors.button} text-white`}>
                        Explore MBTI Services
                      </Button>
                    </Link>
                  ) : (
                    <Button className={`w-full ${colors.button} text-white`}>
                      Contact Us
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
