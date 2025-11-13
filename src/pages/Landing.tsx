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
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 backdrop-blur-sm border border-primary/20">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <p className="text-sm font-medium text-foreground">{t('forYourHealth') || 'AI-Powered Healthcare'}</p>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                <span className="text-foreground">Smart</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Healthcare
                </span>
                <br />
                <span className="text-foreground">For All</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Get instant medical triage, personalized insights, and comprehensive care—powered by AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate("/triage")}
              >
                <Play className="h-5 w-5 mr-2 fill-current" />
                {t('startTriage')}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-2"
                onClick={() => navigate("/auth")}
              >
                {t('learnMore')}
              </Button>
            </div>
          </div>

          {/* Right Graphic */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Animated gradient orbs */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl animate-pulse" />
              <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-primary to-secondary animate-spin-slow" style={{ animationDuration: '20s' }} />
              
              {/* Center content */}
              <div className="absolute inset-20 rounded-full bg-background/95 backdrop-blur-xl border-2 border-primary/20 shadow-2xl flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
                  <p className="text-sm font-bold text-foreground">AI Health</p>
                  <p className="text-xs text-muted-foreground">24/7 Available</p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-primary/20 backdrop-blur-sm animate-bounce" style={{ animationDuration: '3s' }} />
              <div className="absolute bottom-0 left-0 h-12 w-12 rounded-full bg-secondary/20 backdrop-blur-sm animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16 border-y border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center space-y-3">
            <p className="text-4xl md:text-5xl font-bold text-primary">{t('stat1Title')}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('stat1Desc')}</p>
          </div>
          <div className="text-center space-y-3">
            <p className="text-4xl md:text-5xl font-bold text-secondary">{t('stat2Title')}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('stat2Desc')}</p>
          </div>
          <div className="text-center space-y-3">
            <p className="text-4xl md:text-5xl font-bold text-accent">{t('stat3Title')}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('stat3Desc')}</p>
          </div>
          <div className="text-center space-y-3">
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t('stat4Title')}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('stat4Desc')}</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20 md:py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {t('featuresTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('featuresSubtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Blue Card - AI Triage */}
          <Card className="relative overflow-hidden bg-primary border-0 p-8 group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs text-primary-foreground/90 tracking-widest uppercase font-semibold">AI-Powered</p>
                  <div className="h-1 w-12 bg-primary-foreground rounded-full" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 shadow-lg" />
                  <span className="text-6xl font-black text-primary-foreground">24/7</span>
                </div>
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/60 opacity-70" />
                  <div className="h-8 w-8 rounded-lg bg-primary-foreground/30" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-bold text-primary-foreground">{t('aiTriageTitle')}</p>
                <p className="text-sm text-primary-foreground/90 font-medium leading-relaxed">
                  {t('aiTriageDescription')}
                </p>
              </div>
            </div>
            
            <div className="absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-primary-foreground/10 blur-2xl" />
          </Card>

          {/* Yellow Card - Smart Diagnosis */}
          <Card className="relative overflow-hidden bg-accent border-0 p-8 group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-3xl text-accent-foreground font-black leading-tight">
                  {t('smartHealthTitle')}
                </p>
              </div>

              {/* Gradient Arc */}
              <div className="relative h-28 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-[12px] border-accent-foreground/10 border-t-secondary border-l-primary shadow-inner" />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-accent-foreground/90 font-medium leading-relaxed">
                  {t('smartHealthDescription')}
                </p>
              </div>
            </div>
          </Card>

          {/* White Card - Secure Care */}
          <Card className="relative overflow-hidden bg-card-elevated border-2 border-border/50 p-8 group hover:scale-[1.02] hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative h-36 w-36">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-muted via-foreground/10 to-muted shadow-lg" />
                </div>
              </div>

              <div className="space-y-3 text-center">
                <p className="text-3xl font-black text-foreground">{t('secureDataTitle')}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('secureDataDescription')}
                </p>
              </div>
            </div>

            <div className="absolute top-6 right-6">
              <Sparkles className="h-10 w-10 text-primary/40 group-hover:text-primary transition-colors" />
            </div>
          </Card>
        </div>

      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <Card className="max-w-5xl mx-auto p-12 md:p-16 bg-gradient-to-br from-primary to-secondary border-0 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
          <div className="relative text-center space-y-8">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              {t('cta.title')}
            </h3>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium">
              {t('cta.description')}
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-12 py-6 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              onClick={() => navigate("/auth")}
            >
              {t('cta.button')}
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/10 py-8 mt-16">
        <div className="container mx-auto px-6 text-center space-y-2">
          <p className="text-muted-foreground text-sm">
            © 2025 NeuLife. {t('footerText')}
          </p>
          <p className="text-muted-foreground text-xs">
            {t('footerCredit')}
          </p>
        </div>
      </footer>

      <VoiceAssistant />
    </div>
  );
};

export default Landing;