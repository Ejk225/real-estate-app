/**
 * Types pour les propriétés immobilières
 * Ces types sont dérivés des schémas Zod pour garantir la cohérence
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