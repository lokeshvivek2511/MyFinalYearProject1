import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import SelectInput from '../../components/common/SelectInput';
import Button from '../../components/common/Button';
import { useLocationData } from '../../hooks/useLocationData';
import { userAPI } from '../../api/user';
import { Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { states, getDistricts } = useLocationData();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    district: '',
    village: '',
    age: '',
    landHolding: '',
    income: '',
    farmerType: '',
    category: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        state: user.region?.state || '',
        district: user.region?.district || '',
        village: user.region?.village || '',
        age: user.background?.age || '',
        landHolding: user.background?.landHolding || '',
        income: user.background?.income || '',
        farmerType: user.background?.farmerType || '',
        category: user.background?.category || '',
        gender: user.background?.gender || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        region: {
          state: formData.state,
          district: formData.district,
          village: formData.village,
        },
        background: {
          age: parseInt(formData.age),
          landHolding: parseFloat(formData.landHolding),
          income: parseFloat(formData.income),
          farmerType: formData.farmerType,
          category: formData.category,
          gender: formData.gender,
        },
      };

      const response = await userAPI.updateProfile(payload);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const stateDistricts = formData.state ? getDistricts(formData.state) : [];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal and farming information</p>
            </div>
            {!editing && (
              <Button onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={user?.phone || ''}
                  disabled
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Role</p>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                    {user?.role === 'expert' ? 'Expert' : 'Farmer'}
                  </span>
                  {user?.role === 'expert' && !user?.isExpertApproved && (
                    <span className="text-sm text-yellow-600">
                      (Pending Admin Approval)
                    </span>
                  )}
                  {user?.role === 'expert' && user?.isExpertApproved && (
                    <span className="text-sm text-green-600">
                      (Approved)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <span>Questions Asked: {user?.questionsAsked || 0}</span>
                <span>Answers Given: {user?.answersGiven || 0}</span>
                <span>Reputation: {user?.reputation || 0}</span>
              </div>
            </div>
          </Card>

          <Card className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="State"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!editing}
                required
              />
              <Input
                label="District"
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!editing}
                required
              />
              <Input
                label="Village"
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                disabled={!editing}
                required
              />
            </div>
          </Card>

          <Card className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Background Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled={!editing}
                required
              />
              <Input
                label="Land Holding (hectares)"
                type="number"
                step="0.01"
                name="landHolding"
                value={formData.landHolding}
                onChange={handleChange}
                disabled={!editing}
                required
              />
              <Input
                label="Annual Income"
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                disabled={!editing}
                required
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Farmer Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="farmerType"
                  value={formData.farmerType}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                >
                  <option value="">Select</option>
                  <option value="small">Small</option>
                  <option value="marginal">Marginal</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                >
                  <option value="">Select</option>
                  <option value="GENERAL">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>
          </Card>

          {editing && (
            <div className="flex space-x-4 mt-6">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  setError('');
                  setSuccess('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </div>
    </PageWrapper>
  );
};

export default Profile;
