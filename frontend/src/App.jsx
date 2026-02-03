import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import CaseLawSearch from './pages/CaseLawSearch';
import Lawyers from './pages/Lawyers';
import DocumentTemplates from './pages/DocumentTemplates';
import LegalGlossary from './pages/LegalGlossary';
import VideoTutorials from './pages/VideoTutorials';
import VideoCall from './pages/VideoCall';
import AILawyer from './pages/AILawyer';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import Footer from './components/Footer';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chatbot />} />
              <Route path="/case-law-search" element={<CaseLawSearch />} />
              <Route path="/lawyers" element={<Lawyers />} />
              <Route path="/document-templates" element={<DocumentTemplates />} />
              <Route path="/legal-glossary" element={<LegalGlossary />} />
              <Route path="/video-tutorials" element={<VideoTutorials />} />
              <Route path="/video-call" element={<VideoCall />} />
              <Route path="/ai-lawyer" element={<AILawyer />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;

