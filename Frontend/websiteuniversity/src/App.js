
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './components/public/Homepage.jsx'
import Navbar from './components/layout/Navbar';
import SlideShow from './components/public/SlideShow';
import AboutPage from './components/public/AboutPage';
import AboutUs from './components/public/AboutUs';
import ContactUs from './components/public/ContactUs';
import NewsSection from './components/public/NewsSection.jsx';
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
import ResetPassword from './pages/public/ResetPassword.jsx'
import UserSettings from './pages/user/Settings.jsx'
import StudentRegister from './pages/student/Register.jsx'
import StudentLogin from './pages/student/Login.jsx'
import StudentDashboard from './pages/student/Dashboard.jsx'
import TeacherRegister from './pages/teacher/Register.jsx'
import TeacherLogin from './pages/teacher/Login.jsx'
import TeacherDashboard from './pages/teacher/Dashboard.jsx'
import PaymentForm from './components/forms/PaymentForm.jsx'
import SuccessToast from './components/common/SuccessToast.jsx'
import NotFound from './pages/public/NotFound.jsx'
import Forbidden from './pages/public/Forbidden.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import CourseDetail from './pages/public/CourseDetail.jsx'
import NewsDetail from './pages/public/NewsDetail.jsx'
import NewsList from './pages/public/NewsList.jsx'
import Faq from './pages/public/Faq.jsx'
import AcademicCalendar from './pages/public/AcademicCalendar.jsx'
import Scholarships from './pages/public/Scholarships.jsx'
import Tuition from './pages/public/Tuition.jsx'
import Facilities from './pages/public/Facilities.jsx'
import Staff from './pages/public/Staff.jsx'
import ApplicationStatus from './pages/public/ApplicationStatus.jsx'

const withNavbar = (children) => (
  <div><Navbar />{children}<Footer /></div>
);

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
              <NewsSection />
              <Footer />
              <SuccessToast />
            </div>
          } />

          <Route path = "/public/course" element = {
            <div>
              <Navbar />
              <Homepage />
              <SecondFooter />
            </div>
          }/>

          <Route path="/public/course/:id" element={
            <div>
              <Navbar />
              <CourseDetail />
              <SecondFooter />
            </div>
          }/>

          <Route path="/public/news" element={
            <div>
              <Navbar />
              <NewsList />
              <Footer />
            </div>
          }/>

          <Route path="/public/news/:id" element={
            <div>
              <Navbar />
              <NewsDetail />
              <Footer />
            </div>
          }/>

          {/* Public info pages */}
          <Route path="/public/faq" element={withNavbar(<Faq />)} />
          <Route path="/public/calendar" element={withNavbar(<AcademicCalendar />)} />
          <Route path="/public/scholarships" element={withNavbar(<Scholarships />)} />
          <Route path="/public/tuition" element={withNavbar(<Tuition />)} />
          <Route path="/public/facilities" element={withNavbar(<Facilities />)} />
          <Route path="/public/staff" element={withNavbar(<Staff />)} />
          <Route path="/public/application-status" element={withNavbar(<ApplicationStatus />)} />

          {/* Admin pages */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={
            <ProtectedRoute role="ADMIN">
              <AdminRegister />
            </ProtectedRoute>
          } />
          
          <Route path = "/admin/dashboard" element = {
            <ProtectedRoute role="ADMIN">
              <div>
                <AdminDashboard />
                <SuccessToast />
              </div>
            </ProtectedRoute>
          }/>
          <Route path="/student/payments" element={
            <ProtectedRoute role="STUDENT">
              <PaymentForm />
            </ProtectedRoute>
          } />

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

          {/* Reset Password */}
          <Route path="/public/reset-password" element={
            <div>
              <Navbar />
              <ResetPassword />
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
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="STUDENT">
              <StudentDashboard />
              <SuccessToast />
            </ProtectedRoute>
          } />

          {/* Teacher pages */}
          <Route path="/teacher/register" element={
            <div>
              <Navbar />
              <TeacherRegister />
            </div>
          } />
          <Route path="/teacher/login" element={
            <div>
              <Navbar />
              <TeacherLogin />
            </div>
          } />
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute role="TEACHER">
              <TeacherDashboard />
              <SuccessToast />
            </ProtectedRoute>
          } />

          {/* User Settings */}
          <Route path="/user/settings" element={
            <div>
              <Navbar />
              <UserSettings />
            </div>
          }/>

          {/* Error pages */}
          <Route path="/404" element={<NotFound />} />
          <Route path="/403" element={<Forbidden />} />

          <Route path = "*" element = {<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
