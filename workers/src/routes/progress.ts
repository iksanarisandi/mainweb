import { Hono } from 'hono';
import { authMiddleware, AuthUser } from '../middleware/auth';
import { updateStreak, calculateLevel } from '../utils/streak';

type Bindings = {
  DB: D1Database;
};

export const progressRoutes = new Hono<{ Bindings: Bindings }>();

progressRoutes.use('/*', authMiddleware);

// GET /progress - Get user progress summary
progressRoutes.get('/', async (c) => {
  const user = c.get('user') as AuthUser;
  
  const completed = await c.env.DB.prepare(`
    SELECT material_id FROM progress WHERE user_id = ? AND completed = 1
  `).bind(user.id).all();
  
  const completedMaterials = completed.results.map(r => r.material_id);
  
  return c.json({ 
    completedMaterials,
    totalCompleted: completedMaterials.length
  });
});

progressRoutes.post('/submit', async (c) => {
  const user = c.get('user') as AuthUser;
  const { material_id, code_submitted } = await c.req.json();
  
  if (!material_id) {
    return c.json({ error: 'Material ID is required' }, 400);
  }
  
  const material = await c.env.DB.prepare(
    'SELECT id, points, challenge_expected FROM materials WHERE id = ?'
  ).bind(material_id).first();
  
  if (!material) {
    return c.json({ error: 'Material not found' }, 404);
  }
  
  const existingProgress = await c.env.DB.prepare(
    'SELECT completed FROM progress WHERE user_id = ? AND material_id = ?'
  ).bind(user.id, material_id).first();
  
  if (existingProgress?.completed) {
    return c.json({ message: 'Already completed', points: 0 });
  }
  
  const isCorrect = code_submitted?.trim() === material.challenge_expected?.trim();
  
  if (!isCorrect) {
    return c.json({ 
      success: false, 
      message: 'Jawaban belum tepat, coba lagi!',
      hint: 'Perhatikan penulisan kode dengan teliti'
    }, 200);
  }
  
  const currentUser = await c.env.DB.prepare(
    'SELECT points, level, current_streak, longest_streak, last_activity_date FROM users WHERE id = ?'
  ).bind(user.id).first();
  
  const newPoints = (currentUser.points as number) + (material.points as number);
  const newLevel = calculateLevel(newPoints);
  const streakUpdate = updateStreak(
    currentUser.last_activity_date as string | null,
    currentUser.current_streak as number
  );
  
  await c.env.DB.prepare(
    'INSERT INTO progress (user_id, material_id, completed, code_submitted, completed_at) VALUES (?, ?, 1, ?, datetime("now")) ON CONFLICT(user_id, material_id) DO UPDATE SET completed = 1, code_submitted = ?, completed_at = datetime("now")'
  ).bind(user.id, material_id, code_submitted, code_submitted).run();
  
  const today = new Date().toISOString().split('T')[0];
  
  await c.env.DB.prepare(
    'INSERT INTO streak_history (user_id, date, activities_count) VALUES (?, ?, 1) ON CONFLICT(user_id, date) DO UPDATE SET activities_count = activities_count + 1'
  ).bind(user.id, today).run();
  
  const newLongestStreak = Math.max(streakUpdate.newStreak, currentUser.longest_streak as number);
  
  await c.env.DB.prepare(
    'UPDATE users SET points = ?, level = ?, current_streak = ?, longest_streak = ?, last_activity_date = ?, updated_at = datetime("now") WHERE id = ?'
  ).bind(newPoints, newLevel, streakUpdate.newStreak, newLongestStreak, today, user.id).run();
  
  const levelUp = newLevel > (currentUser.level as number);
  
  const badges = await checkAndUnlockBadges(c.env.DB, user.id, newPoints, streakUpdate.newStreak);
  
  return c.json({
    success: true,
    message: 'Selamat! Jawaban benar! 🎉',
    points_earned: material.points,
    new_points: newPoints,
    new_level: newLevel,
    level_up: levelUp,
    streak: streakUpdate.newStreak,
    is_new_day: streakUpdate.isNewDay,
    badges_unlocked: badges
  });
});

async function checkAndUnlockBadges(db: D1Database, userId: number, points: number, streak: number) {
  const completedCount = await db.prepare(
    'SELECT COUNT(*) as count FROM progress WHERE user_id = ? AND completed = 1'
  ).bind(userId).first();
  
  const badges = await db.prepare(
    'SELECT * FROM badges'
  ).all();
  
  const unlockedBadges = [];
  
  for (const badge of badges.results) {
    const alreadyUnlocked = await db.prepare(
      'SELECT id FROM user_badges WHERE user_id = ? AND badge_id = ?'
    ).bind(userId, badge.id).first();
    
    if (alreadyUnlocked) continue;
    
    let shouldUnlock = false;
    
    if (badge.condition_type === 'points_reached' && points >= badge.condition_value) {
      shouldUnlock = true;
    } else if (badge.condition_type === 'streak_days' && streak >= badge.condition_value) {
      shouldUnlock = true;
    } else if (badge.condition_type === 'lessons_completed' && completedCount.count >= badge.condition_value) {
      shouldUnlock = true;
    }
    
    if (shouldUnlock) {
      await db.prepare(
        'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)'
      ).bind(userId, badge.id).run();
      
      unlockedBadges.push({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon_url: badge.icon_url
      });
    }
  }
  
  return unlockedBadges;
}

progressRoutes.get('/my', async (c) => {
  const user = c.get('user') as AuthUser;
  
  const { results } = await c.env.DB.prepare(`
    SELECT 
      p.*,
      m.title,
      m.category,
      m.points
    FROM progress p
    JOIN materials m ON p.material_id = m.id
    WHERE p.user_id = ?
    ORDER BY p.completed_at DESC
  `).bind(user.id).all();
  
  return c.json({ progress: results });
});
