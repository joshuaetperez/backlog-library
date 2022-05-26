import Footer from './components/Footer';
import Header from './components/Header';
import HomePage from './components/HomePage';
import './styles/style.css';

function App() {
  return (
    <div className="container-fluid d-flex flex-column min-vh-100 p-0">
      <Header />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
