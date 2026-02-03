import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Video, Clock, Tag, FileText } from 'lucide-react';

function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: 'Introduction',
    videoUrl: '',
    thumbnail: '',
    topics: '',
  });

  const categories = [
    'Introduction',
    'Court Procedure',
    'Property Law',
    'Contract Law',
    'Criminal Law',
    'Family Law',
    'Consumer Law',
    'Tax Law'
  ];

  // Load videos from localStorage on mount
  useEffect(() => {
    const savedVideos = localStorage.getItem('videoTutorials');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }
  }, []);

  // Save videos to localStorage whenever they change
  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem('videoTutorials', JSON.stringify(videos));
    }
  }, [videos]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      category: 'Introduction',
      videoUrl: '',
      thumbnail: '',
      topics: '',
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!formData.title || !formData.description || !formData.category) {
      alert('Please fill in at least title, description, and category');
      return;
    }

    const newVideo = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      duration: formData.duration || '0:00',
      category: formData.category,
      videoUrl: formData.videoUrl || null,
      topics: formData.topics ? formData.topics.split(',').map(t => t.trim()) : [],
      thumbnail: formData.thumbnail || null,
    };

    setVideos([...videos, newVideo]);
    resetForm();
  };

  const handleEdit = (video) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      description: video.description,
      duration: video.duration,
      category: video.category,
      videoUrl: video.videoUrl || '',
      thumbnail: video.thumbnail || '',
      topics: video.topics.join(', '),
    });
    setShowAddForm(true);
  };

  const handleUpdate = () => {
    if (!formData.title || !formData.description || !formData.category) {
      alert('Please fill in at least title, description, and category');
      return;
    }

    const updatedVideos = videos.map(video => {
      if (video.id === editingId) {
        return {
          ...video,
          title: formData.title,
          description: formData.description,
          duration: formData.duration || '0:00',
          category: formData.category,
          videoUrl: formData.videoUrl || null,
          thumbnail: formData.thumbnail || null,
          topics: formData.topics ? formData.topics.split(',').map(t => t.trim()) : [],
        };
      }
      return video;
    });

    setVideos(updatedVideos);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this video tutorial?')) {
      const updatedVideos = videos.filter(video => video.id !== id);
      setVideos(updatedVideos);
      
      // If no videos left, clear localStorage
      if (updatedVideos.length === 0) {
        localStorage.removeItem('videoTutorials');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            Manage Video Tutorials
          </h2>
          <p className="text-gray-600 text-sm">
            Add, edit, or delete video tutorials. Videos added here will appear in the Video Tutorials page.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Video
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card mb-8 border-2 border-amber-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading text-xl font-bold text-gray-900">
              {editingId ? 'Edit Video Tutorial' : 'Add New Video Tutorial'}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Understanding Indian Legal System"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows="3"
                placeholder="Learn about the structure of Indian judiciary, courts hierarchy, and legal framework."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (e.g., 1:30)
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="1:00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (YouTube, Vimeo, or direct video link)
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty if video is not yet available
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://example.com/thumbnail.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Thumbnail image for the video (400x225 recommended). Leave empty for default placeholder.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topics (comma-separated)
              </label>
              <input
                type="text"
                value={formData.topics}
                onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Court Structure, Judiciary, Legal Framework"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {editingId ? (
              <button
                onClick={handleUpdate}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="h-5 w-5" />
                Update Video
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Video
              </button>
            )}
            <button
              onClick={resetForm}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Videos List */}
      <div className="space-y-4">
        {videos.length === 0 ? (
          <div className="card text-center py-12">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No video tutorials added yet</p>
            <p className="text-sm text-gray-400">Click "Add Video" to create your first video tutorial</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-48 h-28 rounded-lg overflow-hidden">
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                      <Video className="h-12 w-12 text-amber-600 opacity-50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {video.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(video)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span className="font-semibold">{video.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{video.duration}</span>
                    </div>
                    {video.videoUrl && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Video className="h-4 w-4" />
                        <span className="font-semibold">Video Available</span>
                      </div>
                    )}
                    {!video.videoUrl && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <FileText className="h-4 w-4" />
                        <span className="font-semibold">Coming Soon</span>
                      </div>
                    )}
                  </div>

                  {video.topics && video.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {video.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {videos.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Total Videos:</strong> {videos.length} | Videos are saved locally and will appear on the Video Tutorials page.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminVideos;
