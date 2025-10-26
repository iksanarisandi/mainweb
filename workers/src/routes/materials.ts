import { Hono } from 'hono';
import { authMiddleware, AuthUser } from '../middleware/auth';

type Bindings = {
  DB: D1Database;
};

export const materialsRoutes = new Hono<{ Bindings: Bindings }>();

materialsRoutes.use('/*', authMiddleware);

materialsRoutes.get('/', async (c) => {
  const user = c.get('user') as AuthUser;
  const category = c.req.query('category');
  
  let query = `
    SELECT 
      m.*,
      COALESCE(p.completed, 0) as user_completed
    FROM materials m
    LEFT JOIN progress p ON m.id = p.material_id AND p.user_id = ?
    WHERE m.status = 'published'
  `;
  
  const params: any[] = [user.id];
  
  if (category) {
    query += ' AND m.category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY m.order_index ASC';
  
  const { results } = await c.env.DB.prepare(query).bind(...params).all();
  
  return c.json({ materials: results });
});

materialsRoutes.get('/:id', async (c) => {
  const user = c.get('user') as AuthUser;
  const id = c.req.param('id');
  
  const material = await c.env.DB.prepare(`
    SELECT 
      m.*,
      COALESCE(p.completed, 0) as user_completed,
      p.code_submitted
    FROM materials m
    LEFT JOIN progress p ON m.id = p.material_id AND p.user_id = ?
    WHERE m.id = ? AND m.status = 'published'
  `).bind(user.id, id).first();
  
  if (!material) {
    return c.json({ error: 'Material not found' }, 404);
  }
  
  return c.json({ material });
});

materialsRoutes.get('/stats/summary', async (c) => {
  const user = c.get('user') as AuthUser;
  
  const totalMaterials = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM materials WHERE status = ?'
  ).bind('published').first();
  
  const completedMaterials = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM progress WHERE user_id = ? AND completed = 1'
  ).bind(user.id).first();
  
  const categoryProgress = await c.env.DB.prepare(`
    SELECT 
      m.category,
      COUNT(m.id) as total,
      COUNT(CASE WHEN p.completed = 1 THEN 1 END) as completed
    FROM materials m
    LEFT JOIN progress p ON m.id = p.material_id AND p.user_id = ?
    WHERE m.status = 'published'
    GROUP BY m.category
  `).bind(user.id).all();
  
  return c.json({
    total: totalMaterials.count,
    completed: completedMaterials.count,
    progress: Math.round((completedMaterials.count / totalMaterials.count) * 100),
    categories: categoryProgress.results
  });
});
