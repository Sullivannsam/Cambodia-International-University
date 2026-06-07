
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import SlideShow from './components/SlideShow';
import AboutPage from './components/AboutPage';
import ContactUs from './components/ContactUs';
import Footer from './components/Footers';
import Admin from './Admin/admin.jsx';
import Register from './Log/Register.jsx';
import Log from './Log/Login.jsx';
import Enroll from './components/Enroll.jsx'


function App() {
  return (
  <BrowserRouter>
        <Routes>
          {/* Home page */}
          <Route path="/" element={
            <div>
              <Navbar />
              <SlideShow />
              <AboutPage />
              <Footer />
            </div>
          } />

          {/* Admin page */}
          <Route path="/api/v1/auth/login/admin" element={
            <div>
                <Navbar/>
                  <div className = "center-container ">
                    <Admin />
                  </div>
          
            </div>
            }/>
          
          {/*Contact page */}
          <Route path="/public/contact" element={
            <div>
              <Navbar />
              <ContactUs />
            </div>
           }/>
          
            {/*Login page */}
          <Route path="/public/login" element={
            <div>
              <Navbar />
              <div className = "center-container">
                <Log />
              </div>
            </div>
           }/>
         
          {/* Register page */}
           <Route path="/public/register" element={
            <div>
              <Navbar />
              <div className = "center-container">
                <Log />
              </div>
            </div>
           }/>
         
          {/* Enroll page */}
           <Route path="/public/content/enroll" element={
            <div>
              <Navbar />
              <div className = "center-container">
                <Enroll />
              </div>
            </div>
           }/>
          
        </Routes>
      </BrowserRouter>
  );
}

export default App;
