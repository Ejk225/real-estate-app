import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertiesApi } from '../services/api';
import { Property } from '../types/property';

/**
 * PropertyDetail Page
 * Affiche les détails complets d'une propriété
 */

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await propertiesApi.getById(id);
      setProperty(data);
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Impossible de charger l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!property) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${property.title}" ?`)) {
      try {
        await propertiesApi.delete(property.id);
        navigate('/');
      } catch (err) {
        console.error('Error deleting property:', err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Chargement...</h2>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="empty-state">
        <h2>❌ Erreur</h2>
        <p>{error || 'Annonce introuvable'}</p>
        <Link to="/" className="btn btn-primary">
          Retour aux annonces
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/" className="navbar-link">
          ← Retour aux annonces
        </Link>
      </div>

      <div className="property-detail">
        <div className="property-detail-header">
          <div>
            <h1 className="property-detail-title">{property.title}</h1>
            <span className={`property-card-badge ${property.type}`}>
              {property.type === 'sale' ? 'Vente' : 'Location'}
            </span>
          </div>
          <div className="property-detail-price">
            {formatPrice(property.price)}
            {property.type === 'rent' && ' /mois'}
          </div>
        </div>

        <div className="property-detail-section">
          <h2 className="property-detail-section-title">Informations principales</h2>
          <div className="property-detail-grid">
            <div className="property-detail-item">
              <div className="property-detail-item-label">Ville</div>
              <div className="property-detail-item-value">📍 {property.city}</div>
            </div>
            <div className="property-detail-item">
              <div className="property-detail-item-label">Adresse</div>
              <div className="property-detail-item-value">{property.address}</div>
            </div>
            <div className="property-detail-item">
              <div className="property-detail-item-label">Surface</div>
              <div className="property-detail-item-value">📐 {property.surface} m²</div>
            </div>
            <div className="property-detail-item">
              <div className="property-detail-item-label">Pièces</div>
              <div className="property-detail-item-value">🛏️ {property.rooms}</div>
            </div>
          </div>
        </div>

        <div className="property-detail-section">
          <h2 className="property-detail-section-title">Description</h2>
          <p style={{ lineHeight: '1.8', color: '#374151' }}>
            {property.description}
          </p>
        </div>

        <div className="property-detail-section">
          <h2 className="property-detail-section-title">Informations complémentaires</h2>
          <div className="property-detail-grid">
            <div className="property-detail-item">
              <div className="property-detail-item-label">Créé le</div>
              <div className="property-detail-item-value">
                {formatDate(property.createdAt)}
              </div>
            </div>
            <div className="property-detail-item">
              <div className="property-detail-item-label">Mis à jour le</div>
              <div className="property-detail-item-value">
                {formatDate(property.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="property-detail-actions">
          <button
            onClick={() => navigate(`/edit/${property.id}`)}
            className="btn btn-primary btn-lg"
          >
            Modifier
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger btn-lg"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}