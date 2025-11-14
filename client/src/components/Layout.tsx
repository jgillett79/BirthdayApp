import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Calendar, Users, Gift, LogOut, Menu, X } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-primary-600">🎂 BirthdayApp</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/events"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/events')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Events
                </Link>
                <Link
                  to="/family"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/family')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Family
                </Link>
                <Link
                  to="/gifts"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/gifts')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Gifts
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Desktop user info and logout */}
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Hello, {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-medium ${
                    isActive('/')
                      ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                      : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Home className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
                <Link
                  to="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-medium ${
                    isActive('/events')
                      ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                      : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Events
                </Link>
                <Link
                  to="/family"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-medium ${
                    isActive('/family')
                      ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                      : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5 mr-3" />
                  Family
                </Link>
                <Link
                  to="/gifts"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-medium ${
                    isActive('/gifts')
                      ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                      : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Gift className="w-5 h-5 mr-3" />
                  Gifts
                </Link>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 mb-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
