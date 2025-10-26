import { Hono } from 'hono';
import { authMiddleware, AuthUser } from '../middleware/auth';

type Bindings = {
  DB: D1Database;
  STORAGE: R2Bucket;
};

export const profileRoutes = new Hono<{ Bindings: Bindings }>();

profileRoutes.use('/*', authMiddleware);

profileRoutes.get('/me', async (c) => {
  const user = c.get('user') as AuthUser;
  
  const profile = await c.env.DB.prepare(`
    SELECT 
      id, email, username, avatar_url, role,
      level, points, current_streak, longest_streak,
      last_activity_date, created_at
    FROM users WHERE id = ?
  `).bind(user.id).first();
  
  const badges = await c.env.DB.prepare(`
    SELECT 
      b.id, b.name, b.description, b.icon_url,
      ub.unlocked_at
    FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = ?
    ORDER BY ub.unlocked_at DESC
  `).bind(user.id).all();
  
  const completedCount = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM progress WHERE user_id = ? AND completed = 1'
  ).bind(user.id).first();
  
  return c.json({
    profile,
    badges: badges.results,
    stats: {
      lessons_completed: completedCount.count
    }
  });
});

profileRoutes.get('/:username', async (c) => {
  const username = c.req.param('username');
  
  const profile = await c.env.DB.prepare(`
    SELECT 
      id, username, avatar_url,
      level, points, current_streak, longest_streak,
      created_at
    FROM users WHERE username = ?
  `).bind(username).first();
  
  if (!profile) {
    return c.json({ error: 'User not found' }, 404);
  }
  
  const badges = await c.env.DB.prepare(`
    SELECT 
      b.id, b.name, b.description, b.icon_url,
      ub.unlocked_at
    FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = ?
    ORDER BY ub.unlocked_at DESC
  `).bind(profile.id).all();
  
  const completedCount = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM progress WHERE user_id = ? AND completed = 1'
  ).bind(profile.id).first();
  
  return c.json({
    profile,
    badges: badges.results,
    stats: {
      lessons_completed: completedCount.count
    }
  });
});

profileRoutes.post('/avatar', async (c) => {
  const user = c.get('user') as AuthUser;
  const formData = await c.req.formData();
  const file = formData.get('avatar') as File;
  
  if (!file) {
    return c.json({ error: 'No file provided' }, 400);
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP allowed' }, 400);
  }
  
  if (file.size > 2 * 1024 * 1024) {
    return c.json({ error: 'File size must be less than 2MB' }, 400);
  }
  
  const fileExtension = file.name.split('.').pop();
  const fileName = `avatars/${user.id}-${Date.now()}.${fileExtension}`;
  
  const arrayBuffer = await file.arrayBuffer();
  await c.env.STORAGE.put(fileName, arrayBuffer, {
    httpMetadata: {
      contentType: file.type,
    },
  });
  
  const avatarUrl = `/storage/${fileName}`;
  
  await c.env.DB.prepare(
    'UPDATE users SET avatar_url = ?, updated_at = datetime("now") WHERE id = ?'
  ).bind(avatarUrl, user.id).run();
  
  return c.json({
    message: 'Avatar uploaded successfully',
    avatar_url: avatarUrl
  });
});

profileRoutes.get('/streak-history', async (c) => {
  const user = c.get('user') as AuthUser;
  
  const { results } = await c.env.DB.prepare(`
    SELECT date, activities_count
    FROM streak_history
    WHERE user_id = ?
    ORDER BY date DESC
    LIMIT 30
  `).bind(user.id).all();
  
  return c.json({ history: results });
});
