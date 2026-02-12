import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { adminAPI } from '../../api/admin';
import axios from '../../api/axios';
import { LogOut, CheckCircle, Users, Trophy, MessageSquare, BarChart3, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [pendingExperts, setPendingExperts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminLoggedIn');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/users');
      const users = response.data || [];

      const pending = users.filter(u => u.role === 'expert' && !u.isExpertApproved);
      const approved = users.filter(u => u.role === 'expert' && u.isExpertApproved);
      const farmers = users.filter(u => u.role === 'farmer');

      setPendingExperts(pending);
      setAllUsers(users);

      setStats({
        totalUsers: users.length,
        farmers: farmers.length,
        experts: approved.length,
        pendingExperts: pending.length,
        totalReputation: users.reduce((sum, u) => sum + (u.reputation || 0), 0),
        totalQuestions: users.reduce((sum, u) => sum + (u.questionsAsked || 0), 0),
        totalAnswers: users.reduce((sum, u) => sum + (u.answersGiven || 0), 0),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await adminAPI.approveExpert(userId);
      setPendingExperts(pendingExperts.filter(u => u._id !== userId));
      fetchData();
    } catch (error) {
      console.error('Error approving expert:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <StatBox icon={<Users className="w-8 h-8" />} label="Total Users" value={stats.totalUsers} color="blue" />
            <StatBox icon={<Trophy className="w-8 h-8" />} label="Experts Approved" value={stats.experts} color="green" />
            <StatBox icon={<Clock className="w-8 h-8" />} label="Pending Approvals" value={stats.pendingExperts} color="orange" />
            <StatBox icon={<BarChart3 className="w-8 h-8" />} label="Total Questions" value={stats.totalQuestions} color="purple" />
          </div>
        )}

        <div className="flex space-x-4 border-b bg-white rounded-lg px-6 py-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pending Approvals ({stats?.pendingExperts || 0})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Users ({stats?.totalUsers || 0})
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Expert Approval Requests</h2>
            {pendingExperts.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No pending expert approvals</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pendingExperts.map((user) => (
                  <Card key={user._id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-sm">
                            <p className="text-gray-600">Phone</p>
                            <p className="font-semibold text-gray-800">{user.phone}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Location</p>
                            <p className="font-semibold text-gray-800">
                              {user.region?.state || 'N/A'}
                            </p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Age</p>
                            <p className="font-semibold text-gray-800">{user.background?.age || 'N/A'}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Land Holding</p>
                            <p className="font-semibold text-gray-800">
                              {user.background?.landHolding || 'N/A'} ha
                            </p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Type</p>
                            <p className="font-semibold text-gray-800 capitalize">
                              {user.background?.farmerType || 'N/A'}
                            </p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">Category</p>
                            <p className="font-semibold text-gray-800">{user.background?.category || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4 border-t">
                          <span>Questions: <span className="font-bold text-gray-800">{user.questionsAsked || 0}</span></span>
                          <span>Answers: <span className="font-bold text-gray-800">{user.answersGiven || 0}</span></span>
                          <span>Reputation: <span className="font-bold text-gray-800">{user.reputation || 0}</span></span>
                        </div>
                      </div>

                      <Button onClick={() => handleApprove(user._id)} className="h-12 font-semibold">
                        Approve Expert
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Questions</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Answers</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reputation</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'expert' && user.isExpertApproved
                              ? 'bg-green-100 text-green-700'
                              : user.role === 'expert'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.role === 'expert' ? (user.isExpertApproved ? 'Expert ✓' : 'Expert (Pending)') : 'Farmer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.questionsAsked || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.answersGiven || 0}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{user.reputation || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.region?.state ? `${user.region.state}, ${user.region.district}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value, color }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  return (
    <Card className={`border ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-4xl font-bold mt-3">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-white ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default AdminDashboard;
