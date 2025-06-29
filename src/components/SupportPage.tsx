import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  Phone,
  Clock,
  Loader
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SupportPageProps {
  onNavigate?: (page: string) => void;
}

export function SupportPage({ onNavigate }: SupportPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.message.trim()) {
      setError('Message is required');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create a new supabase client instance for anonymous access
      // This ensures the request is made with the anon key
      const { createClient } = await import('@supabase/supabase-js');
      const anonClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      // Insert support request into database using anonymous client
      const { data, error: insertError } = await anonClient
        .from('customer_support_requests')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      console.log('Support request submitted successfully:', data);
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error('Error submitting support request:', error);
      setError('Failed to send message. Please try again or contact us directly at support@speakdude.com');
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Contact Info */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
              <div className="mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-3 shadow-md">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                  Get in Touch
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Have questions about SpeakDude? We're here to help you on your language learning journey.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Email Us</h3>
                    <p className="text-gray-600 text-sm">support@speakdude.com</p>
                    <p className="text-xs text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Call Us</h3>
                    <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                    <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM PST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Response Time</h3>
                    <p className="text-gray-600 text-sm">Average response: 2-4 hours</p>
                    <p className="text-xs text-gray-500">During business hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
              {isSubmitted ? (
                // Success State
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Message Sent!</h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                // Form State
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                    <p className="text-gray-600 text-sm">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 text-xs">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-100 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white text-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-100 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white text-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Message Input */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-1">
                        Message *
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Tell us how we can help you..."
                          rows={4}
                          className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-100 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white resize-none text-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-2.5 rounded-lg font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      * We will try to respond back as soon as possible.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}