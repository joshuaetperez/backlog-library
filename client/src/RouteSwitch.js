import {useContext} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {myContext} from './components/Context';
import Welcome from './components/Welcome';
import UserHome from './components/UserHome';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import './style.css';

const RouteSwitch = () => {
  const isUserLoggedIn = useContext(myContext);

  // isUserLoggedIn is only undefined before context is updated with fetched user data
  // In this case, display just the header (without buttons) and the footer while waiting for isUserLoggedIn to be filled with a value
  if (isUserLoggedIn === undefined) {
    return (
      <div className="container-fluid d-flex flex-column min-vh-100 p-0">
        <BrowserRouter>
          <Header />
          <div className="container-fluid bg-light d-flex flex-grow-1"></div>
          <Footer />
        </BrowserRouter>
      </div>
    );
  }
  return (
    <div className="container-fluid d-flex flex-column min-vh-100 p-0">
      <BrowserRouter>
        <Header />
        <Routes>
          {isUserLoggedIn ? (
            <>
              <Route path="/" element={<UserHome />} />
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/signup" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default RouteSwitch;
