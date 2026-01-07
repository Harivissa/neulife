import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, Menu, Sparkles, Thermometer, Heart, Activity, Droplets, 
  Wind, Brain, Upload, FileText, TrendingUp, Users, Shield, 
  Stethoscope, AlertTriangle, CheckCircle2, Clock, Zap, Globe,
  Building2, Phone, ArrowRight, ChevronRight, Mail, MapPin, 
  Calendar, QrCode, UserCheck
} from "lucide-react";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/AuthModal";
import founderHari from "@/assets/founder-hari.png";
import founderMichelle from "@/assets/founder-michelle.png";

// Animation variants for scroll reveal
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Section wrapper with scroll animation
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // Demo scanner states
  const [temperature, setTemperature] = useState([98.6]);
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [spo2, setSpo2] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    const fetchUserAndGenerateQR = async (session: any) => {
      if (session?.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', session.user.id)
          .single();
        
        const userName = profile?.name || session.user.email?.split('@')[0] || 'User';
        const userEmail = profile?.email || session.user.email || '';
        setUserProfile({ name: userName, email: userEmail });

        // Generate QR code
        const qrData = JSON.stringify({
          platform: "NeuLife",
          verified: true,
          name: userName,
          email: userEmail,
          role: "User",
          message: "Verified NeuLife Digital Profile"
        });
        
        try {
          const qrUrl = await QRCode.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' }
          });
          setQrCodeUrl(qrUrl);
        } catch (err) {
          console.error('QR generation error:', err);
        }
      } else {
        setUserProfile(null);
        setQrCodeUrl("");
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      fetchUserAndGenerateQR(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      fetchUserAndGenerateQR(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/app/health-check");
    } else {
      setShowAuthModal(true);
    }
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 97) return { status: "Low", color: "bg-blue-500" };
    if (temp <= 99) return { status: "Normal", color: "bg-green-500" };
    if (temp <= 100.4) return { status: "Mild Fever", color: "bg-yellow-500" };
    return { status: "High Fever", color: "bg-red-500" };
  };

  const tempStatus = getTemperatureStatus(temperature[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/10">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">NeuLife</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* QR Code for logged-in users */}
            {isAuthenticated && qrCodeUrl && (
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                  <QrCode className="h-5 w-5 text-primary" />
                </button>
                <div className="absolute right-0 top-full mt-2 p-4 bg-card border border-border rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50 min-w-[220px]">
                  <div className="text-center space-y-3">
                    <div className="p-2 bg-white rounded-lg inline-block shadow-inner">
                      <img src={qrCodeUrl} alt="Digital Health ID" className="w-32 h-32" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-foreground flex items-center justify-center gap-1">
                        <UserCheck className="h-3 w-3 text-green-500" />
                        {userProfile?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">NeuLife Digital Profile</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Scan to View Profile</p>
                  </div>
                </div>
              </div>
            )}
            <ThemeToggle />
            <LanguageSelector />
            <button className="md:hidden">
              <Menu className="h-6 w-6 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="rounded-full px-4 py-2 border-primary/30 bg-primary/5">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse mr-2" />
                AI-Powered Healthcare Platform
              </Badge>
            </motion.div>
            
            <motion.div className="space-y-6" variants={fadeInUp}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Your First Digital
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Health Check
                </span>
                <br />
                Starts Here
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                NeuLife combines smart health scanning and AI-driven analysis to help people
                understand their health early and take the right next step.
              </p>
            </motion.div>

            <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 shadow-lg hover:shadow-xl transition-all group"
                onClick={handleGetStarted}
              >
                <Stethoscope className="h-5 w-5 mr-2" />
                Start Smart Health Scan
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-2"
                onClick={() => navigate("/app/report")}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Medical Report
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl animate-pulse" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 animate-spin" style={{ animationDuration: '30s' }} />
              
              <div className="absolute inset-16 rounded-full bg-background/95 backdrop-blur-xl border-2 border-primary/20 shadow-2xl flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="relative">
                    <Heart className="h-16 w-16 mx-auto text-primary animate-pulse" />
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 animate-ping" />
                  </div>
                  <p className="text-lg font-bold text-foreground">AI Health</p>
                  <p className="text-xs text-muted-foreground">Instant Analysis</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: SMART TRIAGE & DIGITAL SCANNING MACHINES */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 space-y-4">
            <Badge variant="secondary" className="rounded-full px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Interactive Demo
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Smart Triage & Digital Scanning
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience our medical scanning panel that simulates real diagnostic devices
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Temperature Scanner */}
            <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Thermometer className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Body Temperature</h3>
                  <p className="text-xs text-muted-foreground">Digital Thermometer</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-foreground">{temperature[0].toFixed(1)}</span>
                  <span className="text-lg text-muted-foreground ml-1">°F</span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={95}
                  max={105}
                  step={0.1}
                  className="my-4"
                />
                <Badge className={`${tempStatus.color} text-white w-full justify-center`}>
                  {tempStatus.status}
                </Badge>
              </div>
            </Card>

            {/* Blood Pressure */}
            <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Blood Pressure</h3>
                  <p className="text-xs text-muted-foreground">BP Monitor</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Systolic</label>
                    <Input 
                      type="number" 
                      placeholder="120" 
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      className="text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Diastolic</label>
                    <Input 
                      type="number" 
                      placeholder="80" 
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      className="text-center font-bold"
                    />
                  </div>
                </div>
                <div className="h-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 relative">
                  <div className="absolute inset-y-0 left-1/3 w-0.5 bg-white/50" />
                  <div className="absolute inset-y-0 left-2/3 w-0.5 bg-white/50" />
                </div>
                <p className="text-xs text-center text-muted-foreground">Low | Normal | High</p>
              </div>
            </Card>

            {/* Heart Rate & SpO2 */}
            <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-pink-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Pulse & SpO₂</h3>
                  <p className="text-xs text-muted-foreground">Pulse Oximeter</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <label className="text-xs text-muted-foreground">Heart Rate</label>
                  <Input 
                    type="number" 
                    placeholder="72" 
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="text-center font-bold"
                  />
                  <span className="text-xs text-muted-foreground">BPM</span>
                </div>
                <div className="text-center">
                  <label className="text-xs text-muted-foreground">SpO₂</label>
                  <Input 
                    type="number" 
                    placeholder="98" 
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="text-center font-bold"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
            </Card>

            {/* Blood Sugar */}
            <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Droplets className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Blood Sugar</h3>
                  <p className="text-xs text-muted-foreground">Glucose Monitor</p>
                </div>
              </div>
              <div className="space-y-3">
                <Input 
                  type="number" 
                  placeholder="100" 
                  value={bloodSugar}
                  onChange={(e) => setBloodSugar(e.target.value)}
                  className="text-center font-bold text-xl"
                />
                <p className="text-xs text-center text-muted-foreground">mg/dL</p>
                <p className="text-xs text-center text-muted-foreground">
                  Fasting: 70-100 | Post-meal: &lt;140
                </p>
              </div>
            </Card>

            {/* Respiratory Rate */}
            <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Wind className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Respiratory Rate</h3>
                  <p className="text-xs text-muted-foreground">Breath Monitor</p>
                </div>
              </div>
              <div className="space-y-3">
                <Input 
                  type="number" 
                  placeholder="16" 
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(e.target.value)}
                  className="text-center font-bold text-xl"
                />
                <p className="text-xs text-center text-muted-foreground">breaths/min</p>
                <p className="text-xs text-center text-muted-foreground">
                  Normal: 12-20 breaths/min
                </p>
              </div>
            </Card>

            {/* Symptom Selector CTA */}
            <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white border-0 hover:shadow-lg transition-shadow flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Full Health Scan</h3>
                  <p className="text-xs text-white/80">Complete Analysis</p>
                </div>
              </div>
              <p className="text-sm text-white/90 mb-4">
                Access all scanners, symptom selector, image upload, and AI-powered triage.
              </p>
              <Button 
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
                onClick={handleGetStarted}
              >
                Analyze My Health
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 3: AI HEALTH ANALYSIS ENGINE */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="outline" className="rounded-full px-4 py-2 border-primary/30">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered Analysis
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Intelligent Health Analysis Engine
            </h2>
            <p className="text-lg text-muted-foreground">
              Our AI analyzes vitals, symptoms, uploaded images, and profile data to provide
              clear, actionable health insights in plain language.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400">🟢 Green - Safe</h4>
                  <p className="text-sm text-muted-foreground">Home care guidance and self-management tips</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <Clock className="h-6 w-6 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-400">🟡 Yellow - Monitor</h4>
                  <p className="text-sm text-muted-foreground">Watch closely, recheck recommended</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-700 dark:text-red-400">🔴 Red - Urgent</h4>
                  <p className="text-sm text-muted-foreground">Immediate medical attention advised</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8 bg-card border-border/50 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">AI Analysis Features</h3>
                  <p className="text-sm text-muted-foreground">What our engine provides</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  "Risk level indicator with visual cues",
                  "Clear explanations in simple language",
                  "Recommended next steps",
                  "Urgency warnings for critical cases",
                  "Personalized insights based on profile",
                  "Historical trend analysis"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={handleGetStarted}>
                Try AI Analysis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 4: MEDICAL REPORT SCANNING */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Card className="p-8 bg-card border-border/50 shadow-xl order-2 lg:order-1">
              <div className="space-y-6">
                <div className="h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-muted/30">
                  <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">Drop PDF or Image</p>
                  <p className="text-xs text-muted-foreground">Medical reports, lab results, prescriptions</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">blood_report_2024.pdf</span>
                    <Badge variant="secondary" className="ml-auto text-xs">Analyzed</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">xray_chest.jpg</span>
                    <Badge variant="secondary" className="ml-auto text-xs">Processing</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-6 order-1 lg:order-2">
              <Badge variant="outline" className="rounded-full px-4 py-2 border-primary/30">
                <FileText className="h-4 w-4 mr-2" />
                Report Intelligence
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Medical Report Scanning
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload medical reports (PDF or image) and let AI extract, analyze, 
                and summarize key findings in easy-to-understand language.
              </p>
              <ul className="space-y-3">
                {[
                  "Extract key values (BP, sugar, cholesterol, etc.)",
                  "Highlight abnormal readings automatically",
                  "Summarize reports in layman language",
                  "Correlate with current scan results"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" onClick={() => navigate("/app/report")}>
                Upload Report
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HEALTH HISTORY & TRENDS */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="rounded-full px-4 py-2 border-primary/30">
            <TrendingUp className="h-4 w-4 mr-2" />
            Health Tracking
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Health History & Trends
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your health journey with comprehensive history, trends, and intelligent alerts
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Past Health Scans</h3>
            <p className="text-sm text-muted-foreground">
              Review all previous scans and readings in one timeline
            </p>
          </Card>

          <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow text-center">
            <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Trend Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Visual graphs showing your health metrics over time
            </p>
          </Card>

          <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow text-center">
            <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Smart Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Get notified when conditions worsen or need attention
            </p>
          </Card>
        </div>
      </section>

      {/* SECTION 6: USER PROFILE */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="rounded-full px-4 py-2 border-primary/30">
                <Users className="h-4 w-4 mr-2" />
                Personalized Care
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Your Health Profile
              </h2>
              <p className="text-lg text-muted-foreground">
                Create a comprehensive profile so AI can personalize every recommendation
                and provide more accurate health insights.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: "Name, Age, Gender" },
                  { icon: Heart, label: "Known Conditions" },
                  { icon: AlertTriangle, label: "Allergies" },
                  { icon: Phone, label: "Emergency Contact" },
                  { icon: Building2, label: "Preferred Hospital" },
                  { icon: Shield, label: "Privacy Controls" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50">
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => navigate("/app/settings")}>
                Setup Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <Card className="p-8 bg-card border-border/50 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Sample User Profile</h3>
                    <p className="text-sm text-muted-foreground">How your profile appears</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Age</span>
                    <span className="text-sm font-medium text-foreground">32 years</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Conditions</span>
                    <span className="text-sm font-medium text-foreground">Type 2 Diabetes</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Allergies</span>
                    <span className="text-sm font-medium text-foreground">Penicillin</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-muted-foreground">Emergency</span>
                    <span className="text-sm font-medium text-foreground">+1 234 567 8900</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 7: MEET THE FOUNDERS */}
      <AnimatedSection>
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-12 space-y-4">
            <Badge variant="outline" className="rounded-full px-4 py-2 border-primary/30">
              <Users className="h-4 w-4 mr-2" />
              The Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Meet the Founders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A unique collaboration between technology and medicine
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Founder 1: Hari */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
            >
              <Card className="p-8 bg-card border-border/50 hover:shadow-xl transition-shadow text-center h-full">
                <div className="mb-6 flex justify-center">
                  {/* Square container with aspect-ratio 1:1, minimum 160px */}
                  <div className="relative w-40 h-40 md:w-44 md:h-44">
                    <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl bg-muted">
                      <img 
                        src={founderHari} 
                        alt="Hari Vissa" 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: '50% 30%' }}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">Hari Vissa</h3>
                <p className="text-sm text-primary font-medium mb-4">
                  Future Tech Engineer & AI Healthcare Developer
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Focused on building AI-powered healthcare systems that simplify diagnosis,
                  improve early intervention, and make medical guidance accessible to everyone.
                </p>
              </Card>
            </motion.div>

            {/* Founder 2: Michelle */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInRight}
            >
              <Card className="p-8 bg-card border-border/50 hover:shadow-xl transition-shadow text-center h-full">
                <div className="mb-6 flex justify-center">
                  {/* Square container with aspect-ratio 1:1, minimum 160px */}
                  <div className="relative w-40 h-40 md:w-44 md:h-44">
                    <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-secondary/20 shadow-xl bg-muted">
                      <img 
                        src={founderMichelle} 
                        alt="Michelle Manda" 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: '50% 25%' }}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">Michelle Manda</h3>
                <p className="text-sm text-secondary font-medium mb-4">
                  Medical Aspirant & Healthcare Visionary
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Driven by a passion for medicine and patient care, with a vision to combine
                  human empathy and technology to improve healthcare accessibility.
                </p>
              </Card>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* SECTION 8: FUTURE ROADMAP */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 space-y-4">
            <Badge variant="outline" className="rounded-full px-4 py-2 border-primary/30">
              <Globe className="h-4 w-4 mr-2" />
              Vision
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Future Roadmap
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our vision for transforming healthcare accessibility worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Activity,
                title: "Wearable Integration",
                description: "Connect smartwatches and health bands for real-time monitoring",
                status: "Coming Soon"
              },
              {
                icon: Building2,
                title: "Hospital Dashboards",
                description: "Partner with hospitals for seamless patient data sharing",
                status: "In Development"
              },
              {
                icon: Globe,
                title: "Rural Healthcare",
                description: "Bring digital health access to underserved rural communities",
                status: "Planned"
              },
              {
                icon: Phone,
                title: "Emergency Response",
                description: "Direct linkage with emergency services and ambulances",
                status: "Planned"
              }
            ].map((item, i) => (
              <Card key={i} className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary" className="mb-3 text-xs">{item.status}</Badge>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: CONTACT US */}
      <AnimatedSection>
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 space-y-4">
              <Badge variant="outline" className="rounded-full px-4 py-2 border-primary/30 bg-primary/5">
                <Mail className="h-4 w-4 mr-2" />
                Get In Touch
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Contact NeuLife
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Reach out for healthcare innovation, collaboration, or medical technology discussions.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Contact Info */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInLeft}
                className="space-y-6"
              >
                <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                      <p className="text-muted-foreground text-sm">contact@neulife.in</p>
                      <p className="text-xs text-muted-foreground mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Location</h3>
                      <p className="text-muted-foreground text-sm">India (Remote-first)</p>
                      <p className="text-xs text-muted-foreground mt-1">Serving globally</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Availability</h3>
                      <p className="text-muted-foreground text-sm">Open for collaboration</p>
                      <p className="text-xs text-muted-foreground mt-1">Healthcare partners welcome</p>
                    </div>
                  </div>
                </Card>

                {/* Medical theme decorative element */}
                <div className="hidden lg:flex items-center justify-center pt-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Stethoscope className="h-8 w-8 text-primary/40" />
                    <div className="h-px w-16 bg-border" />
                    <Heart className="h-6 w-6 text-secondary/40" />
                    <div className="h-px w-16 bg-border" />
                    <Shield className="h-8 w-8 text-primary/40" />
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInRight}
              >
                <Card className="p-8 bg-card border-border/50 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Send a Message</h3>
                      <p className="text-xs text-muted-foreground">We'd love to hear from you</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                      <Input 
                        placeholder="Your full name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                      <Input 
                        type="email"
                        placeholder="your@email.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                      <Textarea 
                        placeholder="Tell us about your inquiry..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="bg-background min-h-[120px] resize-none"
                      />
                    </div>
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                      onClick={() => {
                        // Demo only - show success message
                        alert('Thank you for your message! This is a demo feature.');
                        setContactName('');
                        setContactEmail('');
                        setContactMessage('');
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <Card className="max-w-4xl mx-auto p-12 md:p-16 bg-gradient-to-br from-primary to-secondary border-0 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
          <div className="relative text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Ready to Take Control of Your Health?
            </h3>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands who trust NeuLife for early health insights and smarter decisions.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 px-10 py-6 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              onClick={handleGetStarted}
            >
              Start Your Health Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/10 py-8">
        <div className="container mx-auto px-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">NeuLife</span>
          </div>
          <p className="text-muted-foreground text-sm">
            NeuLife — Bridging Technology & Healthcare
          </p>
          <p className="text-muted-foreground text-xs">
            Built by a Future Engineer & Future Doctor
          </p>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} NeuLife. All rights reserved.
          </p>
        </div>
      </footer>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onSuccess={() => navigate("/app/health-check")}
      />
      
      <VoiceAssistant />
    </div>
  );
};

export default Landing;
