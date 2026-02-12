import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import SelectInput from '../../components/common/SelectInput';
import Button from '../../components/common/Button';
import { cropAPI } from '../../api/crop';
import { useLocationData } from '../../hooks/useLocationData';
import { Wheat, Loader } from 'lucide-react';

const CropRecommendation = () => {
  const { user } = useAuth();
  const { states, getDistricts } = useLocationData();
  const [district, setDistrict] = useState(user?.region?.district || '');
  const [weatherLoading, setWeatherLoading] = useState(false);
  console.log('User region:', user);
  const [formData, setFormData] = useState({
    Nitrogen: '50',
    Phosphorus: '50',
    Potassium: '50',
    pH: '7',
    Temperature: '25',
    Humidity: '65',
    Rainfall: '100',
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (district) {
      fetchWeatherData();
    }
  }, [district]);

  const fetchWeatherData = async () => {
    setWeatherLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?city=${district}`
      );
      const data = await response.json();
      console.log('Weather data:', data);
      if (data) {
        setFormData(prev => ({
          ...prev,
          Temperature: data.weather.temperature,
          Humidity: data.weather.humidity,
          Rainfall: data.weather.rainfall
        }));
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        Nitrogen: parseFloat(formData.Nitrogen) || 50,
        Phosphorus: parseFloat(formData.Phosphorus) || 50,
        Potassium: parseFloat(formData.Potassium) || 50,
        pH: parseFloat(formData.pH) || 7,
        Temperature: parseFloat(formData.Temperature) || 25,
        Humidity: parseFloat(formData.Humidity) || 65,
        Rainfall: parseFloat(formData.Rainfall) || 100,
      };

      const response = await cropAPI.recommendCrop(payload);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const userState = user?.region?.state;
  const userDistricts = userState ? getDistricts(userState) : [];

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Crop Recommendation</h1>
          <p className="text-gray-600 mt-1">Get personalized crop suggestions based on your soil and weather conditions</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Weather Auto-Fill:</strong> Select your district to automatically fetch current weather data. All fields are editable.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <span>Location</span>
                {weatherLoading && <Loader className="w-4 h-4 animate-spin text-green-600" />}
              </h2>
              <SelectInput
                label="District"
                name="district"
                value={district}
                onChange={handleDistrictChange}
                options={userDistricts}
                required
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Weather Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Temperature (°C)"
                  type="number"
                  step="0.1"
                  name="Temperature"
                  value={formData.Temperature}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Humidity (%)"
                  type="number"
                  step="1"
                  name="Humidity"
                  value={formData.Humidity}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Rainfall (mm)"
                  type="number"
                  step="0.1"
                  name="Rainfall"
                  value={formData.Rainfall}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Soil Parameters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nitrogen (kg/ha)"
                  type="number"
                  step="1"
                  name="Nitrogen"
                  value={formData.Nitrogen}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Phosphorus (kg/ha)"
                  type="number"
                  step="1"
                  name="Phosphorus"
                  value={formData.Phosphorus}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Potassium (kg/ha)"
                  type="number"
                  step="1"
                  name="Potassium"
                  value={formData.Potassium}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="pH Level"
                  type="number"
                  step="0.1"
                  name="pH"
                  value={formData.pH}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading || weatherLoading} className="w-full h-12 text-lg">
              {loading ? 'Getting Recommendations...' : 'Get My Crop Recommendation'}
            </Button>
          </form>
        </Card>

        {results && (
          <Card>
            <h2 className="text-lg font-semibold mb-6">Top 3 Recommended Crops</h2>
            <div className="space-y-3">
              {results.top_3_crops?.map((crop, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg capitalize text-gray-800">{crop.crop}</h3>
                      <p className="text-sm text-gray-600">
                        Confidence Score: <span className="font-semibold text-green-600">{(crop.confidence * 100).toFixed(1)}%</span>
                      </p>
                    </div>
                  </div>
                  <Wheat className="w-10 h-10 text-green-600 flex-shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};

export default CropRecommendation;
