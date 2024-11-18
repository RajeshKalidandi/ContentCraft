import React from 'react';
import { Menu, X, Wand2, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out');
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Wand2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ContentCraft.ai</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-gray-600 hover:text-indigo-600">Features</Link>
            <Link to="/#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</Link>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/editor"
                  className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-indigo-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/#features" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">Features</Link>
            <Link to="/#pricing" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">Pricing</Link>
            {currentUser ? (
              <>
                <Link 
                  to="/editor"
                  className="block px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-gray-600 hover:text-indigo-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-indigo-600"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register"
                  className="block px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}