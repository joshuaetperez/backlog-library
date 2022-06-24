import {useContext} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {myContext} from './components/Context';
import Welcome from './components/Welcome';
import UserHome from './components/UserHomeComponents/UserHome';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import CategoryPage from './components/UserHomeComponents/CategoryPage';
import Container from 'react-bootstrap/Container';
import './style.css';

const RouteSwitch = () => {
  const isUserLoggedIn = useContext(myContext);

  // isUserLoggedIn is only undefined before context is updated with fetched user data
  // In this case, display just the header (without buttons) and the footer while waiting for isUserLoggedIn to be filled with a value
  if (isUserLoggedIn === undefined) {
    return (
      <Container fluid className="d-flex flex-column min-vh-100 p-0">
        <BrowserRouter>
          <Header />
          <div className="container-fluid bg-light d-flex flex-grow-1"></div>
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
          {isUserLoggedIn ? (
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
            </>
          ) : (
            <>
              <Route path="/" element={<Welcome />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </>
          )}
        </Routes>
        <Footer />
      </BrowserRouter>
    </Container>
  );
};

export default RouteSwitch;
