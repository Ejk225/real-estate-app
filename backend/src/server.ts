import Fastify from 'fastify';
import cors from '@fastify/cors';
import { propertiesRoutes } from './routes/properties.routes';

/**
 * Configuration du serveur Fastify
 * 
 * Architecture scalable :
 * - Configuration centralisée
 * - Plugins modulaires
 * - Facile d'ajouter de nouvelles routes/middleware
 */

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
});

// Configuration CORS pour permettre les requêtes depuis le frontend
fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
});

// Enregistrement des routes
fastify.register(propertiesRoutes, { prefix: '/api' });

// Route de health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Gestion des erreurs globales
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  reply.status(error.statusCode || 500).send({
    error: error.message || 'Erreur interne du serveur',
    statusCode: error.statusCode || 500
  });
});

// Démarrage du serveur
const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    await fastify.listen({ port: Number(PORT), host: '0.0.0.0' });
    
    console.log('\n🚀 Serveur démarré avec succès !');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log(`📊 API: http://localhost:${PORT}/api/properties\n`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();