
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MBTIPro</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/mbti" className="text-gray-600 hover:text-blue-600 transition-colors">MBTI Services</Link>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            <Link to="/assessment" className="text-gray-600 hover:text-blue-600 transition-colors">Take Assessment</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
              Login
            </Button>
            <Link to="/assessment">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/mbti" className="text-gray-600 hover:text-blue-600 transition-colors">MBTI Services</Link>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <Link to="/assessment" className="text-gray-600 hover:text-blue-600 transition-colors">Take Assessment</Link>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="ghost" className="justify-start text-gray-600 hover:text-blue-600">
                  Login
                </Button>
                <Link to="/assessment">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
