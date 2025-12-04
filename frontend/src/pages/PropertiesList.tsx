import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesApi } from '../services/api';
import { Property } from '../types/property';
import PropertyCard from '../components/PropertyCard';

/**
 * PropertiesList Page
 * Affiche la liste des propriétés avec filtres et pagination
 */

const ITEMS_PER_PAGE = 6; // Nombre d'annonces par page

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États des filtres
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'rent'>('all');

  // État de la pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadProperties();
  }, [cityFilter, typeFilter]);

  // Réinitialiser la page quand on change les filtres
  useEffect(() => {
    setCurrentPage(1);
  }, [cityFilter, typeFilter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {};
      if (cityFilter) filters.city = cityFilter;
      if (typeFilter !== 'all') filters.type = typeFilter;

      const data = await propertiesApi.getAll(filters);
      setProperties(data);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Impossible de charger les annonces. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await propertiesApi.delete(id);
      await loadProperties();
      // Si on supprime le dernier item d'une page, revenir à la page précédente
      if (currentProperties.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Erreur lors de la suppression de l\'annonce');
    }
  };

  const handleClearFilters = () => {
    setCityFilter('');
    setTypeFilter('all');
  };

  // Calculs de pagination
  const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProperties = properties.slice(startIndex, endIndex);

  // Fonctions de navigation
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Chargement des annonces...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h2>❌ Erreur</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadProperties}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Nos Annonces</h1>
        <Link to="/create" className="btn btn-primary">
          + Créer une annonce
        </Link>
      </div>

      {/* Filtres */}
      <div className="filters">
        <div className="filters-grid">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="cityFilter" className="form-label">
              Ville
            </label>
            <input
              type="text"
              id="cityFilter"
              className="form-input"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Filtrer par ville..."
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="typeFilter" className="form-label">
              Type
            </label>
            <select
              id="typeFilter"
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="all">Tous</option>
              <option value="sale">Vente</option>
              <option value="rent">Location</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              className="btn btn-secondary"
              onClick={handleClearFilters}
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Liste des propriétés */}
      {properties.length === 0 ? (
        <div className="empty-state">
          <h2>Aucune annonce trouvée</h2>
          <p>
            {cityFilter || typeFilter !== 'all' 
              ? 'Essayez de modifier vos filtres' 
              : 'Commencez par créer votre première annonce'}
          </p>
          <Link to="/create" className="btn btn-primary">
            Créer une annonce
          </Link>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: '#6b7280' }}>
            {properties.length} annonce{properties.length > 1 ? 's' : ''} trouvée{properties.length > 1 ? 's' : ''}
            {totalPages > 1 && ` • Page ${currentPage} sur ${totalPages}`}
          </div>

          {/* Grid des annonces */}
          <div className="properties-grid">
            {currentProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                ← Précédent
              </button>

              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}