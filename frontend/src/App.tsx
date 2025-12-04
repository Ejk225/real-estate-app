import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import PropertiesList from './pages/PropertiesList';
import PropertyDetail from './pages/PropertyDetail';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';
import './styles.css';

/**
 * App Component
 * Configuration du routing, React Query et structure globale
 */

// Configuration du QueryClient avec des options optimisées
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - Les données restent "fraîches"
      gcTime: 10 * 60 * 1000, // 10 minutes - Garbage collection
      retry: 1, // Réessayer 1 fois en cas d'échec
      refetchOnWindowFocus: false, // Ne pas refetch au focus (optionnel)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;