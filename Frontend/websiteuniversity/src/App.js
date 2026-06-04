import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import SlideShow from './components/SlideShow';
import AboutPage from './components/AboutPage';
import ContactUs from './components/ContactUs';
import Footer from './components/Footers';


function App() {
  return (

      <div>
      <Navbar></Navbar>
      <SlideShow></SlideShow>
      <AboutPage></AboutPage>
      <ContactUs></ContactUs>
      <Footer></Footer>
      
    </div>
  );
}

export default App;
