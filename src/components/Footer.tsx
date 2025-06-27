
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold">Linked Up Consulting</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Transforming workplace dynamics through professional INTRA16 assessments and team development solutions.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Linkedin className="h-4 w-4" />
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Twitter className="h-4 w-4" />
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Facebook className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Individual Assessments</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Team Analysis</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Leadership Development</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Communication Training</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Certification Programs</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">INTRA16 Guide</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Webinars</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>info@linkedupconsulting.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+1 (555) 123-MBTI</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                <span>123 Business Ave, Suite 100<br />San Francisco, CA 94105</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © 2024 linkedupconsulting. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
