
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Homepage from './components/public/Homepage.jsx'
import Navbar from './components/layout/Navbar';
import SlideShow from './components/public/SlideShow';
import AboutPage from './components/public/AboutPage';
import AboutUs from './components/public/AboutUs';
import ContactUs from './components/public/ContactUs';
import Footer from './components/layout/Footer';
import SecondFooter from './components/layout/BlackFooter.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import AdminRegister from './pages/admin/Register.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import Register from './components/forms/RegisterForm.jsx';
import Login from './components/forms/LoginForm.jsx';
import Enroll from './components/public/Enrollment.jsx'
import StudentEmailForm from './components/public/StudentEmailForm.jsx'
import ForgotPassword from './components/forms/ForgotPassword.jsx'
import UserSettings from './pages/user/Settings.jsx'
import StudentRegister from './pages/student/Register.jsx'
import StudentLogin from './pages/student/Login.jsx'


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

          <Route path = "/public/course" element = {
            <div>
              <Navbar />
              <Homepage />
              <SecondFooter />
            </div>
          }/>

          {/* Admin pages */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          
          <Route path = "/admin/dashboard" element = {
            <div>
               <AdminDashboard />
            </div>
          }/>

          {/* About Us page */}
          <Route path="/public/aboutus" element={
            <div>
              <Navbar />
              <AboutUs />
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

          {/* Claim Student Email */}
          <Route path="/public/claim-email" element={
            <div>
              <Navbar />
              <StudentEmailForm />
            </div>
          }/>

          {/* Forgot Password */}
          <Route path="/public/forgot-password" element={
            <div>
              <Navbar />
              <ForgotPassword />
            </div>
          }/>

          {/* Student pages */}
          <Route path="/student/register" element={
            <div>
              <Navbar />
              <StudentRegister />
            </div>
          } />
          <Route path="/student/login" element={
            <div>
              <Navbar />
              <StudentLogin />
            </div>
          } />

          {/* User Settings */}
          <Route path="/user/settings" element={
            <div>
              <Navbar />
              <UserSettings />
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
