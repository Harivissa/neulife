import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, LogOut, QrCode, Shield, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { Footer } from "@/components/layout/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [healthCard, setHealthCard] = useState<any>(null);
  const [qrValue, setQrValue] = useState<string>("");
  const [showCardRequest, setShowCardRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    age: "",
    sex: "",
    locale: "en-IN",
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    
    // Check if user is admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    
    setIsAdmin(!!roles);
    
    await fetchProfile(user.id);
    await fetchHealthCard(user.id);
    await fetchAssessments(user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) {
      setProfile(data);
      setFormData({
        name: data.name || "",
        mobile: data.mobile || "",
        age: data.age?.toString() || "",
        sex: data.sex || "",
        locale: data.locale || "en-IN",
      });
    }
  };

  const fetchAssessments = async (userId: string) => {
    const { data } = await supabase
      .from("assessments" as any)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    setAssessments(data || []);
  };

  const fetchHealthCard = async (userId: string) => {
    const { data } = await supabase
      .from("health_cards")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (data) {
      setHealthCard(data);
      setQrValue(data.hcid);
    }
  };

  const handleRequestCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-health-card", {
        body: {
          profileData: {
            ...formData,
            age: parseInt(formData.age),
          },
        },
      });

      if (error) throw error;

      toast.success("Health Card created successfully!");
      setShowCardRequest(false);
      await fetchHealthCard(user.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to create health card");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card-tinted to-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">NeuLife</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Admin
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/triage")}>
              <Activity className="h-4 w-4 mr-2" />
              {t('tryAITriage')}
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('signOut')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome, {profile?.name || "User"}!</h2>
            <p className="text-muted-foreground">Manage your health card and profile</p>
          </div>

          {!healthCard ? (
            <Card className="p-8 text-center border-border/50">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Health Card Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your unique Health Card to start tracking your health journey
              </p>
              <Button 
                onClick={() => setShowCardRequest(true)}
                className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
              >
                Request Health Card
              </Button>
            </Card>
          ) : (
            <Card className="p-8 border-primary/30 shadow-lg">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-bold">Your Health Card</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Health Card ID</Label>
                      <p className="text-2xl font-mono font-bold text-primary">{healthCard.hcid}</p>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`h-2 w-2 rounded-full ${
                          healthCard.status === 'verified' ? 'bg-secondary' : 'bg-accent'
                        }`} />
                        <span className="capitalize font-medium">{healthCard.status}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Issued On</Label>
                      <p className="font-medium">
                        {new Date(healthCard.issued_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {qrValue && (
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-primary/20">
                      <QRCode value={qrValue} size={192} />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      <QrCode className="h-4 w-4 mr-2" />
                      Download QR
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="p-6 border-border/50">
            <h3 className="text-xl font-bold mb-4">Profile Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{profile?.name || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Mobile</Label>
                <p className="font-medium">{profile?.mobile || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Age</Label>
                <p className="font-medium">{profile?.age || "-"}</p>
              </div>
            </div>
          </Card>

          {/* Assessment History */}
          {assessments.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Assessments</h2>
              <div className="space-y-3">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="p-4 border border-border/50 rounded-lg hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </span>
                      {assessment.triage_level && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {assessment.triage_level}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {assessment.input_data?.symptoms || "No symptoms recorded"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>

      <VoiceAssistant />

      <Dialog open={showCardRequest} onOpenChange={setShowCardRequest}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Health Card</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRequestCard} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
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
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Health Card"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Dashboard;