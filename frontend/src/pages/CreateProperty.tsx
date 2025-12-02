import { useNavigate } from 'react-router-dom';
import { propertiesApi } from '../services/api';
import { CreatePropertyDTO } from '../types/property';
import PropertyForm from '../components/PropertyForm';

/**
 * CreateProperty Page
 * Page de création d'une nouvelle propriété
 */

export default function CreateProperty() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreatePropertyDTO) => {
    try {
      const newProperty = await propertiesApi.create(data);
      // Rediriger vers la page de détail de la propriété créée
      navigate(`/properties/${newProperty.id}`);
    } catch (error) {
      console.error('Error creating property:', error);
      throw error; // Laisser le formulaire gérer l'erreur
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div>
      <PropertyForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={false}
      />
    </div>
  );
}