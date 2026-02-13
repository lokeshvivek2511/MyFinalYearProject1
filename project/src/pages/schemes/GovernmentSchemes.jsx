import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import SelectInput from '../../components/common/SelectInput';
import { schemeAPI } from '../../api/scheme';
import { useLocationData } from '../../hooks/useLocationData';
import { X, ExternalLink, ChevronLeft, ChevronRight, Search, Zap } from 'lucide-react';

const GovernmentSchemes = () => {
  const { user } = useAuth();
  const { states, getDistricts } = useLocationData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    age: user?.background?.age || '',
    land_holding: user?.background?.landHolding || '',
    income: user?.background?.income || '',
    farmer_type: user?.background?.farmerType || '',
    state: user?.region?.state || '',
    crop_type: '',
    category: user?.background?.category || '',
    gender: user?.background?.gender || '',
  });

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const schemesPerPage = 6;

  useEffect(() => {
    if (user) {
      setFilters({
        age: user?.background?.age || '',
        land_holding: user?.background?.landHolding || '',
        income: user?.background?.income || '',
        farmer_type: user?.background?.farmerType || '',
        state: user?.region?.state || '',
        crop_type: '',
        category: user?.background?.category || '',
        gender: user?.background?.gender || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await schemeAPI.getEligibleSchemes(filters);
      setSchemes(response.data.schemes || []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch schemes');
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(scheme => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      scheme.scheme_name?.toLowerCase().includes(search) ||
      scheme.benefits?.toLowerCase().includes(search) ||
      scheme.other_conditions?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredSchemes.length / schemesPerPage);
  const startIndex = (currentPage - 1) * schemesPerPage;
  const endIndex = startIndex + schemesPerPage;
  const currentSchemes = filteredSchemes.slice(startIndex, endIndex);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Government Schemes</h1>
          <p className="text-gray-600 mt-1">Discover agricultural schemes tailored to your profile</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-2 pb-4 border-b">
              <Zap className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Advanced Filter</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Age"
                type="number"
                name="age"
                value={filters.age}
                onChange={handleChange}
                required
              />
              <Input
                label="Land Holding (ha)"
                type="number"
                step="0.01"
                name="land_holding"
                value={filters.land_holding}
                onChange={handleChange}
                required
              />
              <Input
                label="Annual Income"
                type="number"
                name="income"
                value={filters.income}
                onChange={handleChange}
                required
              />
              <SelectInput
                label="Farmer Type"
                name="farmer_type"
                value={filters.farmer_type}
                onChange={handleChange}
                options={['small', 'marginal', 'large', 'any']}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SelectInput
                label="State"
                name="state"
                value={filters.state}
                onChange={handleChange}
                options={states}
                required
              />
              <Input
                label="Crop Type"
                type="text"
                name="crop_type"
                value={filters.crop_type}
                onChange={handleChange}
                placeholder="e.g., rice, wheat"
                required
              />
              <SelectInput
                label="Category"
                name="category"
                value={filters.category}
                onChange={handleChange}
                options={['GENERAL', 'OBC', 'SC', 'ST']}
                required
              />
              <SelectInput
                label="Gender"
                name="gender"
                value={filters.gender}
                onChange={handleChange}
                options={['M', 'F']}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm flex items-start space-x-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-semibold">
              {loading ? 'Searching Schemes...' : 'Find My Schemes'}
            </Button>
          </form>
        </Card>

        {schemes.length > 0 && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {filteredSchemes.length} Eligible Schemes Found
                </h2>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search schemes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>

              {currentSchemes.length === 0 ? (
                <Card>
                  <p className="text-center text-gray-600 py-8">No schemes match your search</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentSchemes.map((scheme) => (
                    <div
                      key={scheme.scheme_id}
                      className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all transform hover:-translate-y-1 border border-gray-200"
                      onClick={() => setSelectedScheme(scheme)}
                    >
                      <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                        {scheme.scheme_name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {scheme.benefits}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-green-600 text-sm font-semibold hover:underline flex items-center space-x-1">
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Eligible
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-6 py-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex-1">{selectedScheme.scheme_name}</h2>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Benefits</h3>
                <p className="text-green-800">{selectedScheme.benefits}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Eligibility Criteria</h3>
                <ul className="space-y-2">
                  {selectedScheme.reasons?.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-green-600 font-bold mt-1">✓</span>
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Important Conditions</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedScheme.other_conditions}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Steps to Apply</h3>
                <ol className="space-y-2">
                  {selectedScheme.steps_to_apply?.split(';').map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{step.trim()}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {selectedScheme.official_url && (
                <a
                  href={selectedScheme.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <span>Visit Official Website</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
  );
};

export default GovernmentSchemes;
