import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import AssessmentResults from "@/components/AssessmentResults";
import EditProfile from "@/components/EditProfile";
import { ArrowRight, RotateCcw, Download, Calendar, User as UserIcon, Eye, Settings } from "lucide-react";
import { linkAssessmentsToUser } from "@/utils/assessmentLinker";

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
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentHistory | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [hasCurrentAssessment, setHasCurrentAssessment] = useState(false);
  const navigate = useNavigate();

  const fetchAssessments = async (userId: string, userEmail: string) => {
    try {
      console.log('Fetching assessments for user:', userId, userEmail);
      
      // First, try to link any unlinked assessments
      const linkedCount = await linkAssessmentsToUser(userId, userEmail);
      if (linkedCount > 0) {
        console.log(`Linked ${linkedCount} previous assessments to user account`);
      }
      
      // Then fetch all assessments for this user
      const { data: assessments, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching assessments:', error);
        return [];
      }

      console.log('Final assessments:', assessments);
      return assessments || [];
    } catch (error) {
      console.error('Error in fetchAssessments:', error);
      return [];
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      console.log('Current user:', session.user);
      
      if (session.user?.email) {
        const assessments = await fetchAssessments(session.user.id, session.user.email);
        setAssessmentHistory(assessments);
        setHasCurrentAssessment(assessments.length > 0);
      }
      
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
          // Re-fetch assessments when user auth state changes
          if (session.user?.email) {
            const assessments = await fetchAssessments(session.user.id, session.user.email);
            setAssessmentHistory(assessments);
            setHasCurrentAssessment(assessments.length > 0);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleTakeAssessment = () => {
    navigate("/assessment");
  };

  const handleViewDetails = (assessment: AssessmentHistory) => {
    setSelectedAssessment(assessment);
  };

  const handleBackToDashboard = () => {
    setSelectedAssessment(null);
    setShowEditProfile(false);
  };

  const handleDownloadReport = (assessmentId: string) => {
    console.log("Downloading report for assessment:", assessmentId);
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <Navigation />
        <div className="pt-20 container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              onClick={handleBackToDashboard}
              variant="outline"
              className="mb-4"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Your Assessment Results
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Completed on {new Date(selectedAssessment.completed_at).toLocaleDateString()}
            </p>
          </div>
          <AssessmentResults 
            responses={selectedAssessment.responses} 
            onRetakeTest={handleTakeAssessment}
          />
        </div>
      </div>
    );
  }

  if (showEditProfile && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <Navigation />
        <div className="pt-20 container mx-auto px-4 py-8">
          <EditProfile user={user} onBack={handleBackToDashboard} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <Navigation />
      
      <div className="pt-20 container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back{user?.user_metadata?.first_name ? `, ${user.user_metadata.first_name}` : ''}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your personality assessments and insights
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
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
                    <span>{hasCurrentAssessment ? 'View Current Assessment' : 'Take New Assessment'}</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-24 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex flex-col items-center justify-center gap-2"
                    onClick={() => navigate("/assessment")}
                  >
                    <RotateCcw className="w-6 h-6" />
                    <span>Retake Assessment</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Assessment History */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Calendar className="w-5 h-5" />
                  Your Assessment History ({assessmentHistory.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No assessments yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
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
                      <div key={assessment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge className="text-lg px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                              {assessment.mbti_type}
                            </Badge>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                INTRA16 Assessment
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Completed on {new Date(assessment.completed_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadReport(assessment.id)}
                              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(assessment)}
                              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
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
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-gray-100">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Verification Status</label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {user?.email_confirmed_at ? (
                      <span className="text-green-600 dark:text-green-400">✓ Verified</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">⚠ Unverified</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Member since</label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={handleEditProfile}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  📚 Assessment Guide
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  💬 Contact Support
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
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
