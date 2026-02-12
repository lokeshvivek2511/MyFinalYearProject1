import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { questionAPI } from '../../api/question';
import { Wheat, FileText, MessageSquare, User, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await questionAPI.getQuestions();
      const allQuestions = response.data;

      setStats({
        totalQuestions: allQuestions.length,
        userQuestions: user?.questionsAsked || 0,
        userAnswers: user?.answersGiven || 0,
        trendingQuestions: allQuestions.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Here's your dashboard overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.totalQuestions || 0}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-green-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Questions</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.userQuestions || 0}</p>
              </div>
              <User className="w-10 h-10 text-green-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Answers</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.userAnswers || 0}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/crop">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Wheat className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Crop Recommendation</h3>
                    <p className="text-sm text-gray-600">Get crop suggestions</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/schemes">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Government Schemes</h3>
                    <p className="text-sm text-gray-600">Find eligible schemes</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/community">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Community</h3>
                    <p className="text-sm text-gray-600">Ask questions, get answers</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {stats?.trendingQuestions && stats.trendingQuestions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Trending Questions</h2>
            <Card>
              <div className="space-y-4">
                {stats.trendingQuestions.map((question) => (
                  <div key={question._id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <Link to="/community" className="hover:text-green-600">
                      <h3 className="font-medium">{question.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {question.answersCount} answers • Asked by {question.askedBy?.name || 'Anonymous'}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
