import { useNavigate } from 'react-router-dom';
import { Property } from '../types/property';
import { motion } from 'framer-motion';

/**
 * PropertyCard Component
 * Affiche une carte pour une propriété avec actions
 */

interface PropertyCardProps {
  property: Property;
  onDelete?: (id: string) => void;
}

export default function PropertyCard({ property, onDelete }: PropertyCardProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleView = () => {
    navigate(`/properties/${property.id}`);
  };

  const handleEdit = () => {
    navigate(`/edit/${property.id}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${property.title}" ?`)) {
      onDelete?.(property.id);
    }
  };

  return (

    <motion.div
      className="property-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      >
      
      
      <div className="property-card">
        <div className="property-card-header">
          <h3 className="property-card-title">{property.title}</h3>
          <span className={`property-card-badge ${property.type}`}>
            {property.type === 'sale' ? 'Vente' : 'Location'}
          </span>
        </div>

        <div className="property-card-body">
          <div className="property-card-info">
            <div className="property-card-info-item">
              <span>📍</span>
              <span>{property.city}</span>
            </div>
            <div className="property-card-info-item">
              <span>📐</span>
              <span>{property.surface} m²</span>
            </div>
            <div className="property-card-info-item">
              <span>🛏️</span>
              <span>{property.rooms} pièces</span>
            </div>
          </div>

          <div className="property-card-price">
            {formatPrice(property.price)}
            {property.type === 'rent' && ' /mois'}
          </div>

          <div className="property-card-actions">
            <button onClick={handleView} className="btn btn-primary btn-sm">
              Voir
            </button>
            <button onClick={handleEdit} className="btn btn-secondary btn-sm">
              Modifier
            </button>
            {onDelete && (
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  
}

