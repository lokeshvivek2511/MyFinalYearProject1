import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    applyAsExpert: false,
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        phone: formData.phone,
        password: formData.password,
        role: formData.applyAsExpert ? 'expert' : 'farmer',
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

      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s === step
                      ? 'bg-green-600 text-white'
                      : s < step
                      ? 'bg-green-200 text-green-700'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className="w-12 h-1 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Authentication Details</h2>

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="applyAsExpert"
                name="applyAsExpert"
                checked={formData.applyAsExpert}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="applyAsExpert" className="text-sm text-gray-700">
                Apply as Expert (requires admin approval)
              </label>
            </div>

            <Button type="submit" className="w-full">
              Next
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="State"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />

              <Input
                label="District"
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              />

              <Input
                label="Village"
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex space-x-4">
              <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Next
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Background Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />

              <Input
                label="Land Holding (hectares)"
                type="number"
                step="0.01"
                name="landHolding"
                value={formData.landHolding}
                onChange={handleChange}
                required
              />

              <Input
                label="Annual Income"
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                Back
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>
        )}

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline">
            Login here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
