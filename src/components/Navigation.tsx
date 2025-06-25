
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-bold text-gray-900">INTRA16</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/mbti" className="text-gray-600 hover:text-blue-600 transition-colors">INTRA16 Services</Link>
            <button onClick={scrollToContact} className="text-gray-600 hover:text-blue-600 transition-colors">Contact</button>
            <Link to="/assessment" className="text-gray-600 hover:text-blue-600 transition-colors">Take Assessment</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                <Button variant="ghost" onClick={handleSignOut} className="text-gray-600 hover:text-blue-600">
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                    Login
                  </Button>
                </Link>
                <Link to="/assessment">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
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
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/mbti" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>INTRA16 Services</Link>
              <button onClick={scrollToContact} className="text-gray-600 hover:text-blue-600 transition-colors text-left">Contact</button>
              <Link to="/assessment" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Take Assessment</Link>
              
              {user ? (
                <div className="flex flex-col gap-2 pt-4">
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button variant="ghost" onClick={handleSignOut} className="justify-start text-gray-600 hover:text-blue-600">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-4">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="justify-start text-gray-600 hover:text-blue-600 w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/assessment" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
