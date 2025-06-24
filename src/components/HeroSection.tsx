
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center pt-16">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="text-blue-600 block">HR Strategy</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Comprehensive HR solutions for individuals, organizations, and HR professionals. From personality assessments to leadership development.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/mbti">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg w-full sm:w-auto">
                  Explore MBTI Services
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 w-full sm:w-auto">
                Schedule Consultation
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 pt-6 sm:pt-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-sm text-gray-600">10,000+ Professionals Served</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span className="text-sm text-gray-600">95% Success Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                <span className="text-sm text-gray-600">Certified Experts</span>
              </div>
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 mx-auto max-w-md lg:max-w-none">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">HR Solutions</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Complete HR Services</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">4</div>
                    <div className="text-xs sm:text-sm text-gray-600">Service Categories</div>
                  </div>
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">25+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Services Offered</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Client Satisfaction</span>
                    <span>95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-[95%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
