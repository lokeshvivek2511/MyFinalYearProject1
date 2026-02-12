import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { questionAPI } from '../../api/question';
import { Wheat, FileText, MessageSquare, User, TrendingUp, Award, Zap, Calendar, Clock } from 'lucide-react';

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
      const userQuestions = allQuestions.filter(q => q.askedBy?._id === user?._id);

      setStats({
        totalQuestions: allQuestions.length,
        userQuestions: userQuestions.length,
        userAnswers: user?.answersGiven || 0,
        reputation: user?.reputation || 0,
        role: user?.role || 'farmer',
        trendingQuestions: allQuestions.slice(0, 4),
        recentQuestions: userQuestions.slice(0, 3),
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
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600 mt-2">
                {user?.region?.state && `${user.region.state} • `}
                {user?.background?.farmerType ? user.background.farmerType.charAt(0).toUpperCase() + user.background.farmerType.slice(1) : ''} Farmer
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-600">{user?.reputation || 0}</div>
              <p className="text-sm text-gray-600">Reputation Points</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<MessageSquare className="w-8 h-8" />}
            label="Total Questions"
            value={stats?.totalQuestions || 0}
            color="blue"
          />
          <StatCard
            icon={<User className="w-8 h-8" />}
            label="My Questions"
            value={stats?.userQuestions || 0}
            color="purple"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="My Answers"
            value={stats?.userAnswers || 0}
            color="orange"
          />
          <StatCard
            icon={<Award className="w-8 h-8" />}
            label={user?.role === 'expert' ? 'Expert' : 'Farmer'}
            value={user?.role === 'expert' ? '✓' : '-'}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span>Quick Actions</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActionButton
                  to="/crop"
                  icon={<Wheat className="w-6 h-6" />}
                  label="Crop Recommendation"
                  description="Get crop suggestions"
                />
                <QuickActionButton
                  to="/schemes"
                  icon={<FileText className="w-6 h-6" />}
                  label="Government Schemes"
                  description="Find eligible schemes"
                />
                <QuickActionButton
                  to="/community"
                  icon={<MessageSquare className="w-6 h-6" />}
                  label="Community Q&A"
                  description="Ask or answer questions"
                />
                <QuickActionButton
                  to="/profile"
                  icon={<User className="w-6 h-6" />}
                  label="My Profile"
                  description="Update your information"
                />
              </div>
            </Card>

            {stats?.recentQuestions && stats.recentQuestions.length > 0 && (
              <Card>
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>Your Recent Questions</span>
                </h2>
                <div className="space-y-3">
                  {stats.recentQuestions.map((question) => (
                    <div key={question._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{question.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600">{question.answersCount} answers</span>
                        <Link to="/community" className="text-xs text-green-600 hover:underline">
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Trending Questions</span>
              </h2>
              <div className="space-y-3">
                {stats?.trendingQuestions && stats.trendingQuestions.length > 0 ? (
                  stats.trendingQuestions.map((question, idx) => (
                    <Link key={question._id} to="/community">
                      <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-start space-x-2">
                          <span className="font-bold text-green-600 text-sm min-w-fit">#{idx + 1}</span>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 text-sm line-clamp-2">{question.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{question.answersCount} answers</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No trending questions yet</p>
                )}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <h3 className="font-bold text-green-900 mb-3 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Quick Tips</span>
              </h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>✓ Fill in your district for accurate weather data</p>
                <p>✓ Ask detailed questions to get better answers</p>
                <p>✓ Help other farmers in the community</p>
                <p>✓ Check government schemes regularly</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    green: 'bg-green-50 text-green-600 border-green-200',
  };

  return (
    <Card className={`border ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-white ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

const QuickActionButton = ({ to, icon, label, description }) => {
  return (
    <Link to={to}>
      <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 rounded-lg text-green-600">
            {icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;
