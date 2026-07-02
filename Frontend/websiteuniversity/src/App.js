
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Homepage from './components/Homepage.jsx'
import Navbar from './components/Navbar';
import SlideShow from './components/SlideShow';
import AboutPage from './components/AboutPage';
import ContactUs from './components/ContactUs';
import Footer from './components/Footers';
import AdminLogin from './Admin/adminLogin.jsx';
import AdminDashboard from './Admin/adminDashboard.jsx';
import Register from './Log/Register.jsx';
import Login from './Log/Login.jsx';
import Enroll from './components/Enrollment.jsx'


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

          {/* Admin page */}
          <Route path="/login/admin" element={
            <div>
               <AdminLogin />          
            </div>
            }/>
          
          <Route path = "/admin/adminDashboard" element = {
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
