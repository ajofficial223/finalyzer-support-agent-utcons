
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModeToggle } from '@/components/ModeToggle';
import { User, Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
  industry: z.string().min(2, { message: 'Industry must be at least 2 characters.' }),
  organization: z.string().min(2, { message: 'Organization must be at least 2 characters.' }),
});

// Define signin schema (simplified for signin)
const signinSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type FormData = z.infer<typeof formSchema>;
type SigninData = z.infer<typeof signinSchema>;

// Mock user database for demonstration
const MOCK_USERS = [
  {
    email: 'test@example.com',
    password: 'Password123',
    name: 'Test User',
    industry: 'Technology',
    organization: 'Example Corp'
  },
  {
    email: 'user@example.com',
    password: 'Secure123',
    name: 'John Doe',
    industry: 'Finance',
    organization: 'Example Finance'
  }
];

const FormPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Initialize form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      industry: '',
      organization: ''
    }
  });
  
  const signinForm = useForm<SigninData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    
    try {
      // For now, just simulate a Google user login and redirect to chat
      const dummyUserProfile = {
        name: "Google User",
        email: "google.user@example.com",
        industry: "Technology",
        organization: "Google"
      };
      
      localStorage.setItem('userProfile', JSON.stringify(dummyUserProfile));
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Signed in with Google successfully.",
      });
      
      // Redirect to chat interface
      navigate('/chat');
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Failed to sign in with Google. Please try again.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const onSignIn = async (formData: SigninData) => {
    setIsLoading(true);
    
    try {
      // Find user with matching email and password in our mock database
      const user = MOCK_USERS.find(
        u => u.email === formData.email && u.password === formData.password
      );
      
      if (user) {
        // Create user profile without password
        const userProfile = {
          name: user.name,
          email: user.email,
          industry: user.industry,
          organization: user.organization
        };
        
        // Store in localStorage and redirect
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        toast({
          title: "Success!",
          description: "Signed in successfully. Welcome back!",
        });
        
        navigate('/chat');
      } else {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "There was a problem signing in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    try {
      // For signup, submit to webhook
      if (authMode === 'signup') {
        const response = await fetch('https://testingperpose05.app.n8n.cloud/webhook/form fill up finalyzer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            industry: formData.industry,
            organization: formData.organization
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit form data');
        }
        
        // Add the new user to our mock database (in a real app this would be a database operation)
        MOCK_USERS.push({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          industry: formData.industry,
          organization: formData.organization
        });
      }
      
      // Create user profile without password
      const userProfile = {
        name: formData.name,
        email: formData.email,
        industry: formData.industry,
        organization: formData.organization
      };
      
      // Store in localStorage
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      toast({
        title: "Success!",
        description: authMode === 'signin' ? "Signed in successfully." : "Account created successfully!",
      });
      
      // Redirect to chat interface
      navigate('/chat');
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was a problem with your submission. Please try again.",
      });
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
            {authMode === 'signin' 
              ? 'Sign in to continue to the chat interface'
              : 'Create an account to get started'}
          </p>
        </div>
        
        {authMode === 'signin' ? (
          <Form {...signinForm}>
            <form onSubmit={signinForm.handleSubmit(onSignIn)} className="glass-effect rounded-3xl p-6 space-y-5">
              <FormField
                control={signinForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Email Address" 
                          type="email" 
                          className="pl-10 h-12 w-full rounded-full glass-effect" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signinForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Password" 
                          type={showPassword ? "text" : "password"} 
                          className="pl-10 pr-10 h-12 w-full rounded-full glass-effect" 
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-full 
                    shadow-lg hover:bg-primary/90 transition-all duration-200 flex justify-center 
                    items-center space-x-2 hover:shadow-xl active:scale-95 h-12"
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
                    <span>Sign In</span>
                  )}
                </Button>
              </div>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full rounded-full h-12 flex items-center justify-center space-x-2"
              >
                {isGoogleLoading ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="glass-effect rounded-3xl p-6 space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Full Name" 
                          className="pl-10 h-12 w-full rounded-full glass-effect" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Email Address" 
                          type="email" 
                          className="pl-10 h-12 w-full rounded-full glass-effect" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Password" 
                          type={showPassword ? "text" : "password"} 
                          className="pl-10 pr-10 h-12 w-full rounded-full glass-effect" 
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Business Industry" 
                        className="h-12 w-full rounded-full glass-effect" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Organization Name" 
                        className="h-12 w-full rounded-full glass-effect" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-full 
                    shadow-lg hover:bg-primary/90 transition-all duration-200 flex justify-center 
                    items-center space-x-2 hover:shadow-xl active:scale-95 h-12"
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
                    <span>Sign Up</span>
                  )}
                </Button>
              </div>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full rounded-full h-12 flex items-center justify-center space-x-2"
              >
                {isGoogleLoading ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                )}
                <span>Sign up with Google</span>
              </Button>
            </form>
          </Form>
        )}
        
        <div className="text-center mt-6">
          <button 
            type="button" 
            onClick={toggleAuthMode}
            className="text-sm text-primary hover:underline focus:outline-none"
          >
            {authMode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground pt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default FormPage;
