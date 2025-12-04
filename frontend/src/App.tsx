import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PropertiesList from './pages/PropertiesList';
import PropertyDetail from './pages/PropertyDetail';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';
import './styles.css';

/**
 * App Component
 * Configuration du routing et structure globale
 */

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<PropertiesList />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/create" element={<CreateProperty />} />
          <Route path="/edit/:id" element={<EditProperty />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;