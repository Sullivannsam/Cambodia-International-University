import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import SlideShow from './components/SlideShow';
import Footer from './components/Footers';


function App() {
  return (
    <div>
      <Navbar></Navbar>
      <SlideShow></SlideShow>
      <Footer></Footer>
    </div>
  );
}

export default App;
