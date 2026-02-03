import { useState, useEffect } from 'react';
import { Play, Clock, BookOpen, Search, Filter, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const categories = ['All', 'Introduction', 'Court Procedure', 'Property Law', 'Contract Law', 'Criminal Law', 'Family Law', 'Consumer Law', 'Tax Law'];

function VideoTutorials() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);

  // Load videos from localStorage on mount
  useEffect(() => {
    const savedVideos = localStorage.getItem('videoTutorials');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }
  }, []);

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Play className="h-10 w-10 text-amber-600" />
            Legal Video Tutorials
          </h1>
          <p className="text-lg text-gray-600">
            Learn legal concepts through animated video explanations
          </p>
          {videos.length === 0 && (
            <div className="mt-4 p-4 bg-amber-100 border border-amber-300 rounded-lg max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-800 mb-1">No Videos Available</p>
                  <p className="text-xs text-amber-700">
                    Video tutorials have not been added yet. Admin can add video tutorials from the admin panel.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutorials..."
                className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gradient-to-br from-amber-50/50 to-orange-50/50"
              />
            </div>
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
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative mb-4 rounded-xl overflow-hidden">
                  {video.thumbnail && video.thumbnail.trim() !== '' ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-16 w-16 text-amber-600 mx-auto mb-2 opacity-50" />
                        <p className="text-xs text-amber-700 font-semibold">{video.videoUrl ? 'Play Video' : 'Video Coming Soon'}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full">
                    {video.category}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {video.topics.map((topic, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredVideos.length === 0 && (
          <div className="card text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tutorials found. Try a different search or category.</p>
          </div>
        )}

        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4">
                  <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-gray-600">{selectedVideo.description}</p>
                </div>
                
                {/* Video Player or Placeholder */}
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  {selectedVideo.videoUrl ? (
                    <iframe
                      src={selectedVideo.videoUrl.includes('youtube.com') || selectedVideo.videoUrl.includes('youtu.be')
                        ? selectedVideo.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
                        : selectedVideo.videoUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedVideo.title}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <div className="text-center">
                        <BookOpen className="h-24 w-24 text-amber-600 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold text-gray-700 mb-2">Video Content Coming Soon</p>
                        <p className="text-sm text-gray-600 max-w-md mx-auto">
                          This tutorial video is currently being prepared and will be available soon.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {selectedVideo.topics.map((topic, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VideoTutorials;
