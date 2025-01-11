import { Link } from "react-router-dom";
import { Mail, Twitter, Share2 } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 mt-auto py-8 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex flex-col items-start gap-2">
              <img 
                src="/lovable-uploads/a9b9dcba-e93f-40b8-b434-166fe8567c97.png" 
                alt="LearnMorals.com Logo" 
                className="h-6 w-6"
              />
              <h3 className="font-semibold text-lg text-white">LearnMorals.com</h3>
            </div>
            <p className="text-sm text-gray-300">
              Creating personalized stories with meaningful moral lessons for readers of all ages.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/your-stories" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Your Stories
                </Link>
              </li>
              <li>
                <Link to="/share" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Share
                </Link>
              </li>
              <li>
                <Link to="/my-subscriptions" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Subscriptions
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Privacy Policy & Terms
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/learnmorals"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@learnmorals.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <Link
                to="/share"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
          <p>&copy; {currentYear} LearnMorals.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};