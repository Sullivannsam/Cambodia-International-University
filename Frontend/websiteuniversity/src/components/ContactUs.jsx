import React, { useState } from 'react';
import axios from 'axios';

const ContactUs = () => {
  // បង្កើត State សម្រាប់គ្រប់គ្រងការបង្ហាញផ្ទាំងជោគជ័យ
  const [isSubmitted, setIsSubmitted] = useState(false);

  // បង្កើត State សម្រាប់រក្សាទិន្នន័យ Form
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
      try {
          await axios.post("http://localhost:8080/api/contact", formData);
          setIsSubmitted(true);
      } catch (err) {
          console.error(err);
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
      <main className="w-full max-w-4xl mx-auto px-4 py-8 z-10 flex-grow flex flex-col justify-center">

        {/* Top Description (តម្រឹមខាងឆ្វេង ស្ថិតនៅពីលើប្រអប់ ដូចក្នុងរូបភាព) */}
        <div className="w-full mb-3 text-left pl-1">
          <p className="text-[11px] text-gray-600 font-medium leading-tight">All of responsibility is provide by us</p>
          <p className="text-[10px] text-gray-400">contact us for more information about our University.</p>
        </div>

        {/* Section Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800 border-b-2 border-gray-800 inline-block pb-0.5 pr-4 tracking-wide">
            Contact us
          </h1>
        </div>

        {/* --- THE EXACT CARD SHAPE (ប្រអប់រាងធំទូលាយ តាមទម្រង់ Grid ក្នុងរូបភាព) --- */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full border border-white/50 min-h-[460px] flex flex-col justify-between relative transition-all duration-300">

          {!isSubmitted ? (
            /* ផ្ទាំងទី ១: FORM បំពេញព័ត៌មាន ( layout រៀបចំដូចរូបភាពបេះបិទ ) */
            <form onSubmit={handleSubmit} className="space-y-5 flex-grow flex flex-col justify-between">

              <div className="space-y-4">
                {/* ជួរទី១: Username (ឆ្វេង) និង Phone number (ស្តាំ) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700 block">Tell us your username*</label>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Please enter your username"
                      className="w-full bg-gray-100 border border-gray-200/60 rounded px-3 py-2 text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700 block">Tell us your Phone number*</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Please enter your phone number"
                      className="w-full bg-gray-100 border border-gray-200/60 rounded px-3 py-2 text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* ជួរទី២: Email មានទទឹងត្រឹមពាក់កណ្តាលប្រអប់ (md:w-1/2) និងសល់ចន្លោះទំនេរខាងស្តាំ */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-gray-700 block">Tell us your email*</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Please enter your email"
                      className="w-full bg-gray-100 border border-gray-200/60 rounded px-3 py-2 text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                  {/* ចន្លោះទំនេរខាងស្តាំស្អាតដូចក្នុងរូបភាព */}
                  <div className="hidden md:block"></div>
                </div>

                {/* ជួរទី៣: Message លាតពេញទទឹង និងមានប្រអប់ធំចុះក្រោម */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-700 block">Tell us about your message*</label>
                  <textarea
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    className="w-full bg-gray-100 border border-gray-200/60 rounded px-3 py-3 text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons (ប៊ូតុង Cancel និង Confirm នៅកៀនខាងស្តាំផ្នែកខាងក្រោម) */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-300/80 hover:bg-gray-300 text-gray-700 font-semibold text-xs px-6 py-1.5 rounded transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-xs px-6 py-1.5 rounded transition shadow-sm"
                >
                  Confirm
                </button>
              </div>
            </form>
          ) : (
            /* ផ្ទាំងទី ២: SUBMIT SUCCESSFUL (រចនាបថស្អាតប្លែកភ្នែក) */
            <div className="flex flex-col items-center justify-center flex-grow text-center space-y-6 my-auto py-4 animate-[fadeIn_0.2s_ease-in]">

              {/* Success Title & Icon */}
              <div className="flex items-center space-x-2 justify-center">
                <h2 className="text-xl font-extrabold text-gray-800 tracking-wide">Submit Successful</h2>
                <div className="bg-green-500 text-white rounded-full p-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Information Text */}
              <div className="text-xs text-gray-600 max-w-sm leading-relaxed space-y-1 font-medium">
                <p>Your Application has been submit successfully</p>
                <p>you will received our email in 24h after</p>
                <p>the application has been submit</p>
              </div>

              {/* Back to Home Button */}
              <button
                onClick={handleReset}
                className="bg-blue-400 hover:bg-blue-500 text-gray-900 font-bold text-xs px-10 py-2.5 rounded-md shadow transition transform active:scale-95 mt-4"
              >
                Back to Home
              </button>

              {/* Decorative Small Circles (ជ្រុងខាងឆ្វេងក្រោម) */}
              <div className="absolute bottom-6 left-6 flex items-end space-x-1.5 opacity-30">
                <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full mb-1"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full mb-2"></div>
              </div>
            </div>
          )}

          {/* ត្រីកោណតុបតែងនៅជ្រុងខាងស្តាំខាងក្រោម */}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500/20 rounded-tl-full pointer-events-none"></div>
        </div>
      </main>

      <footer className="w-full max-w-4xl mx-auto px-4 py-4 z-10 flex items-center justify-between text-[10px] text-gray-500 font-medium">
        <span>This contact provided by our University.</span>
        <div className="flex items-center space-x-1.5">
          <span>KHMER</span>
        </div>
      </footer>
    </div>
  );
};
    
export default ContactUs;
