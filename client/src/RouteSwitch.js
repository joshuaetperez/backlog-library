import {useContext} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {myContext} from './components/Context';
import Welcome from './components/Welcome';
import UserHome from './components/UserHome/UserHome';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/UserAuthentication/Login';
import Signup from './components/UserAuthentication/Signup';
import Reverify from './components/UserAuthentication/Reverify';
import ForgotPassword from './components/UserAuthentication/ForgotPassword';
import ResetPassword from './components/UserAuthentication/ResetPassword';
import Settings from './components/UserHome/SettingsComponents/Settings';
import CategoryPage from './components/UserHome/Category/CategoryPage';
import Container from 'react-bootstrap/Container';
import './style.css';

const RouteSwitch = () => {
  const user = useContext(myContext);

  // user is only undefined before context is updated with fetched user data
  // In this case, display just the header (without buttons) and the footer while waiting for user to be filled with a value
  if (user === undefined) {
    return (
      <Container fluid className="d-flex flex-column min-vh-100 p-0">
        <BrowserRouter>
          <Header />
          <Container fluid className="bg-light d-flex flex-grow-1"></Container>
          <Footer />
        </BrowserRouter>
      </Container>
    );
  }
  return (
    <Container fluid className="d-flex flex-column min-vh-100 p-0">
      <BrowserRouter>
        <Header />
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<UserHome />}>
                <Route path="movies" element={<CategoryPage />} />
                <Route path="tv" element={<CategoryPage />} />
                <Route path="anime" element={<CategoryPage />} />
                <Route path="manga" element={<CategoryPage />} />
                <Route path="games" element={<CategoryPage />} />
                <Route path="books" element={<CategoryPage />} />
              </Route>
              <Route path="login" element={<Navigate to="/" />} />
              <Route path="signup" element={<Navigate to="/" />} />
              <Route path="reverify" element={<Navigate to="/" />} />
              <Route path="forgot-password" element={<Navigate to="/" />} />
              <Route
                path="reset-password/:token"
                element={<Navigate to="/" />}
              />
              <Route path="settings" element={<Settings />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Welcome />} />
              <Route path="movies" element={<Navigate to="/" />} />
              <Route path="tv" element={<Navigate to="/" />} />
              <Route path="anime" element={<Navigate to="/" />} />
              <Route path="manga" element={<Navigate to="/" />} />
              <Route path="games" element={<Navigate to="/" />} />
              <Route path="books" element={<Navigate to="/" />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="reverify" element={<Reverify />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route path="settings" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
        <Footer />
      </BrowserRouter>
    </Container>
  );
};

export default RouteSwitch;
