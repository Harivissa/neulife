import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Shield, Users, FileText, CheckCircle, XCircle, Activity, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/layout/Footer";

const Admin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCards: 0,
    pendingCards: 0,
    assessments: 0,
  });
  const [pendingCards, setPendingCards] = useState<any[]>([]);
  const [allAssessments, setAllAssessments] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'assessments' | 'contacts'>('pending');

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roles) {
        toast.error("Access denied: Admin only");
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await fetchStats();
      await fetchPendingCards();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to verify admin access");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: cardCount } = await supabase
      .from("health_cards")
      .select("*", { count: "exact", head: true });

    const { count: pendingCount } = await supabase
      .from("health_cards")
      .select("*", { count: "exact", head: true })
      .eq("status", "provisional");

    const { count: assessmentCount } = await supabase
      .from("assessments" as any)
      .select("*", { count: "exact", head: true });

    setStats({
      totalUsers: userCount || 0,
      totalCards: cardCount || 0,
      pendingCards: pendingCount || 0,
      assessments: assessmentCount || 0,
    });
  };

  const fetchPendingCards = async () => {
    const { data } = await supabase
      .from("health_cards")
      .select(`
        *,
        profiles (name, email, mobile)
      `)
      .eq("status", "provisional")
      .order("created_at", { ascending: false });

    setPendingCards(data || []);
  };

  const fetchAllAssessments = async () => {
    const { data } = await supabase
      .from("assessments" as any)
      .select(`
        *,
        profiles:user_id (name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    setAllAssessments(data || []);
  };

  const handleApprove = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from("health_cards")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("id", cardId);

      if (error) throw error;

      toast.success("Health card approved");
      await fetchStats();
      await fetchPendingCards();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve card");
    }
  };

  const handleReject = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from("health_cards")
        .update({ status: "revoked" })
        .eq("id", cardId);

      if (error) throw error;

      toast.success("Health card rejected");
      await fetchStats();
      await fetchPendingCards();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject card");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card-tinted to-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">NeuLife Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t('adminDashboard')}</h2>
            <p className="text-muted-foreground">Manage health cards and user verifications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('totalUsers')}</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-10 w-10 text-primary opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('totalHealthCards')}</p>
                  <p className="text-3xl font-bold">{stats.totalCards}</p>
                </div>
                <FileText className="h-10 w-10 text-secondary opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('pendingVerifications')}</p>
                  <p className="text-3xl font-bold">{stats.pendingCards}</p>
                </div>
                <Shield className="h-10 w-10 text-accent opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Assessments</p>
                  <p className="text-3xl font-bold">{stats.assessments}</p>
                </div>
                <Activity className="h-10 w-10 text-secondary opacity-20" />
              </div>
            </Card>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-4">
            <Button
              variant={!showAssessments ? "default" : "outline"}
              onClick={() => setShowAssessments(false)}
            >
              Pending Verifications
            </Button>
            <Button
              variant={showAssessments ? "default" : "outline"}
              onClick={() => {
                setShowAssessments(true);
                fetchAllAssessments();
              }}
            >
              All Assessments
            </Button>
          </div>

          {/* Pending Verifications Table */}
          {!showAssessments ? (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">{t('pendingVerifications')}</h3>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>HCID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-mono text-sm">{card.hcid}</TableCell>
                      <TableCell>{card.profiles?.name || "-"}</TableCell>
                      <TableCell>{card.profiles?.email || "-"}</TableCell>
                      <TableCell>{card.profiles?.mobile || "-"}</TableCell>
                      <TableCell>{new Date(card.issued_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-secondary border-secondary/30 hover:bg-secondary/10"
                            onClick={() => handleApprove(card.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {t('approveCard')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => handleReject(card.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {t('rejectCard')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendingCards.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No pending verifications
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">All Assessments</h2>
              {allAssessments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No assessments found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Symptoms</TableHead>
                        <TableHead>Triage Level</TableHead>
                        <TableHead>Confidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allAssessments.map((assessment) => (
                        <TableRow key={assessment.id}>
                          <TableCell>{new Date(assessment.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{assessment.profiles?.name}</p>
                              <p className="text-sm text-muted-foreground">{assessment.profiles?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{assessment.input_data?.symptoms || "N/A"}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                              {assessment.triage_level || "unknown"}
                            </span>
                          </TableCell>
                          <TableCell>{assessment.confidence || "N/A"}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;