import React, { useState } from 'react';
import { sendContact } from '../../services/endpoints';

const ContactUs = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendContact({
        username: formData.username,
        phoneNumber: formData.phone,
        email: formData.email,
        message: formData.message,
      });
      setIsSubmitted(true);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }; 

  const handleReset = () => {
    setFormData({ username: '', phone: '', email: '', message: '' });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-['Inter',sans-serif] flex flex-col justify-between relative overflow-hidden">

      {/* Background Decorative Shapes (រាងធរណីមាត្រពណ៌ខៀវនៅខាងក្រោយ) */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-400/20 transform -skew-x-12 -translate-x-16 z-0" />
      <div className="absolute bottom-0 right-0 w-1/4 h-1/2 bg-blue-500/10 transform skew-y-12 z-0" />

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="w-full max-w-7xl mx-auto px-8 z-10 flex-grow flex flex-col justify-center">

        <div className="bg-white rounded-2xl shadow-xl p-10 w-full flex flex-col relative">

          {/* Top Description */}
          <div className="w-full mb-4 text-left">
            <p className="text-sm text-gray-600 font-medium leading-tight">All of responsibility is provide by us</p>
            <p className="text-xs text-gray-400">contact us for more information about our University.</p>
          </div>

          {/* Section Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-800 inline-block pb-1 pr-6 tracking-wide">
              Contact us
            </h1>
          </div>

          {/* --- THE EXACT CARD SHAPE --- */}

          {!isSubmitted ? (
            /* ផ្ទាំងទី ១: FORM បំពេញព័ត៌មាន ( layout រៀបចំដូចរូបភាពបេះបិទ ) */
            <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col justify-between">

              <div className="space-y-5">
                {/* ជួរទី១: Username (ឆ្វេង) និង Phone number (ស្តាំ) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Tell us your username*</label>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Please enter your username"
                      className="w-full bg-gray-100 border border-gray-200/60 rounded px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Tell us your Phone number*</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Please enter your phone number"
                      className="w-full bg-gray-100 border border-gray-200/60 rounded px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* ជួរទី២: Email (same grid gap as username row so widths match) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Tell us your email*</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Please enter your email"
                      className="w-full bg-gray-100 border border-gray-200/60 rounded px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* ជួរទី៣: Message */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">Tell us about your message*</label>
                  <textarea
                    name="message"
                    required
                    rows="12"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    className="w-full bg-gray-100 border border-gray-200/60 rounded px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-300/80 hover:bg-gray-300 text-gray-700 font-semibold text-sm px-8 py-2.5 rounded transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm px-8 py-2.5 rounded transition shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Confirm'}
                </button>
              </div>
            </form>
          ) : null}

          {error && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setError('')}>
              <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 text-center relative animate-[fadeIn_0.2s_ease-in]" onClick={e => e.stopPropagation()}>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
                <p className="text-base text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-base transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {isSubmitted && (
            <div className="flex flex-col items-center justify-center flex-grow text-center space-y-8 my-auto py-8 animate-[fadeIn_0.2s_ease-in]">

              {/* Success Title & Icon */}
              <div className="flex items-center space-x-3 justify-center">
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-wide">Submit Successful</h2>
                <div className="bg-green-500 text-white rounded-full p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Information Text */}
              <div className="text-base text-gray-600 max-w-md leading-relaxed space-y-1 font-medium">
                <p>Your Application has been submit successfully</p>
                <p>you will received our email in 24h after</p>
                <p>the application has been submit</p>
              </div>

              {/* Back to Home Button */}
              <button
                onClick={handleReset}
                className="bg-blue-400 hover:bg-blue-500 text-gray-900 font-bold text-sm px-12 py-3 rounded-md shadow transition transform active:scale-95 mt-4"
              >
                  <a href="/">
                    Back to Home
                  </a>
              </button>

              {/* Decorative Small Circles */}
              <div className="absolute bottom-6 left-6 flex items-end space-x-1.5 opacity-30">
                <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full mb-1"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full mb-2"></div>
              </div>
            </div>
          )}

          {/* ត្រីកោណតុបតែងនៅជ្រុងខាងស្តាំខាងក្រោម */}
          <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500/20 rounded-tl-full pointer-events-none"></div>
      </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-8 py-5 z-10 flex items-center justify-between text-sm text-gray-500 font-medium">
        <span>This contact provided by our University.</span>
        <div className="flex items-center space-x-1.5">
          <span>🇰🇭 Cambodia</span>
        </div>
      </footer>
    </div>
  );
};
    
export default ContactUs;
