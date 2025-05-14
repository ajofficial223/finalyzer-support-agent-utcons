
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '@/components/ModeToggle';

interface FormData {
  name: string;
  email: string;
  industry: string;
  organization: string;
}

const FormPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    industry: '',
    organization: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.industry || !formData.organization) {
      alert('Please fill out all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('https://testingperpose05.app.n8n.cloud/webhook/form fill up finalyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('userProfile', JSON.stringify(formData));
        // Redirect to chat interface
        navigate('/chat');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/5feb2d40-47dc-440e-b075-22b9d60d713b.png"
            alt="FinAlyzer Logo" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">Welcome to FinAlyzer Support</h1>
          <p className="text-muted-foreground">
            Please provide your information to continue to the chat interface
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="glass-effect rounded-3xl p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-5 py-3 rounded-full glass-effect focus:outline-none 
                  focus:ring-2 focus:ring-primary/50 text-foreground"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-5 py-3 rounded-full glass-effect focus:outline-none 
                  focus:ring-2 focus:ring-primary/50 text-foreground"
                required
              />
            </div>
            
            <div>
              <label htmlFor="industry" className="block text-sm font-medium mb-1">
                Business Industry
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="Finance, Technology, Healthcare, etc."
                className="w-full px-5 py-3 rounded-full glass-effect focus:outline-none 
                  focus:ring-2 focus:ring-primary/50 text-foreground"
                required
              />
            </div>
            
            <div>
              <label htmlFor="organization" className="block text-sm font-medium mb-1">
                Organization Name
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Your Company Name"
                className="w-full px-5 py-3 rounded-full glass-effect focus:outline-none 
                  focus:ring-2 focus:ring-primary/50 text-foreground"
                required
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-full 
                shadow-lg hover:bg-primary/90 transition-all duration-200 flex justify-center 
                items-center space-x-2 hover:shadow-xl active:scale-95"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Continue to Chat</span>
              )}
            </button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground pt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
