import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertiesApi } from '../services/api';
import { Property, UpdatePropertyDTO } from '../types/property';
import PropertyForm from '../components/PropertyForm';

/**
 * EditProperty Page
 * Page d'édition d'une propriété existante
 */

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await propertiesApi.getById(id);
      setProperty(data);
    } catch (err) {
      console.error('Error loading property:', err);
      alert('Impossible de charger l\'annonce');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UpdatePropertyDTO) => {
    if (!id) return;

    try {
      await propertiesApi.update(id, data);
      // Rediriger vers la page de détail après modification
      navigate(`/properties/${id}`);
    } catch (error) {
      console.error('Error updating property:', error);
      throw error; // Laisser le formulaire gérer l'erreur
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/properties/${id}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Chargement...</h2>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="empty-state">
        <h2>Annonce introuvable</h2>
      </div>
    );
  }

  return (
    <div>
      <PropertyForm
        initialData={property}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={true}
      />
    </div>
  );
}