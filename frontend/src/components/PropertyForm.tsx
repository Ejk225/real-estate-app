import { useState, useEffect } from 'react';
import { Property, CreatePropertyDTO, PropertyType } from '../types/property';

/**
 * PropertyForm Component
 * Formulaire réutilisable pour créer/éditer une propriété
 */

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: CreatePropertyDTO) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function PropertyForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isEdit = false 
}: PropertyFormProps) {
  const [formData, setFormData] = useState<CreatePropertyDTO>({
    title: '',
    description: '',
    city: '',
    address: '',
    price: 0,
    surface: 0,
    rooms: 1,
    type: 'sale' as PropertyType
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        city: initialData.city,
        address: initialData.address,
        price: initialData.price,
        surface: initialData.surface,
        rooms: initialData.rooms,
        type: initialData.type
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Conversion en nombre pour les champs numériques
    const processedValue = ['price', 'surface', 'rooms'].includes(name) 
      ? Number(value) 
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'La ville doit contenir au moins 2 caractères';
    }

    if (!formData.address || formData.address.length < 5) {
      newErrors.address = "L'adresse doit contenir au moins 5 caractères";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (!formData.surface || formData.surface <= 0) {
      newErrors.surface = 'La surface doit être supérieure à 0';
    }

    if (!formData.rooms || formData.rooms <= 0) {
      newErrors.rooms = 'Le nombre de pièces doit être supérieur à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      // Gestion des erreurs de validation du backend
      if (error.response?.data?.details) {
        const backendErrors: Record<string, string> = {};
        error.response.data.details.forEach((err: any) => {
          backendErrors[err.path[0]] = err.message;
        });
        setErrors(backendErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="page-title" style={{ marginBottom: '2rem' }}>
        {isEdit ? 'Modifier l\'annonce' : 'Créer une annonce'}
      </h2>

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Titre *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-input"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ex: Appartement moderne centre-ville"
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          className="form-textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Décrivez la propriété..."
        />
        {errors.description && <div className="form-error">{errors.description}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="city" className="form-label">
          Ville *
        </label>
        <input
          type="text"
          id="city"
          name="city"
          className="form-input"
          value={formData.city}
          onChange={handleChange}
          placeholder="Ex: Paris"
        />
        {errors.city && <div className="form-error">{errors.city}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="address" className="form-label">
          Adresse *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          className="form-input"
          value={formData.address}
          onChange={handleChange}
          placeholder="Ex: 15 rue de Rivoli, 75001"
        />
        {errors.address && <div className="form-error">{errors.address}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="type" className="form-label">
          Type *
        </label>
        <select
          id="type"
          name="type"
          className="form-select"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="sale">Vente</option>
          <option value="rent">Location</option>
        </select>
        {errors.type && <div className="form-error">{errors.type}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="price" className="form-label">
          Prix {formData.type === 'rent' ? '(€/mois)' : '(€)'} *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          className="form-input"
          value={formData.price || ''}
          onChange={handleChange}
          placeholder="Ex: 450000"
          min="0"
          step="100"
        />
        {errors.price && <div className="form-error">{errors.price}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="surface" className="form-label">
          Surface (m²) *
        </label>
        <input
          type="number"
          id="surface"
          name="surface"
          className="form-input"
          value={formData.surface || ''}
          onChange={handleChange}
          placeholder="Ex: 65"
          min="0"
          step="1"
        />
        {errors.surface && <div className="form-error">{errors.surface}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="rooms" className="form-label">
          Nombre de pièces *
        </label>
        <input
          type="number"
          id="rooms"
          name="rooms"
          className="form-input"
          value={formData.rooms || ''}
          onChange={handleChange}
          placeholder="Ex: 3"
          min="1"
          step="1"
        />
        {errors.rooms && <div className="form-error">{errors.rooms}</div>}
      </div>

      <div className="property-detail-actions">
        <button 
          type="submit" 
          className="btn btn-primary btn-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'En cours...' : (isEdit ? 'Mettre à jour' : 'Créer')}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary btn-lg"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}