import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import SelectInput from '../../components/common/SelectInput';
import Button from '../../components/common/Button';
import { cropAPI } from '../../api/crop';
import { useLocationData } from '../../hooks/useLocationData';
import { Wheat, Loader, X } from 'lucide-react';
import cropsData from '../../assets/CropsDetails.json';

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
  const [selectedCrop, setSelectedCrop] = useState(null);

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

  const getCropDetails = (cropName) => {
    return cropsData.find(crop => crop.crop_name.toLowerCase() === cropName.toLowerCase());
  };

  const handleCropClick = (cropName) => {
    const details = getCropDetails(cropName);
    setSelectedCrop(details || { crop_name: cropName, error: 'Details not found' });
  };

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
                  onClick={() => handleCropClick(crop.crop)}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:shadow-md hover:cursor-pointer transition-all hover:border-green-400 transform hover:-translate-y-0.5"
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

        {selectedCrop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 capitalize flex-1">{selectedCrop.crop_name}</h2>
                <button
                  onClick={() => setSelectedCrop(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {selectedCrop.error ? (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800">
                    <p>Detailed information not available for this crop at the moment.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-medium">Scientific Name</p>
                          <p className="text-gray-800 font-semibold">{selectedCrop.scientific_name}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-medium">Crop Type</p>
                          <p className="text-gray-800 font-semibold">{selectedCrop.crop_type}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-medium">Life Cycle</p>
                          <p className="text-gray-800 font-semibold">{selectedCrop.life_cycle_duration_days} days</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3">Seasons</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrop.season?.map((s, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedCrop.soil_requirements && (
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3 text-amber-900">Soil Requirements</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li><strong>Soil Type:</strong> {selectedCrop.soil_requirements.soil_type}</li>
                          <li><strong>pH Range:</strong> {selectedCrop.soil_requirements.ph_range}</li>
                          <li><strong>Drainage:</strong> {selectedCrop.soil_requirements.drainage}</li>
                        </ul>
                      </div>
                    )}

                    {selectedCrop.climate_requirements && (
                      <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3 text-sky-900">Climate Requirements</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li><strong>Temperature Range:</strong> {selectedCrop.climate_requirements.temperature_range_celsius}°C</li>
                          <li><strong>Rainfall Requirement:</strong> {selectedCrop.climate_requirements.rainfall_requirement_mm} mm</li>
                          <li><strong>Sunlight:</strong> {selectedCrop.climate_requirements.sunlight}</li>
                        </ul>
                      </div>
                    )}

                    {selectedCrop.land_preparation && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Land Preparation</h3>
                        <p className="bg-gray-50 p-4 rounded-lg text-gray-700">{selectedCrop.land_preparation}</p>
                      </div>
                    )}

                    {selectedCrop.spacing && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                          <p className="text-sm text-indigo-600 font-medium mb-2">Spacing</p>
                          <p className="text-gray-800 font-semibold">{selectedCrop.spacing}</p>
                        </div>
                        <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
                          <p className="text-sm text-rose-600 font-medium mb-2">Sowing Method</p>
                          <p className="text-gray-800 font-semibold">{selectedCrop.sowing_method}</p>
                        </div>
                      </div>
                    )}

                    {selectedCrop.irrigation_schedule && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Irrigation Schedule</h3>
                        <p className="bg-cyan-50 p-4 rounded-lg text-gray-700 border border-cyan-200">{selectedCrop.irrigation_schedule}</p>
                      </div>
                    )}

                    {selectedCrop.fertilizer_management && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Fertilizer Management</h3>
                        <p className="bg-lime-50 p-4 rounded-lg text-gray-700 border border-lime-200">{selectedCrop.fertilizer_management}</p>
                      </div>
                    )}

                    {selectedCrop.weed_management && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Weed Management</h3>
                        <p className="bg-orange-50 p-4 rounded-lg text-gray-700 border border-orange-200">{selectedCrop.weed_management}</p>
                      </div>
                    )}

                    {selectedCrop.pest_and_disease_management && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Pest & Disease Management</h3>
                        <p className="bg-red-50 p-4 rounded-lg text-gray-700 border border-red-200">{selectedCrop.pest_and_disease_management}</p>
                      </div>
                    )}

                    {selectedCrop.growth_stages && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Growth Stages</h3>
                        <div className="space-y-3">
                          {selectedCrop.growth_stages.map((stage, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-800 capitalize">{stage.stage_name}</h4>
                                <span className="text-sm bg-green-600 text-white px-2 py-1 rounded">{stage.duration_days} days</span>
                              </div>
                              <p className="text-gray-700 text-sm">{stage.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedCrop.harvesting && (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3 text-yellow-900">Harvesting</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li><strong>Harvest Time:</strong> {selectedCrop.harvesting.harvest_time}</li>
                          <li><strong>Method:</strong> {selectedCrop.harvesting.harvesting_method}</li>
                          <li><strong>Average Yield:</strong> {selectedCrop.harvesting.average_yield_per_hectare}</li>
                        </ul>
                      </div>
                    )}

                    {selectedCrop.post_harvest_handling && (
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Post-Harvest Handling</h3>
                        <p className="bg-gray-50 p-4 rounded-lg text-gray-700 border border-gray-200">{selectedCrop.post_harvest_handling}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default CropRecommendation;
