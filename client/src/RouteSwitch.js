import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App';
import Header from './components/Header';
import Footer from './components/Footer';
import './style.css';

const RouteSwitch = () => {
  return (
    <div className="container-fluid d-flex flex-column min-vh-100 p-0">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
};

export default RouteSwitch;
