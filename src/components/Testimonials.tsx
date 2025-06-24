
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director",
      company: "TechCorp Solutions",
      image: "https://images.unsplash.com/photo-1494790108755-2616b85ef842?w=100&h=100&fit=crop&crop=face",
      content: "The MBTI assessments transformed how our teams collaborate. We saw a 40% improvement in project delivery times and much better communication across departments.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "CEO",
      company: "Innovation Labs",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      content: "Implementing MBTI testing helped us build more balanced teams and reduce conflicts. The ROI was evident within the first quarter.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Team Lead",
      company: "Digital Dynamics",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: "The detailed reports and team analysis provided insights we never had before. Our team productivity increased significantly, and morale is at an all-time high.",
      rating: 5
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading Companies
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            See how organizations like yours have transformed their workplace culture and productivity with our MBTI services.
          </p>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg w-[280px] flex-shrink-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 mb-6 leading-relaxed text-sm">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex items-center gap-3">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                        <div className="text-xs text-gray-600">{testimonial.role}</div>
                        <div className="text-xs text-blue-600">{testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Tablet and Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Logos */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">Trusted by 500+ companies worldwide</p>
          <div className="flex justify-center items-center gap-6 md:gap-12 opacity-60 flex-wrap">
            <div className="text-lg md:text-2xl font-bold text-gray-400">TechCorp</div>
            <div className="text-lg md:text-2xl font-bold text-gray-400">Innovation Labs</div>
            <div className="text-lg md:text-2xl font-bold text-gray-400">Digital Dynamics</div>
            <div className="text-lg md:text-2xl font-bold text-gray-400">Future Systems</div>
            <div className="text-lg md:text-2xl font-bold text-gray-400">Global Solutions</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
