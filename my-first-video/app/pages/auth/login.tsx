import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '~/context/AuthContext';
import { loginPost } from '~/services/apiServices';
import NoAuthRequired from '~/context/NoAuthRequired';
import type { Route } from "./+types/login";
import "../../styles/app.css";

export function loader() {
  return null;
}

// ================================
// ✅ Types
// ================================
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface LoginResponse {
  token: string;
  authUser: {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    two_factor_confirmed_at?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  status: number;
  message: string;
}

// ================================
// ✅ Login Form Component
// ================================
function LoginForm() {
  const [formData, setFormData] = React.useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [rememberMe, setRememberMe] = React.useState<boolean>(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validate form
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'The email field is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'The password field is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginPost<LoginResponse>('/login', formData);

      console.log('Login response:', response);

      // Store auth info and update context
      login(response);

      // Show success message
      console.log("Login successful!");

      // Navigate to home page
      window.location.href = '/';
    } catch (error: any) {
      const message = error?.message || 'Login failed. Please try again.';
      console.error('Login error:', message);
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dark Background with Quote */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white p-12 flex-col justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </div>
          <span className="text-xl font-semibold">Pre-wear</span>
        </div>

        {/* Quote */}
        <div className="space-y-4">
          <blockquote className="text-2xl font-light leading-relaxed">
            "It is quality rather than quantity that matters."
          </blockquote>
          <p className="text-gray-400 text-sm">Lucius Annaeus Seneca</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">Pre-wear</span>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-gray-900">Log in to your account</h2>
            <p className="text-gray-500">Enter your email and password below to log in</p>
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="waseem@softleed.com"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.email
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.password
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${isSubmitting
                ? 'bg-gray-800 cursor-not-allowed opacity-70'
                : 'bg-gray-900 hover:bg-gray-800 active:scale-[0.98]'
                }`}
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-gray-900 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ================================
// ✅ Login Page (Wrapped with NoAuthRequired)
// ================================
export default function Login() {
  return (
    <NoAuthRequired>
      <LoginForm />
    </NoAuthRequired>
  );
}