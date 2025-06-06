
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { SimpleLoadingScreen } from "@/components/auth/SimpleLoadingScreen";
import FeaturesShowcase from "@/components/auth/FeaturesShowcase";
import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setIsSubmitting(true);
    try {
      await signUp(email, password, fullName);
      toast.success("Account created! You can now sign in.");
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <SimpleLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <FeaturesShowcase />
          <AuthForm 
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
