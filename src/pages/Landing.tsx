import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Menu, TrendingUp, Code, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useTranslation } from "react-i18next";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/10">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-foreground" />
              <div className="h-2 w-2 rounded-full bg-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">NeuLife</h1>
          </div>
          

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
            <button className="md:hidden">
              <Menu className="h-6 w-6 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block rounded-full bg-muted/50 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs md:text-sm text-muted-foreground">{t('forYourHealth') || 'For Your Health'}</p>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-foreground">{t('aiPowered') || 'AI-Powered'}</span>
                <br />
                <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
                  {t('healthcare') || 'Healthcare'}
                </span>
              </h1>
            </div>

            <Button 
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8"
              onClick={() => navigate("/triage")}
            >
              <Play className="h-4 w-4 mr-2 fill-current" />
              {t('startTriage') || 'Start Triage'}
            </Button>
          </div>

          {/* Right Graphic */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Gradient Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent opacity-80 blur-xl" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-secondary via-primary to-accent" />
              
              {/* Center Circle with Icon */}
              <div className="absolute inset-16 rounded-full bg-background border border-border flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-foreground" />
                  <p className="text-xs text-muted-foreground tracking-wider">AI<br />Health</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-muted-foreground">
            {t('tagline') || 'We are a'}{' '}
            <span className="text-foreground font-semibold">{t('healthPlatform') || 'Health Platform'}</span>{' '}
            {t('thatHelps') || 'That Helps'}{' '}
            <span className="text-foreground font-semibold">{t('everyone') || 'Everyone'}</span>{' '}
            {t('accessCare') || 'Access Quality Healthcare.'}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Blue Card - AI Triage */}
          <Card className="relative overflow-hidden bg-primary border-0 p-8 group hover:scale-105 transition-transform">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-primary-foreground/80 tracking-wider uppercase">AI-POWERED</p>
                  <div className="h-0.5 w-8 bg-primary-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-accent" />
                  <span className="text-5xl font-bold text-primary-foreground">24/7</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary opacity-60" />
              </div>

              <p className="text-xs text-primary-foreground/70">
                {t('aiTriageDescription') || 'Instant Medical Triage Available'}
              </p>
            </div>
            
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-primary-foreground/10" />
          </Card>

          {/* Yellow Card - Smart Diagnosis */}
          <Card className="relative overflow-hidden bg-accent border-0 p-8 group hover:scale-105 transition-transform">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-accent-foreground font-medium">{t('smartHealth') || 'Smart'} <span className="font-bold">Health</span></p>
                <p className="text-2xl text-accent-foreground font-bold">{t('accurateDiagnosis') || 'Accurate Diagnosis'}</p>
              </div>

              {/* Gradient Arc */}
              <div className="relative h-24 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-accent-foreground/20 border-t-secondary border-l-primary" />
              </div>

              <div className="space-y-1">
                <p className="text-xs text-accent-foreground/70">{t('aiAssisted') || 'AI-Assisted'}</p>
                <p className="text-xs text-accent-foreground font-semibold">{t('healthAnalysis') || 'Health Analysis'}</p>
              </div>
            </div>
          </Card>

          {/* White Card - Secure Care */}
          <Card className="relative overflow-hidden bg-card-elevated border border-border p-8 group hover:scale-105 transition-transform">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-muted via-foreground to-muted" />
                </div>
              </div>

              <div className="space-y-2 text-center">
                <p className="text-lg font-semibold text-foreground">{t('secureData') || 'Secure Data'}</p>
                <p className="text-2xl font-bold text-foreground">{t('privacyFirst') || 'Privacy First'}</p>
                <p className="text-xs text-muted-foreground">{t('encryptedStorage') || 'End-to-End Encrypted Storage'}</p>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Want to know more */}
        <div className="mt-8 flex justify-end max-w-6xl mx-auto">
          <button 
            onClick={() => navigate("/auth")}
            className="group flex flex-col items-end text-right hover:text-primary transition-colors"
          >
            <TrendingUp className="h-6 w-6 mb-2 text-muted-foreground group-hover:text-primary" />
            <p className="text-xs text-muted-foreground group-hover:text-foreground">
              {t('wantToKnowMore') || 'Want to know more'}<br />{t('aboutUs') || 'about us?'}
            </p>
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {t('ctaTitle') || 'Start Your Journey with NeuLife'}
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('ctaDescription') || 'NeuLife brings AI-powered healthcare to everyone. Get instant medical triage, accurate diagnosis, and secure care management—all in one platform.'}
            </p>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 rounded-full"
              onClick={() => navigate("/auth")}
            >
              {t('getStarted') || 'Get Started'}
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/10 py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2025 NeuLife. {t('footerText') || 'Privacy-first healthcare for everyone.'}</p>
        </div>
      </footer>

      <VoiceAssistant />
    </div>
  );
};

export default Landing;