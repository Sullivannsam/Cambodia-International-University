
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Homepage from './components/public/Homepage.jsx'
import Navbar from './components/layout/Navbar';
import SlideShow from './components/public/SlideShow';
import AboutPage from './components/public/AboutPage';
import ContactUs from './components/public/ContactUs';
import Footer from './components/layout/Footer';
import AdminLogin from './pages/admin/Login.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import Register from './components/forms/RegisterForm.jsx';
import Login from './components/forms/LoginForm.jsx';
import Enroll from './components/public/Enrollment.jsx'


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

          <Route path = "/public/homepage" element = {
            <div>
              <Navbar />
              <Homepage />
            </div>
        }/>

          {/* Admin pages */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path = "/admin/dashboard" element = {
            <div>
               <AdminDashboard />
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
                <Login />
              </div>
            </div>
           }/>
         
          {/* Register page */}
           <Route path="/public/register" element={
            <div>
              <Navbar />
              <div className = "center-container">
                <Register />
              </div>
            </div>
           }/>
         
          {/* Enroll page */}
           <Route path="/public/content/enroll" element={
            <div>
              <Navbar />
                <Enroll />
            </div>
           }/>

          <Route path = "*" element = {
            <Navigate to =  "/" replace />
          }/>
          
        </Routes>
      </BrowserRouter>
  );
}

export default App;
