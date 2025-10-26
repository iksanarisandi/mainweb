import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { z } from 'zod';

const materialSchema = z.object({
  title: z.string().min(1),
  category: z.enum(['HTML', 'CSS', 'JavaScript', 'DOM', 'Project']),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  order_index: z.number(),
  content: z.string().min(1),
  code_example: z.string().optional(),
  challenge_question: z.string().optional(),
  challenge_expected: z.string().optional(),
  challenge_hint: z.string().optional(),
  points: z.number().default(10),
  status: z.enum(['published', 'draft']).default('published'),
});

type Bindings = {
  DB: D1Database;
  STORAGE: R2Bucket;
};

export const adminRoutes = new Hono<{ Bindings: Bindings }>();

adminRoutes.use('/*', authMiddleware, adminMiddleware);

adminRoutes.get('/materials', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM materials ORDER BY category, order_index'
  ).all();
  
  return c.json({ materials: results });
});

adminRoutes.post('/materials', async (c) => {
  try {
    const body = await c.req.json();
    const validated = materialSchema.parse(body);
    
    const result = await c.env.DB.prepare(`
      INSERT INTO materials (
        title, category, level, order_index, content,
        code_example, challenge_question, challenge_expected,
        challenge_hint, points, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      validated.title,
      validated.category,
      validated.level,
      validated.order_index,
      validated.content,
      validated.code_example || null,
      validated.challenge_question || null,
      validated.challenge_expected || null,
      validated.challenge_hint || null,
      validated.points,
      validated.status
    ).first();
    
    return c.json({ message: 'Material created', material: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', details: error.errors }, 400);
    }
    return c.json({ error: 'Failed to create material' }, 500);
  }
});

adminRoutes.put('/materials/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const validated = materialSchema.parse(body);
    
    await c.env.DB.prepare(`
      UPDATE materials SET
        title = ?, category = ?, level = ?, order_index = ?,
        content = ?, code_example = ?, challenge_question = ?,
        challenge_expected = ?, challenge_hint = ?, points = ?,
        status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      validated.title,
      validated.category,
      validated.level,
      validated.order_index,
      validated.content,
      validated.code_example || null,
      validated.challenge_question || null,
      validated.challenge_expected || null,
      validated.challenge_hint || null,
      validated.points,
      validated.status,
      id
    ).run();
    
    return c.json({ message: 'Material updated' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', details: error.errors }, 400);
    }
    return c.json({ error: 'Failed to update material' }, 500);
  }
});

adminRoutes.delete('/materials/:id', async (c) => {
  const id = c.req.param('id');
  
  await c.env.DB.prepare('DELETE FROM materials WHERE id = ?').bind(id).run();
  
  return c.json({ message: 'Material deleted' });
});

adminRoutes.get('/users', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      id, email, username, role, level, points,
      current_streak, longest_streak, created_at
    FROM users
    ORDER BY created_at DESC
  `).all();
  
  return c.json({ users: results });
});

adminRoutes.get('/badges', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM badges ORDER BY condition_value'
  ).all();
  
  return c.json({ badges: results });
});

adminRoutes.post('/badges', async (c) => {
  const { name, description, icon_url, condition_type, condition_value, condition_category } = await c.req.json();
  
  const result = await c.env.DB.prepare(`
    INSERT INTO badges (name, description, icon_url, condition_type, condition_value, condition_category)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(name, description, icon_url, condition_type, condition_value, condition_category || null).first();
  
  return c.json({ message: 'Badge created', badge: result });
});

adminRoutes.get('/stats', async (c) => {
  const totalUsers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
  const totalMaterials = await c.env.DB.prepare('SELECT COUNT(*) as count FROM materials').first();
  const totalCompletions = await c.env.DB.prepare('SELECT COUNT(*) as count FROM progress WHERE completed = 1').first();
  const totalBadges = await c.env.DB.prepare('SELECT COUNT(*) as count FROM badges').first();
  
  return c.json({
    total_users: totalUsers.count,
    total_materials: totalMaterials.count,
    total_completions: totalCompletions.count,
    total_badges: totalBadges.count
  });
});
