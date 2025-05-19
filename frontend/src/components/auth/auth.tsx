import React, { useState, useEffect, useMemo } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  Mail,
  Lock,
  AlertCircle,
  User,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "../../services/axios.interceptor";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
/**
 * Authentication component handling both sign-in and sign-up flows
 * with form validation, password strength analysis, and status feedback
 */
function Auth() {
  // Auth mode state

  const [authMode, setAuthMode] = useState("signin"); // "signin" or "signup"
  const navigaion = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("access")) {
      navigaion("/");
    }
  }, []);
  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  // UI state management
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Clear form when switching auth modes
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      username: "",
    });
    setErrors({});
    setTouched({});
    setAuthSuccess(false);
  }, [authMode]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!formData.password) {
      return { score: 0, label: "Weak" };
    }

    const criteria = [
      formData.password.length >= 8, // Has minimum length
      /[a-z]/.test(formData.password), // Has lowercase
      /[A-Z]/.test(formData.password), // Has uppercase
      /\d/.test(formData.password), // Has number
      /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), // Has special char
    ];

    const score = criteria.filter(Boolean).length;

    // Determine strength label
    let label = "Weak";
    if (score >= 5) label = "Strong";
    else if (score >= 3) label = "Medium";

    return { score, label };
  }, [formData.password]);

  // Field validation
  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return "Invalid email address";
        }
        return "";

      case "password":
        if (!value) return "Password is required";
        if (authMode === "signup") {
          if (value.length < 8) {
            return "Password must be at least 8 characters";
          }
          if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter";
          }
          if (!/\d/.test(value)) {
            return "Password must contain at least one number";
          }
        }
        return "";

      case "username":
        if (authMode === "signup" && !value.trim()) {
          return "Username is required";
        }
        return "";

      default:
        return "";
    }
  };

  // Form validation
  const validateForm = () => {
    // Only validate fields relevant to current auth mode
    const fieldsToValidate =
      authMode === "signin"
        ? ["email", "password"]
        : ["email", "password", "username"];

    const newErrors = {};

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live validation after user has touched a field
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Mark field as touched on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  // const navigate=Navigate()
  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const fieldsToTouch =
      authMode === "signin"
        ? { email: true, password: true }
        : { email: true, password: true, username: true };

    setTouched(fieldsToTouch);

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Determine endpoint based on auth mode
        const endpoint =
          authMode === "signin" ? "/api/auth/login" : "/api/auth";

        // Create payload - only include username for signup
        const payload =
          authMode === "signin"
            ? { email: formData.email, password: formData.password }
            : formData;

        const response = await axiosInstance.post(endpoint, payload);
        if (response) {
          console.log(response, "fadss");
          if (authMode == "signin") {
            localStorage.setItem("access", response.data.accessToken);
          }
        }
        // Handle successful authentication
        setAuthSuccess(true);
        toast.success(
          authMode === "signin"
            ? "Successfully signed in!"
            : "Account created successfully!"
        );
        // You might handle redirection or token storage here
        if (authMode == "signin") {
          navigaion("/");
        } else {
          setAuthMode("signup");
        }
      } catch (error) {
        // Handle different error types
        if (error) {
          if (error.details) {
            setErrors((prev) => ({ ...prev, ...error.details }));
          } else if (error.error) {
            toast.error(error.error);
          }
        } else {
          console.log(error.message, "erro is");
          toast.error("Unable to login please try again later");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Switch between sign in and sign up
  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "signin" ? "signup" : "signin"));
  };

  // Get strength indicator color
  const getStrengthColor = () => {
    if (passwordStrength.score < 3) return "bg-red-500";
    if (passwordStrength.score < 5) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 border border-gray-200">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {authMode === "signin"
              ? "Sign in to your account"
              : "Create an account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {authMode === "signin"
              ? "Enter your credentials to access your account"
              : "Fill in your information to get started"}
          </p>
        </div>

        {/* Success message */}
        {authSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="ml-3 text-sm font-medium text-green-800">
              {authMode === "signin"
                ? "Successfully signed in!"
                : "Account created successfully!"}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full pl-10 pr-3 py-2 sm:text-sm rounded-md focus:outline-none text-gray-900 focus:ring-2 focus:ring-offset-2 ${
                  errors.email && touched.email
                    ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && touched.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <AlertCircle
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            {errors.email && touched.email && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {errors.email}
              </p>
            )}
          </div>

          {/* Username field (only for signup) */}
          {authMode === "signup" && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`block w-full pl-10 pr-3 py-2 sm:text-sm rounded-md focus:outline-none text-gray-900 focus:ring-2 focus:ring-offset-2 ${
                    errors.username && touched.username
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Choose a username"
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                />
                {errors.username && touched.username && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <AlertCircle
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              {errors.username && touched.username && (
                <p className="mt-2 text-sm text-red-600" id="username-error">
                  {errors.username}
                </p>
              )}
            </div>
          )}

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {authMode === "signin" && (
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  authMode === "signin" ? "current-password" : "new-password"
                }
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`block w-full pl-10 pr-10 py-2 sm:text-sm rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  errors.password && touched.password
                    ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder={
                  authMode === "signin"
                    ? "Enter your password"
                    : "Create a strong password"
                }
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && touched.password ? (
              <p className="mt-2 text-sm text-red-600" id="password-error">
                {errors.password}
              </p>
            ) : (
              authMode === "signup" &&
              formData.password && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1 flex items-center">
                    Password strength:
                    <span
                      className={`ml-1 font-medium ${
                        passwordStrength.label === "Strong"
                          ? "text-green-600"
                          : passwordStrength.label === "Medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}>
                      {passwordStrength.label}
                    </span>
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${getStrengthColor()} h-2 rounded-full transition-all duration-300`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                  {authMode === "signup" && formData.password && (
                    <ul className="mt-2 text-xs text-gray-600 space-y-1">
                      <li
                        className={`flex items-center ${
                          formData.password.length >= 8
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}>
                        <span className="mr-1">
                          {formData.password.length >= 8 ? "✓" : "○"}
                        </span>
                        At least 8 characters
                      </li>
                      <li
                        className={`flex items-center ${
                          /[A-Z]/.test(formData.password)
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}>
                        <span className="mr-1">
                          {/[A-Z]/.test(formData.password) ? "✓" : "○"}
                        </span>
                        At least one uppercase letter
                      </li>
                      <li
                        className={`flex items-center ${
                          /\d/.test(formData.password)
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}>
                        <span className="mr-1">
                          {/\d/.test(formData.password) ? "✓" : "○"}
                        </span>
                        At least one number
                      </li>
                      <li
                        className={`flex items-center ${
                          /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}>
                        <span className="mr-1">
                          {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                            ? "✓"
                            : "○"}
                        </span>
                        At least one special character
                      </li>
                    </ul>
                  )}
                </div>
              )
            )}
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150`}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {authMode === "signin"
                    ? "Signing in..."
                    : "Creating account..."}
                </>
              ) : authMode === "signin" ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>

        {/* Switch between sign in and sign up */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {authMode === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1">
              {authMode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
