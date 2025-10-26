import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth';
import { materialsRoutes } from './routes/materials';
import { progressRoutes } from './routes/progress';
import { leaderboardRoutes } from './routes/leaderboard';
import { profileRoutes } from './routes/profile';
import { adminRoutes } from './routes/admin';

type Bindings = {
  DB: D1Database;
  STORAGE: R2Bucket;
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (c) => {
  return c.json({ 
    message: 'Main Web API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/*',
      materials: '/api/materials/*',
      progress: '/api/progress/*',
      leaderboard: '/api/leaderboard',
      profile: '/api/profile/*',
      admin: '/api/admin/*'
    }
  });
});

app.route('/api/auth', authRoutes);
app.route('/api/materials', materialsRoutes);
app.route('/api/progress', progressRoutes);
app.route('/api/leaderboard', leaderboardRoutes);
app.route('/api/profile', profileRoutes);
app.route('/api/admin', adminRoutes);

// Serve R2 storage files (avatars, etc)
app.get('/storage/*', async (c) => {
  const path = c.req.path.replace('/storage/', '');
  const object = await c.env.STORAGE.get(path);
  
  if (!object) {
    return c.notFound();
  }
  
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000');
  
  return new Response(object.body, { headers });
});

export default app;
