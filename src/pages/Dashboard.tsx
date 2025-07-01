
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import { ArrowRight, RotateCcw, Download, Calendar, User as UserIcon } from "lucide-react";

interface AssessmentHistory {
  id: string;
  completed_at: string;
  mbti_type: string;
  responses: any;
  email: string;
  user_id: string;
  results_sent: boolean;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      
      // Fetch assessment history for the authenticated user
      if (session.user?.email) {
        try {
          const { data: assessments, error } = await supabase
            .from('assessments')
            .select('*')
            .eq('email', session.user.email)
            .order('completed_at', { ascending: false });

          if (error) {
            console.error('Error fetching assessments:', error);
          } else {
            console.log('Fetched assessments:', assessments);
            setAssessmentHistory(assessments || []);
          }
        } catch (error) {
          console.error('Error fetching assessment history:', error);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleTakeAssessment = () => {
    navigate("/assessment");
  };

  const handleDownloadReport = (assessmentId: string) => {
    // Implementation for downloading specific report
    console.log("Downloading report for assessment:", assessmentId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20 container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back{user?.user_metadata?.first_name ? `, ${user.user_metadata.first_name}` : ''}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your personality assessments and insights
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleTakeAssessment}
                    className="h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-2"
                  >
                    <span className="text-2xl">📋</span>
                    <span>Take New Assessment</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-24 border-gray-300 hover:bg-gray-50 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate("/assessment")}
                  >
                    <RotateCcw className="w-6 h-6" />
                    <span>Retake Assessment</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Assessment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Your Assessment History ({assessmentHistory.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No assessments yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Take your first INTRA16 personality assessment to get started
                    </p>
                    <Button onClick={handleTakeAssessment} className="bg-blue-600 hover:bg-blue-700">
                      Start Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assessmentHistory.map((assessment) => (
                      <div key={assessment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge className="text-lg px-3 py-1 bg-blue-100 text-blue-800">
                              {assessment.mbti_type}
                            </Badge>
                            <div>
                              <p className="font-medium text-gray-900">
                                INTRA16 Assessment
                              </p>
                              <p className="text-sm text-gray-600">
                                Completed on {new Date(assessment.completed_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadReport(assessment.id)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            <Button variant="ghost" size="sm">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Verification Status</label>
                  <p className="text-gray-900">
                    {user?.email_confirmed_at ? (
                      <span className="text-green-600">✓ Verified</span>
                    ) : (
                      <span className="text-red-600">⚠ Unverified</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Member since</label>
                  <p className="text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  📚 Assessment Guide
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  💬 Contact Support
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  🔒 Privacy Policy
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
