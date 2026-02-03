import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, FileText, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AdminTemplates() {
  const [templates, setTemplates] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Agreements',
    template: ''
  });

  const categories = ['Agreements', 'Notices', 'Property', 'Legal Documents', 'Other'];

  // Load templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('documentTemplates');
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  // Save templates to localStorage
  const saveTemplates = (newTemplates) => {
    localStorage.setItem('documentTemplates', JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const handleAdd = () => {
    if (!formData.name || !formData.template) {
      alert('Please fill in template name and content');
      return;
    }

    const key = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newTemplates = {
      ...templates,
      [key]: {
        name: formData.name,
        category: formData.category,
        template: formData.template
      }
    };

    saveTemplates(newTemplates);
    setFormData({ name: '', category: 'Agreements', template: '' });
    setShowAddForm(false);
    alert('Template added successfully!');
  };

  const handleEdit = (key) => {
    setEditingTemplate(key);
    setFormData(templates[key]);
    setShowAddForm(true);
  };

  const handleUpdate = () => {
    if (!formData.name || !formData.template) {
      alert('Please fill in template name and content');
      return;
    }

    const newTemplates = { ...templates };
    newTemplates[editingTemplate] = {
      name: formData.name,
      category: formData.category,
      template: formData.template
    };

    saveTemplates(newTemplates);
    setFormData({ name: '', category: 'Agreements', template: '' });
    setShowAddForm(false);
    setEditingTemplate(null);
    alert('Template updated successfully!');
  };

  const handleDelete = (key) => {
    if (window.confirm(`Are you sure you want to delete "${templates[key].name}"?`)) {
      const newTemplates = { ...templates };
      delete newTemplates[key];
      saveTemplates(newTemplates);
      alert('Template deleted successfully!');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', category: 'Agreements', template: '' });
    setShowAddForm(false);
    setEditingTemplate(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            Manage Document Templates
          </h2>
          <p className="text-gray-600">Add, edit, or remove legal document templates</p>
        </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2"
          >
            {showAddForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {showAddForm ? 'Cancel' : 'Add Template'}
          </button>
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card mb-8"
            >
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                {editingTemplate ? 'Edit Template' : 'Add New Template'}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="e.g., Employment Contract"
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
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Content *
                  </label>
                  <textarea
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    rows={15}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                    placeholder="Enter the template content here. Use [placeholders] for user input fields."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Use placeholders like [Enter Name], [Enter Date], [Amount] for fields users need to fill
                  </p>
                </div>
                <div className="flex gap-3">
                  {editingTemplate ? (
                    <button onClick={handleUpdate} className="btn-primary flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Update Template
                    </button>
                  ) : (
                    <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Template
                    </button>
                  )}
                  <button onClick={handleCancel} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Templates List */}
        <div className="space-y-4">
          <h2 className="font-heading text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-amber-600" />
            Existing Templates ({Object.keys(templates).length})
          </h2>
          
          {Object.entries(templates).map(([key, template]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-6 w-6 text-amber-600" />
                    <div>
                      <h3 className="font-heading text-xl font-bold text-gray-900">
                        {template.name}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 font-mono line-clamp-3">
                      {template.template.substring(0, 200)}...
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(key)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Template"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(key)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Template"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {Object.keys(templates).length === 0 && (
            <div className="card text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No templates added yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add Template" to create your first template</p>
            </div>
          )}
        </div>
    </div>
  );
}

export default AdminTemplates;
