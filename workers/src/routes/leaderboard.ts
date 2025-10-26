import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = {
  DB: D1Database;
};

export const leaderboardRoutes = new Hono<{ Bindings: Bindings }>();

leaderboardRoutes.use('/*', authMiddleware);

leaderboardRoutes.get('/', async (c) => {
  const limit = parseInt(c.req.query('limit') || '50');
  
  const { results } = await c.env.DB.prepare(`
    SELECT 
      id,
      username,
      avatar_url,
      level,
      points,
      current_streak,
      longest_streak
    FROM users
    ORDER BY points DESC, level DESC
    LIMIT ?
  `).bind(limit).all();
  
  const leaderboard = results.map((user, index) => ({
    rank: index + 1,
    ...user
  }));
  
  return c.json({ leaderboard });
});

leaderboardRoutes.get('/global-stats', async (c) => {
  const totalUsers = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM users'
  ).first();
  
  const totalLessons = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM materials WHERE status = ?'
  ).bind('published').first();
  
  const totalCompletions = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM progress WHERE completed = 1'
  ).first();
  
  return c.json({
    total_users: totalUsers.count,
    total_lessons: totalLessons.count,
    total_completions: totalCompletions.count
  });
});
