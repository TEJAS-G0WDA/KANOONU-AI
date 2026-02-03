import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { adminLogin } from '../api';
import { useLanguage } from '../contexts/LanguageContext';

function AdminLogin() {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already logged in, redirect to admin page
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check credentials locally
      if (username === 'admin' && password === '1234') {
        // Store login status in sessionStorage
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ paddingTop: '120px' }}>
      <div className="max-w-md w-full relative z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-200">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
              {t('adminLogin.title')}
            </h1>
            <p className="text-gray-600">{t('adminLogin.subtitle')}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {t('adminLogin.username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder={t('adminLogin.enterUsername')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('adminLogin.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder={t('adminLogin.enterPassword')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {t('adminLogin.loggingIn')}
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  {t('adminLogin.login')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
