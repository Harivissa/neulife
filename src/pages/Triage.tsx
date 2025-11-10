import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Activity, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useTranslation } from "react-i18next";

const Triage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<string>("");
  
  const [formData, setFormData] = useState({
    symptoms: "",
    speciesType: "human",
    speciesSubtype: "",
    age: "",
    sex: "",
    severity: "5",
    onset: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symptoms.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }

    setLoading(true);
    setTriageResult("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Get HCID if user is logged in
      let hcid = null;
      if (session?.user) {
        const { data: card } = await supabase
          .from("health_cards")
          .select("hcid")
          .eq("user_id", session.user.id)
          .maybeSingle();
        hcid = card?.hcid;
      }

      const { data, error } = await supabase.functions.invoke("medical-triage", {
        body: {
          symptoms: formData.symptoms,
          speciesType: formData.speciesType,
          speciesSubtype: formData.speciesSubtype || undefined,
          age: formData.age || undefined,
          sex: formData.sex || undefined,
          severity: formData.severity || undefined,
          onset: formData.onset || undefined,
          hcid: hcid,
        },
      });

      if (error) throw error;

      if (data?.triage) {
        setTriageResult(data.triage);
        toast.success("Triage completed");
      }
    } catch (error: any) {
      if (error.message?.includes('429')) {
        toast.error("Too many requests. Please try again in a moment.");
      } else if (error.message?.includes('402')) {
        toast.error("AI credits exhausted. Please add credits to continue.");
      } else {
        toast.error(error.message || "Failed to complete triage");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card-tinted to-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">New Life</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            {t('backToHome')}
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-secondary/20 mb-4">
              <Activity className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">AI-Powered Medical Triage</span>
            </div>
            <h2 className="text-4xl font-bold mb-3">Get Evidence-Based Health Guidance</h2>
            <p className="text-muted-foreground text-lg">
              Describe your symptoms and receive AI-powered triage with confidence scores and action plans
            </p>
          </div>

          <Card className="p-6 border-border/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Describe Your Symptoms *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Example: I have fever, body ache and red rash since yesterday..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  rows={6}
                  required
                  className="resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="speciesType">Who is this for?</Label>
                  <Select 
                    value={formData.speciesType} 
                    onValueChange={(value) => setFormData({ ...formData, speciesType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="human">Human</SelectItem>
                      <SelectItem value="animal">Animal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.speciesType === "animal" && (
                  <div className="space-y-2">
                    <Label htmlFor="speciesSubtype">Animal Type</Label>
                    <Input
                      id="speciesSubtype"
                      placeholder="e.g., dog, cat, cow"
                      value={formData.speciesSubtype}
                      onChange={(e) => setFormData({ ...formData, speciesSubtype: e.target.value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    placeholder="e.g., 34 or 6m (for months)"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity (1-10)</Label>
                  <Input
                    id="severity"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="onset">Symptom Onset</Label>
                  <Input
                    id="onset"
                    placeholder="e.g., 2 days ago"
                    value={formData.onset}
                    onChange={(e) => setFormData({ ...formData, onset: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 p-4 rounded-lg bg-accent/5 border border-accent/20">
                <AlertTriangle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-accent">Important Disclaimer</p>
                  <p className="text-muted-foreground mt-1">
                    This AI triage is for guidance only and does not replace professional medical advice. 
                    For emergencies, call your local emergency number immediately.
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  "Get Triage Assessment"
                )}
              </Button>
            </form>
          </Card>

          {triageResult && (
            <Card className="p-6 border-secondary/30 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-secondary" />
                <h3 className="text-2xl font-bold">Triage Assessment</h3>
              </div>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-foreground">{triageResult}</div>
              </div>
            </Card>
          )}
        </div>
      </main>
      
      <VoiceAssistant />
    </div>
  );
};

export default Triage;