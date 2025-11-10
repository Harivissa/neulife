import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Shield, Zap, Heart, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card-tinted to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">New Life</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Privacy-First Healthcare</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Your Health Journey,
            <br />
            One Secure Card
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get your unique Health Card ID and access AI-powered medical triage. 
            Track your health events, consult with confidence, and keep your medical 
            history in one secure place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-lg px-8"
              onClick={() => navigate("/auth")}
            >
              Request Health Card
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 border-primary/30"
              onClick={() => navigate("/triage")}
            >
              Try AI Triage
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-3">Comprehensive Healthcare Management</h3>
          <p className="text-muted-foreground text-lg">Everything you need for modern healthcare</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Unique Health Card</h4>
            <p className="text-muted-foreground">
              Get your personal Health Card ID with format HC-COUNTRY-DATE-CODE. 
              Secure, verifiable, and government-ready.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-secondary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">AI Medical Triage</h4>
            <p className="text-muted-foreground">
              Evidence-based triage for human and animal health. Get instant 
              guidance on symptoms with confidence scores and action plans.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Privacy & Consent</h4>
            <p className="text-muted-foreground">
              Full control over your data with explicit consent management. 
              Encrypted storage and transparent data usage policies.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Health Event Tracking</h4>
            <p className="text-muted-foreground">
              Log symptoms, lab reports, and medical visits. Build a complete 
              longitudinal health record linked to your card.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Multi-Species Support</h4>
            <p className="text-muted-foreground">
              Not just humans - get triage for your pets and livestock too. 
              Species-aware clinical reasoning for animals.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-border/50">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Multilingual</h4>
            <p className="text-muted-foreground">
              Accessible healthcare in your language. Support for voice input 
              and text-to-speech in multiple languages.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Secure Your Health Journey?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands who trust HealthID for their medical records. 
              Get your unique Health Card in under 2 minutes.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 text-lg px-10"
              onClick={() => navigate("/auth")}
            >
              Create Your Health Card Now
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 HealthID. Privacy-first healthcare for everyone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;