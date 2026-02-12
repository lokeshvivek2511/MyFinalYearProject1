import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { adminAPI } from '../../api/admin';
import axios from '../../api/axios';
import { LogOut, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [pendingExperts, setPendingExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminLoggedIn');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    fetchPendingExperts();
  }, [navigate]);

  const fetchPendingExperts = async () => {
    try {
      const response = await axios.get('/users');
      const users = response.data || [];
      const pending = users.filter(u => u.role === 'expert' && !u.isExpertApproved);
      setPendingExperts(pending);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await adminAPI.approveExpert(userId);
      setPendingExperts(pendingExperts.filter(u => u._id !== userId));
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
      <nav className="bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Expert Approval Requests</h2>
          <p className="text-gray-600">
            Review and approve users who have requested expert status
          </p>
        </div>

        {pendingExperts.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-gray-600">No pending expert approvals</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingExperts.map((user) => (
              <Card key={user._id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{user.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p>Phone: {user.phone}</p>
                        <p>State: {user.region?.state || 'N/A'}</p>
                        <p>District: {user.region?.district || 'N/A'}</p>
                      </div>
                      <div>
                        <p>Age: {user.background?.age || 'N/A'}</p>
                        <p>Land Holding: {user.background?.landHolding || 'N/A'} hectares</p>
                        <p>Farmer Type: {user.background?.farmerType || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <span>Questions: {user.questionsAsked || 0}</span>
                      <span>Answers: {user.answersGiven || 0}</span>
                      <span>Reputation: {user.reputation || 0}</span>
                    </div>
                  </div>

                  <Button onClick={() => handleApprove(user._id)}>
                    Approve as Expert
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
