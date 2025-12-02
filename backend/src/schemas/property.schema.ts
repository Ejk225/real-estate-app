import { z } from 'zod';

/**
 * Schémas de validation Zod
 * Assurent la validation des données entrantes
 * et génèrent automatiquement les types TypeScript
 */

// Schéma pour la création d'une propriété
export const createPropertySchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(100),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  price: z.number().positive("Le prix doit être positif"),
  surface: z.number().positive("La surface doit être positive"),
  rooms: z.number().int().positive("Le nombre de pièces doit être un entier positif"),
  type: z.enum(['sale', 'rent'], {
    errorMap: () => ({ message: "Le type doit être 'sale' ou 'rent'" })
  })
});

// Schéma pour la mise à jour (tous les champs optionnels)
export const updatePropertySchema = createPropertySchema.partial();

// Schéma pour les paramètres d'ID
export const propertyIdSchema = z.object({
  id: z.string().uuid("L'ID doit être un UUID valide")
});

// Export des types inférés
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyIdInput = z.infer<typeof propertyIdSchema>;