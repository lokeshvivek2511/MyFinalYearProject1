import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import TranslateDropdown from '../../components/common/TranslateDropdown';
import Loading from '../../components/common/Loading';
import { questionAPI } from '../../api/question';
import { answerAPI } from '../../api/answer';
import { translateAPI } from '../../api/translate';
import { Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Plus, MessageCircle } from 'lucide-react';

const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await questionAPI.getQuestions();
      setQuestions(response.data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (activeTab === 'my-questions') {
      return q.askedBy?._id === user?._id;
    }
    return true;
  });

  const searchedQuestions = filteredQuestions.filter((q) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      q.title?.toLowerCase().includes(search) ||
      q.description?.toLowerCase().includes(search) ||
      q.tags?.some(tag => tag.toLowerCase().includes(search))
    );
  });

  if (loading) {
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Community Q&A</h1>
            <p className="text-gray-600 mt-1">Share knowledge, ask questions, get expert advice</p>
          </div>
          <Button onClick={() => setShowAskModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ask Question
          </Button>
        </div>

        <div className="flex space-x-4 border-b bg-gray-50 rounded-t-lg px-4">
          {['all', 'my-questions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'all' ? 'All Questions' : 'My Questions'}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 font-medium"
          />
        </div>

        <div className="space-y-4">
          {searchedQuestions.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No questions found</p>
              </div>
            </Card>
          ) : (
            searchedQuestions.map((question) => (
              <QuestionCard key={question._id} question={question} user={user} onAnswerPosted={fetchQuestions} />
            ))
          )}
        </div>
      </div>

      {showAskModal && (
        <AskQuestionModal
          onClose={() => setShowAskModal(false)}
          onSuccess={() => {
            setShowAskModal(false);
            fetchQuestions();
          }}
        />
      )}
    </PageWrapper>
  );
};

const QuestionCard = ({ question, user, onAnswerPosted }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [translatedTitle, setTranslatedTitle] = useState('');

  const fetchAnswers = async () => {
    if (answers.length > 0) {
      setShowAnswers(!showAnswers);
      return;
    }

    setLoadingAnswers(true);
    try {
      const response = await answerAPI.getAnswersByQuestion(question._id);
      setAnswers(response.data || []);
      setShowAnswers(true);
    } catch (error) {
      console.error('Error fetching answers:', error);
    } finally {
      setLoadingAnswers(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await answerAPI.postAnswer({
        questionId: question._id,
        answerText,
      });
      setAnswerText('');
      setShowAnswerForm(false);
      await fetchAnswers();
      onAnswerPosted();
    } catch (error) {
      console.error('Error posting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTranslateQuestion = async (language) => {
    if (!language) {
      setTranslatedTitle('');
      return;
    }

    try {
      const response = await translateAPI.translate(question.title, language);
      setTranslatedTitle(response.data.translated);
      return response.data.translated;
    } catch (error) {
      console.error('Error translating:', error);
      return null;
    }
  };

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 mb-2">{question.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{question.description}</p>

            <TranslateDropdown onTranslate={handleTranslateQuestion} isTranslating={loadingAnswers} />
          </div>
        </div>

        {translatedTitle && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
            <strong>Translated:</strong> {translatedTitle}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>By {question.askedBy?.name || 'Anonymous'}</span>
            <span className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{question.answersCount} answers</span>
            </span>
            {question.tags && question.tags.length > 0 && (
              <div className="flex space-x-2">
                {question.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button variant="outline" onClick={fetchAnswers}>
            {showAnswers ? 'Hide' : 'Show'} Answers
            {showAnswers ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>

        {loadingAnswers && (
          <div className="mt-4">
            <Loading message="Loading answers..." />
          </div>
        )}

        {showAnswers && !loadingAnswers && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {!showAnswerForm && (
              <Button onClick={() => setShowAnswerForm(true)} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Write an Answer
              </Button>
            )}

            {showAnswerForm && (
              <form onSubmit={handleSubmitAnswer} className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Share your knowledge..."
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                />
                <div className="flex space-x-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Answer'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAnswerForm(false);
                      setAnswerText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {answers.length === 0 ? (
              <p className="text-gray-600 text-center py-4">Be the first to answer this question!</p>
            ) : (
              <div className="space-y-3">
                {answers.map((answer) => (
                  <AnswerCard key={answer._id} answer={answer} user={user} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const AnswerCard = ({ answer, user }) => {
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [translating, setTranslating] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
  ];

  const handleTranslate = async (language) => {
    if (!language) {
      setTranslatedText('');
      setSelectedLanguage('');
      return;
    }

    setTranslating(true);
    try {
      const response = await translateAPI.translate(answer.answerText, language);
      setTranslatedText(response.data.translated);
      setSelectedLanguage(language);
    } catch (error) {
      console.error('Error translating:', error);
    } finally {
      setTranslating(false);
    }
  };

  const handleCustomTranslate = async () => {
    if (customLanguage.trim()) {
      setTranslating(true);
      try {
        const response = await translateAPI.translate(answer.answerText, customLanguage);
        setTranslatedText(response.data.translated);
        setSelectedLanguage(customLanguage);
        setCustomLanguage('');
        setShowCustom(false);
      } catch (error) {
        console.error('Error translating:', error);
      } finally {
        setTranslating(false);
      }
    }
  };

  const handleVote = async (voteType) => {
    try {
      await answerAPI.voteAnswer(answer._id, voteType);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-800">{answer.answeredBy?.name || 'Anonymous'}</span>
          {answer.isExpertAnswer && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Expert
            </span>
          )}
          <span className="text-xs text-gray-500">Rep: {answer.answeredBy?.reputation || 0}</span>
        </div>

        <div className="flex items-center space-x-2">
          {!selectedLanguage ? (
            <>
              <select
                onChange={(e) => handleTranslate(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
              >
                <option value="">Translate</option>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
                <option value="custom">Others...</option>
              </select>
            </>
          ) : (
            <>
              <span className="text-xs font-medium text-blue-600">{selectedLanguage.toUpperCase()}</span>
              <button
                onClick={() => {
                  setTranslatedText('');
                  setSelectedLanguage('');
                }}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      {showCustom && (
        <div className="mb-3 p-2 bg-white rounded border border-gray-300 space-y-2">
          <input
            type="text"
            placeholder="e.g., Marathi, Bengali+English"
            value={customLanguage}
            onChange={(e) => setCustomLanguage(e.target.value)}
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500">Note: You can use mixed languages like "Tamil+English"</p>
          <button
            onClick={handleCustomTranslate}
            disabled={translating || !customLanguage.trim()}
            className="w-full text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {translating ? 'Translating...' : 'Translate'}
          </button>
        </div>
      )}

      <p className="text-gray-700 text-sm mb-3">
        {translating ? 'Translating...' : translatedText || answer.answerText}
      </p>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleVote('up')}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{answer.upvotes || 0}</span>
        </button>
        <button
          onClick={() => handleVote('down')}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          <ThumbsDown className="w-4 h-4" />
          <span>{answer.downvotes || 0}</span>
        </button>
      </div>
    </div>
  );
};

const AskQuestionModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await questionAPI.askQuestion({
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Question Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="What do you want to know?"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Provide detailed context..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="irrigation, pest-control, organic"
          />

          <div className="flex space-x-4">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Posting...' : 'Post Question'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Community;
