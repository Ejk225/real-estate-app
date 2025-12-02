import axios from 'axios';
import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '../types/property';

/**
 * Service API - Centralise tous les appels backend
 * 
 * Architecture scalable :
 * - Toutes les requêtes HTTP en un seul endroit
 * - Facile de changer d'API ou d'ajouter de l'authentification
 * - Gestion centralisée des erreurs
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Instance Axios configurée
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Intercepteur pour gérer les erreurs globalement
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * API des propriétés
 */
export const propertiesApi = {
  /**
   * Récupère toutes les propriétés
   */
  getAll: async (filters?: {
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Property[]> => {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    const { data } = await apiClient.get<Property[]>(`/properties?${params}`);
    return data;
  },

  /**
   * Récupère une propriété par ID
   */
  getById: async (id: string): Promise<Property> => {
    const { data } = await apiClient.get<Property>(`/properties/${id}`);
    return data;
  },

  /**
   * Crée une nouvelle propriété
   */
  create: async (property: CreatePropertyDTO): Promise<Property> => {
    const { data } = await apiClient.post<Property>('/properties', property);
    return data;
  },

  /**
   * Met à jour une propriété
   */
  update: async (id: string, property: UpdatePropertyDTO): Promise<Property> => {
    const { data } = await apiClient.put<Property>(`/properties/${id}`, property);
    return data;
  },

  /**
   * Supprime une propriété
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  }
};