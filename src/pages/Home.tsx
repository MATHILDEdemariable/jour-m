
import { Navigate } from 'react-router-dom';

const Home = () => {
  // Redirection vers la page d'accueil simplifiée
  return <Navigate to="/" replace />;
};

export default Home;
