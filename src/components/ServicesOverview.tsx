
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Contact, Book, Brain } from "lucide-react";
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
        "Setting up HR in New Locations"
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
    },
    {
      title: "MBTI Services",
      description: "Personality assessments and team development",
      icon: Brain,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      services: [
        "Individual MBTI Assessments",
        "Team MBTI Analysis",
        "Leadership Style Assessment",
        "Communication Workshops",
        "Team Building Sessions",
        "Personality-Based Coaching"
      ],
      color: "orange"
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
      case "orange":
        return {
          bg: "bg-orange-50",
          icon: "bg-orange-100 text-orange-600", 
          button: "bg-orange-600 hover:bg-orange-700"
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
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive HR Services
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Whether you're an individual looking to advance your career, an organization seeking to optimize your workforce, or an HR professional needing support, we have tailored solutions for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {serviceCategories.map((category, index) => {
            const colors = getColorClasses(category.color);
            return (
              <Card key={index} className="bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden h-full flex flex-col">
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${colors.bg} opacity-80`}></div>
                  <div className="absolute top-4 left-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.icon} rounded-lg flex items-center justify-center`}>
                      <category.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 leading-tight">{category.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <ul className="space-y-2 flex-1">
                    {category.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{service}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {category.title === "MBTI Services" ? (
                    <Link to="/mbti" className="mt-auto">
                      <Button className={`w-full ${colors.button} text-white text-sm sm:text-base py-2 sm:py-3`}>
                        Explore MBTI Services
                      </Button>
                    </Link>
                  ) : (
                    <Button className={`w-full ${colors.button} text-white text-sm sm:text-base py-2 sm:py-3 mt-auto`}>
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
