import { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, X } from 'lucide-react';

const TranslateDropdown = ({ onTranslate, isTranslating }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = async (language) => {
    setIsOpen(false);
    const result = await onTranslate(language === 'en' ? '' : language);
    if (result) {
      setTranslatedText(result);
    }
  };

  const handleCustomLanguage = async () => {
    if (customLanguage.trim()) {
      const result = await onTranslate(customLanguage);
      if (result) {
        setTranslatedText(result);
      }
      setCustomLanguage('');
      setShowCustomInput(false);
    }
  };

  const handleClear = () => {
    setTranslatedText('');
    setCustomLanguage('');
    setShowCustomInput(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <Languages className="w-4 h-4" />
        <span>Translate</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-max">
          <div className="p-2">
            <p className="text-xs text-gray-600 font-semibold px-3 py-2">Quick Languages</p>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                disabled={isTranslating}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm transition-colors disabled:opacity-50"
              >
                {lang.name}
              </button>
            ))}

            <div className="border-t border-gray-200 my-2" />

            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm transition-colors text-blue-600 font-medium"
            >
              Other Languages...
            </button>

            {showCustomInput && (
              <div className="px-3 py-2 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="e.g., Marathi, Bengali"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                />
                <p className="text-xs text-gray-500 mb-2">
                  Note: You can use mixed languages like "Tamil+English"
                </p>
                <button
                  onClick={handleCustomLanguage}
                  disabled={isTranslating || !customLanguage.trim()}
                  className="w-full px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isTranslating ? 'Translating...' : 'Translate'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {translatedText && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg relative">
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-sm text-blue-800 pr-6">{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default TranslateDropdown;
