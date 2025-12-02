import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '../types/property.types';
import propertiesData from '../data/properties.json';
import { randomUUID } from 'crypto';

/**
 * Service Layer - Logique métier
 * 
 * Architecture scalable : 
 * - Séparation de la logique métier des routes
 * - Facile à tester unitairement
 * - Prêt pour l'ajout d'une vraie DB (remplacer le tableau par un Repository)
 */

class PropertiesService {
  // Simulation d'une base de données en mémoire
private properties: Property[];

constructor() {
    const isPropertyType = (t: any): t is Property['type'] =>
        t === 'sale' || t === 'rent';

    this.properties = (propertiesData as any[]).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        city: p.city,
        address: p.address,
        price: p.price,
        surface: p.surface,
        rooms: p.rooms,
        // garantir que la valeur respecte le type attendu (sale | rent), fallback à 'sale' si invalide
        type: isPropertyType(p.type) ? p.type : 'sale',
        createdAt: p.createdAt ?? new Date().toISOString(),
        updatedAt: p.updatedAt ?? new Date().toISOString()
    })) as Property[];
}

  /**
   * Récupère toutes les propriétés
   * Peut être étendu avec filtres, pagination, tri
   */
  async getAllProperties(): Promise<Property[]> {
    return this.properties;
  }

  /**
   * Récupère une propriété par ID
   */
  async getPropertyById(id: string): Promise<Property | null> {
    const property = this.properties.find(p => p.id === id);
    return property || null;
  }

  /**
   * Crée une nouvelle propriété
   */
  async createProperty(data: CreatePropertyDTO): Promise<Property> {
    const newProperty: Property = {
      id: randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.properties.push(newProperty);
    return newProperty;
  }

  /**
   * Met à jour une propriété existante
   */
  async updateProperty(id: string, data: UpdatePropertyDTO): Promise<Property | null> {
    const index = this.properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedProperty: Property = {
      ...this.properties[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.properties[index] = updatedProperty;
    return updatedProperty;
  }

  /**
   * Supprime une propriété
   */
  async deleteProperty(id: string): Promise<boolean> {
    const index = this.properties.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }

    this.properties.splice(index, 1);
    return true;
  }

  /**
   * Filtre les propriétés (bonus pour scalabilité)
   * Exemple d'extension facile du service
   */
  async filterProperties(filters: {
    city?: string;
    type?: 'sale' | 'rent';
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Property[]> {
    let filtered = [...this.properties];

    if (filters.city) {
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }

    return filtered;
  }
}

// Export d'une instance unique (Singleton pattern)
export const propertiesService = new PropertiesService();