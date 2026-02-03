import { useState, useMemo } from 'react';
import { Search, Volume2, BookOpen, ExternalLink, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { legalGlossary, getTermsByLetter, searchTerms, getCategories, getRelatedTerms } from '../data/legalGlossary';

function LegalGlossary() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [showPronunciation, setShowPronunciation] = useState(true);

  // Generate alphabet letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Filter terms based on search, letter, and category
  const filteredTerms = useMemo(() => {
    let terms = legalGlossary;

    // Filter by search query
    if (searchQuery.trim()) {
      terms = searchTerms(searchQuery);
    } else if (selectedLetter) {
      terms = getTermsByLetter(selectedLetter);
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      terms = terms.filter(term => term.category === selectedCategory);
    }

    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedLetter, selectedCategory]);

  const categories = ['All', ...getCategories()];

  // Speak pronunciation
  const speakTerm = (term) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term.pronunciation || term.term);
    utterance.lang = language;
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  // Get term in current language
  const getTermText = (term) => {
    if (language === 'hi-IN') return term.hindi;
    if (language === 'kn-IN') return term.kannada;
    return term.term;
  };

  // Get related terms
  const relatedTerms = selectedTerm ? getRelatedTerms(selectedTerm.term) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <BookOpen className="h-10 w-10 text-amber-600" />
            Legal Glossary
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive dictionary of legal terms in English, Hindi, and Kannada
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedLetter('');
                }}
                placeholder="Search legal terms..."
                className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gradient-to-br from-amber-50/50 to-orange-50/50"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gradient-to-br from-amber-50/50 to-orange-50/50 appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Alphabet Navigation */}
          {!searchQuery && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {alphabet.map(letter => (
                <motion.button
                  key={letter}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedLetter(letter);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                    selectedLetter === letter
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                      : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:shadow-md'
                  }`}
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Terms List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results (${filteredTerms.length})` : 
                   selectedLetter ? `Terms starting with "${selectedLetter}" (${filteredTerms.length})` :
                   `All Terms (${filteredTerms.length})`}
                </h2>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showPronunciation}
                    onChange={(e) => setShowPronunciation(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  Show pronunciation
                </label>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {filteredTerms.length > 0 ? (
                    filteredTerms.map((term, index) => (
                      <motion.div
                        key={term.term}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => setSelectedTerm(term)}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          selectedTerm?.term === term.term
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                            : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:shadow-md hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-heading text-lg font-bold">
                                {getTermText(term)}
                              </h3>
                              {showPronunciation && (
                                <span className="text-xs opacity-75">
                                  [{term.pronunciation}]
                                </span>
                              )}
                            </div>
                            <p className="text-sm opacity-90 mb-2">
                              {term.definition}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs px-2 py-1 rounded-full bg-amber-200/30">
                                {term.category}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakTerm(term);
                                }}
                                className="text-xs px-2 py-1 rounded-full bg-amber-200/30 hover:bg-amber-300/40 flex items-center gap-1"
                              >
                                <Volume2 className="h-3 w-3" />
                                Pronounce
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No terms found. Try a different search.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Term Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedTerm ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card sticky top-4"
              >
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                  {getTermText(selectedTerm)}
                </h2>

                {/* Pronunciation */}
                <div className="mb-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pronunciation</p>
                      <p className="text-lg font-semibold">{selectedTerm.pronunciation}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => speakTerm(selectedTerm)}
                      className="p-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg shadow-md"
                    >
                      <Volume2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {/* All Language Versions */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">In Other Languages:</p>
                  <div className="space-y-2">
                    <div className="p-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded border border-amber-200">
                      <p className="text-xs text-gray-600">English</p>
                      <p className="font-semibold">{selectedTerm.term}</p>
                    </div>
                    <div className="p-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded border border-amber-200">
                      <p className="text-xs text-gray-600">Hindi</p>
                      <p className="font-semibold">{selectedTerm.hindi}</p>
                    </div>
                    <div className="p-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded border border-amber-200">
                      <p className="text-xs text-gray-600">Kannada</p>
                      <p className="font-semibold">{selectedTerm.kannada}</p>
                    </div>
                  </div>
                </div>

                {/* Definition */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Definition:</p>
                  <p className="text-gray-600">{selectedTerm.definition}</p>
                </div>

                {/* Example */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Example:</p>
                  <p className="text-gray-600 italic">"{selectedTerm.example}"</p>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Category:</p>
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full text-sm">
                    {selectedTerm.category}
                  </span>
                </div>

                {/* Related Terms */}
                {relatedTerms.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Related Terms:</p>
                    <div className="flex flex-wrap gap-2">
                      {relatedTerms.slice(0, 5).map(term => (
                        <motion.button
                          key={term.term}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedTerm(term)}
                          className="px-3 py-1 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-full text-sm hover:shadow-md transition-all"
                        >
                          {term.term}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="card text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a term to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalGlossary;

