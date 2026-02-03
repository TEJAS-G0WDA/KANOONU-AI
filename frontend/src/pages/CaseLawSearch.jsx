import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ExternalLink, Loader2 } from 'lucide-react';
import { searchCaseLaw } from '../api';
import { useLanguage } from '../contexts/LanguageContext';

function CaseLawSearch() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearchWithQuery = async (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const data = await searchCaseLaw(searchQuery.trim());
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error searching case law. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check for query parameter from voice command
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setQuery(queryParam);
      // Auto-search when query param is present
      setTimeout(() => {
        handleSearchWithQuery(queryParam);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    await handleSearchWithQuery(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
            {t('caseLaw.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('caseLaw.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="card mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('caseLaw.placeholder')}
                className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {t('caseLaw.searching')}
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  {t('caseLaw.search')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
              {t('caseLaw.results')}
            </h2>
            {results.map((result, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  {result.title || 'Case Title'}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {result.summary || result.excerpt || 'No summary available.'}
                </p>
                {result.link && (
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-amber-700 hover:text-amber-800 font-semibold"
                  >
                    {t('caseLaw.viewCase')}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('caseLaw.noResults')}</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && results.length === 0 && !query && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('caseLaw.enterQuery')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseLawSearch;
