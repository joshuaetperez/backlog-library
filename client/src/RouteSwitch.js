import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import './style.css';

const RouteSwitch = () => {
  return (
    <div className="container-fluid d-flex flex-column min-vh-100 p-0">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default RouteSwitch;
