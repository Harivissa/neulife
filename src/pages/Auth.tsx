import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Loader2, ArrowLeft, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/layout/Footer";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Get the return URL from state or default to /app
  const from = (location.state as any)?.from?.pathname || "/app";

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          throw error;
        }
        return;
      }

      if (data.user) {
        toast.success("Account created successfully! Welcome to NEULIFE.");
        navigate("/app");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          throw error;
        }
        return;
      }

      if (data.user) {
        toast.success("Welcome back to NEULIFE!");
        navigate(from);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      setResetEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card-tinted to-background flex items-center justify-center p-4">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector />
        </div>
        
        <Card className="w-full max-w-md p-8 border-border/50 shadow-lg">
          <Button
            variant="ghost"
            className="mb-6 -ml-2"
            onClick={() => {
              setShowForgotPassword(false);
              setResetEmailSent(false);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Heart className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">NeuLife</h1>
          </div>

          {resetEmailSent ? (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">Check Your Email</h2>
              <p className="text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and follow the instructions.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmailSent(false);
                }}
              >
                Return to Sign In
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card-tinted to-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSelector />
      </div>
      
      <Card className="w-full max-w-md p-8 border-border/50 shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Heart className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">NEULIFE</h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{t('welcomeAuth')}</h2>
          <p className="text-muted-foreground">{t('signInAccess')}</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">{t('signIn')}</TabsTrigger>
            <TabsTrigger value="signup">{t('signUp')}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">{t('email')}</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="signin-password">{t('password')}</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('signingIn')}
                  </>
                ) : (
                  t('signIn')
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{t('fullName')}</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">{t('email')}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">{t('password')}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('creatingAccount')}
                  </>
                ) : (
                  t('createAccount')
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            {t('backToHome')}
          </Button>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy. 
            Your health data is stored securely.
          </p>
        </div>
      </Card>
      <Footer />
    </div>
  );
};

export default Auth;
