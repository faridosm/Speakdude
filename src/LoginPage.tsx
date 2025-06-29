import React, { useState } from 'react';
import { MessageCircle, Mail, Lock, Eye, EyeOff, ArrowRight, User, AlertCircle } from 'lucide-react';
import { useAuth } from './hooks/useAuth';

interface LoginPageProps {
  onNavigate?: (page: string) => void;
  isSignUp?: boolean;
}

function LoginPage({ onNavigate, isSignUp = false }: LoginPageProps) {
  const { signIn, signUp } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(isSignUp);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUpMode) {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) throw error;
        
        // Show success message for sign up
        alert('Account created successfully! Please check your email to verify your account.');
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      }
      
      // Navigate to dashboard on successful authentication
      if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f5f7a8 0%, #e8d5ff 50%, #d4a5ff 100%)'
    }}>
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.25) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Auth Content - Centered without navbar */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Auth Card - Reduced padding */}
          <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            {/* Header - Reduced margin */}
            <div className="text-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                {isSignUpMode ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-600 font-medium text-sm">
                {isSignUpMode ? 'Join SpeakDude today' : 'Sign in to continue to SpeakDude'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Auth Form - Reduced spacing */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Name Input - Only for Sign Up */}
              {isSignUpMode && (
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-100 transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium bg-gray-50 focus:bg-white text-sm"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-100 transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium bg-gray-50 focus:bg-white text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-100 transition-all duration-200 text-gray-900 placeholder-gray-500 font-medium bg-gray-50 focus:bg-white text-sm"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password - Only for Sign In */}
              {!isSignUpMode && (
                <div className="flex items-center justify-between pt-0">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="w-4 h-4 text-red-500 border-2 border-gray-300 rounded focus:ring-red-500 focus:ring-1"
                    />
                    <label htmlFor="remember-me" className="text-sm font-medium text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-2 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUpMode ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Toggle Sign In/Up */}
              <p className="text-center text-gray-600 font-medium mt-4 text-sm">
                {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUpMode(!isSignUpMode);
                    setError(null);
                    setFormData({ name: "", email: "", password: "" });
                  }}
                  className="text-red-500 hover:text-red-600 font-semibold transition-colors"
                >
                  {isSignUpMode ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </form>

            {/* Back to Home Link */}
            <div className="text-center mt-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => onNavigate && onNavigate('home')}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;