import { useState } from 'react';
import { Phone, Mail, Calendar, User, X, Video, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function Lawyers() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingStep, setBookingStep] = useState('select'); // 'select', 'confirm', 'booked'
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    timeSlot: '',
    reason: ''
  });

  // Generate time slots (9 AM to 6 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Dummy lawyer data with availability
  const lawyers = [
    {
      id: 1,
      name: 'Adv. Rajesh Kumar',
      experience: '15 years',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@law.com',
      specialties: ['Criminal Law', 'Civil Law'],
      availableSlots: timeSlots.slice(0, 8), // First 8 slots available
    },
    {
      id: 2,
      name: 'Adv. Priya Sharma',
      experience: '12 years',
      phone: '+91 98765 43211',
      email: 'priya.sharma@law.com',
      specialties: ['Family Law', 'Property Law'],
      availableSlots: timeSlots.slice(4, 12),
    },
    {
      id: 3,
      name: 'Adv. Amit Patel',
      experience: '10 years',
      phone: '+91 98765 43212',
      email: 'amit.patel@law.com',
      specialties: ['Corporate Law', 'Tax Law'],
      availableSlots: timeSlots.slice(8, 16),
    },
    {
      id: 4,
      name: 'Adv. Sneha Reddy',
      experience: '8 years',
      phone: '+91 98765 43213',
      email: 'sneha.reddy@law.com',
      specialties: ['Constitutional Law', 'Human Rights'],
      availableSlots: timeSlots.slice(0, 10),
    },
    {
      id: 5,
      name: 'Adv. Vikram Singh',
      experience: '20 years',
      phone: '+91 98765 43214',
      email: 'vikram.singh@law.com',
      specialties: ['Criminal Law', 'Supreme Court'],
      availableSlots: timeSlots.slice(6, 14),
    },
    {
      id: 6,
      name: 'Adv. Anjali Mehta',
      experience: '7 years',
      phone: '+91 98765 43215',
      email: 'anjali.mehta@law.com',
      specialties: ['Intellectual Property', 'Technology Law'],
      availableSlots: timeSlots.slice(2, 10),
    },
  ];

  const openModal = (lawyer) => {
    setSelectedLawyer(lawyer);
    setBookingStep('select');
    setSelectedTimeSlot(null);
    setBookingDetails({
      name: '',
      phone: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '',
      reason: ''
    });
  };

  const closeModal = () => {
    setSelectedLawyer(null);
    setBookingStep('select');
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
    setBookingDetails({ ...bookingDetails, timeSlot: slot });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedTimeSlot || !bookingDetails.name || !bookingDetails.phone) {
      alert('Please fill all required fields and select a time slot');
      return;
    }
    setBookingStep('booked');
    // In real app, this would make an API call to book the appointment
  };

  const handleVideoCall = () => {
    // Navigate to video call page with lawyer info and user name
    const userName = bookingDetails.name || 'User';
    navigate(`/video-call?lawyerId=${selectedLawyer.id}&lawyerName=${encodeURIComponent(selectedLawyer.name)}&userName=${encodeURIComponent(userName)}`);
  };

  const handleAILawyer = () => {
    navigate('/ai-lawyer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
            {t('lawyers.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('lawyers.subtitle')}
          </p>
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="card hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  <User className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{t('lawyers.experience')}</div>
                  <div className="font-semibold text-gray-900">{lawyer.experience}</div>
                </div>
              </div>

              <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                {lawyer.name}
              </h3>

              <div className="mb-4">
                <div className="flex items-center text-gray-600 mb-1">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{lawyer.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{lawyer.email}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {lawyer.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <button
                onClick={() => openModal(lawyer)}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('lawyers.bookConsultation')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {bookingStep === 'select' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading text-2xl font-bold text-gray-900">
                    {t('lawyers.bookingTitle')}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedLawyer.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{selectedLawyer.experience} of experience</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{selectedLawyer.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{selectedLawyer.email}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('lawyers.yourName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingDetails.name}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder={t('lawyers.enterName')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('lawyers.phoneNumber')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingDetails.phone}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder={t('lawyers.enterPhone')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={bookingDetails.email}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('lawyers.preferredDate')} *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDetails.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time Slot *
                    </label>
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-amber-200 rounded-lg">
                      {selectedLawyer.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleTimeSlotSelect(slot)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedTimeSlot === slot
                              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                              : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:shadow-md'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    {!selectedTimeSlot && (
                      <p className="text-xs text-red-500 mt-1">Please select a time slot</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Consultation
                    </label>
                    <textarea
                      value={bookingDetails.reason}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, reason: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Brief description of your legal issue..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-primary"
                  >
                    {t('lawyers.requestConsultation')}
                  </button>
                </form>
              </>
            )}

            {bookingStep === 'booked' && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                  Appointment Booked Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your appointment with {selectedLawyer.name} is confirmed for {bookingDetails.date} at {bookingDetails.timeSlot}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleVideoCall}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Video className="h-5 w-5" />
                    Start Video Call
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Lawyers;
