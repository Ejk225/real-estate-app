import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { propertiesService } from '../services/properties.service';
import {
  createPropertySchema,
  updatePropertySchema,
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyIdInput
} from '../schemas/property.schema';
import { ZodError } from 'zod';

/**
 * Routes Layer - Points d'entrée de l'API
 * 
 * Architecture scalable :
 * - Délègue la logique au service
 * - Gère validation et réponses HTTP
 * - Facile d'ajouter de nouvelles routes
 */

export async function propertiesRoutes(fastify: FastifyInstance) {
  
  /**
   * GET /properties
   * Récupère toutes les propriétés (avec filtres optionnels)
   */
  fastify.get('/properties', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { city, type, minPrice, maxPrice } = request.query as any;

      // Si des filtres sont présents, utiliser la méthode de filtrage
      if (city || type || minPrice || maxPrice) {
        const filters = {
          city,
          type,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined
        };
        const properties = await propertiesService.filterProperties(filters);
        return reply.code(200).send(properties);
      }

      // Sinon, retourner toutes les propriétés
      const properties = await propertiesService.getAllProperties();
      return reply.code(200).send(properties);
    } catch (error) {
      return reply.code(500).send({ 
        error: 'Erreur lors de la récupération des propriétés' 
      });
    }
  });

  /**
   * GET /properties/:id
   * Récupère une propriété par ID
   */
  fastify.get<{ Params: PropertyIdInput }>(
    '/properties/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const property = await propertiesService.getPropertyById(id);

        if (!property) {
          return reply.code(404).send({ 
            error: 'Propriété non trouvée' 
          });
        }

        return reply.code(200).send(property);
      } catch (error) {
        return reply.code(500).send({ 
          error: 'Erreur lors de la récupération de la propriété' 
        });
      }
    }
  );

  /**
   * POST /properties
   * Crée une nouvelle propriété
   */
  fastify.post<{ Body: CreatePropertyInput }>(
    '/properties',
    async (request, reply) => {
      try {
        // Validation manuelle avec Zod
        const validatedData = createPropertySchema.parse(request.body);
        
        const property = await propertiesService.createProperty(validatedData);
        return reply.code(201).send(property);
      } catch (error: any) {
        // Gestion des erreurs de validation Zod
        if (error instanceof ZodError) {
          return reply.code(400).send({
            error: 'Données invalides',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          });
        }
        return reply.code(500).send({ 
          error: 'Erreur lors de la création de la propriété' 
        });
      }
    }
  );

  /**
   * PUT /properties/:id
   * Met à jour une propriété existante
   */
  fastify.put<{ Params: PropertyIdInput; Body: UpdatePropertyInput }>(
    '/properties/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        
        // Validation manuelle avec Zod
        const validatedData = updatePropertySchema.parse(request.body);
        
        const property = await propertiesService.updateProperty(id, validatedData);

        if (!property) {
          return reply.code(404).send({ 
            error: 'Propriété non trouvée' 
          });
        }

        return reply.code(200).send(property);
      } catch (error: any) {
        if (error instanceof ZodError) {
          return reply.code(400).send({
            error: 'Données invalides',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          });
        }
        return reply.code(500).send({ 
          error: 'Erreur lors de la mise à jour de la propriété' 
        });
      }
    }
  );

  /**
   * DELETE /properties/:id
   * Supprime une propriété
   */
  fastify.delete<{ Params: PropertyIdInput }>(
    '/properties/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const deleted = await propertiesService.deleteProperty(id);

        if (!deleted) {
          return reply.code(404).send({ 
            error: 'Propriété non trouvée' 
          });
        }

        return reply.code(200).send({ 
          message: 'Propriété supprimée avec succès' 
        });
      } catch (error) {
        return reply.code(500).send({ 
          error: 'Erreur lors de la suppression de la propriété' 
        });
      }
    }
  );
}