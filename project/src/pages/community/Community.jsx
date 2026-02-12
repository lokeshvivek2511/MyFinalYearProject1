import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { questionAPI } from '../../api/question';
import { answerAPI } from '../../api/answer';
import { translateAPI } from '../../api/translate';
import { Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Languages, Plus } from 'lucide-react';

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
            <h1 className="text-2xl font-bold text-gray-800">Community</h1>
            <p className="text-gray-600 mt-1">Ask questions and get answers from experts</p>
          </div>
          <Button onClick={() => setShowAskModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ask Question
          </Button>
        </div>

        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Questions
          </button>
          <button
            onClick={() => setActiveTab('my-questions')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'my-questions'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            My Questions
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="space-y-4">
          {searchedQuestions.length === 0 ? (
            <Card>
              <p className="text-center text-gray-600">No questions found</p>
            </Card>
          ) : (
            searchedQuestions.map((question) => (
              <QuestionCard key={question._id} question={question} user={user} />
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

const QuestionCard = ({ question, user }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    } catch (error) {
      console.error('Error posting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{question.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Asked by {question.askedBy?.name || 'Anonymous'}</span>
          <span>{question.answersCount} answers</span>
          {question.tags && question.tags.length > 0 && (
            <div className="flex space-x-2">
              {question.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchAnswers}>
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
            {showAnswers ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
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
              Write an Answer
            </Button>
          )}

          {showAnswerForm && (
            <form onSubmit={handleSubmitAnswer} className="space-y-2">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Write your answer..."
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
            <p className="text-gray-600 text-center py-4">No answers yet. Be the first to answer!</p>
          ) : (
            <div className="space-y-3">
              {answers.map((answer) => (
                <AnswerCard key={answer._id} answer={answer} user={user} />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const AnswerCard = ({ answer, user }) => {
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [translating, setTranslating] = useState(false);

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

  const handleVote = async (voteType) => {
    try {
      await answerAPI.voteAnswer(answer._id, voteType);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{answer.answeredBy?.name || 'Anonymous'}</span>
          {answer.isExpertAnswer && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Expert</span>
          )}
          <span className="text-xs text-gray-500">
            Reputation: {answer.answeredBy?.reputation || 0}
          </span>
        </div>

        <select
          value={selectedLanguage}
          onChange={(e) => handleTranslate(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        >
          <option value="">Original</option>
          <option value="Hindi">Hindi</option>
          <option value="Tamil">Tamil</option>
          <option value="Telugu">Telugu</option>
          <option value="Kannada">Kannada</option>
          <option value="Malayalam">Malayalam</option>
        </select>
      </div>

      <p className="text-gray-700 mb-3">
        {translating ? 'Translating...' : translatedText || answer.answerText}
      </p>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleVote('up')}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{answer.upvotes || 0}</span>
        </button>
        <button
          onClick={() => handleVote('down')}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
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
        <h2 className="text-xl font-bold mb-4">Ask a Question</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="What's your question?"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Provide more details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., irrigation, pest-control"
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
