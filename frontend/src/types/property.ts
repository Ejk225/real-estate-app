/**
 * Types partagés avec le backend
 * Idéalement, ces types devraient être dans un package partagé
 * Pour ce test, on les duplique pour garder la simplicité
 */

export type PropertyType = 'sale' | 'rent';

export interface Property {
  id: string;
  title: string;
  description: string;
  city: string;
  address: string;
  price: number;
  surface: number;
  rooms: number;
  type: PropertyType;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyDTO {
  title: string;
  description: string;
  city: string;
  address: string;
  price: number;
  surface: number;
  rooms: number;
  type: PropertyType;
}

export interface UpdatePropertyDTO {
  title?: string;
  description?: string;
  city?: string;
  address?: string;
  price?: number;
  surface?: number;
  rooms?: number;
  type?: PropertyType;
}