import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
};

export const authRoutes = new Hono<{ Bindings: Bindings }>();

authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const validated = registerSchema.parse(body);
    
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ? OR username = ?'
    ).bind(validated.email, validated.username).first();
    
    if (existingUser) {
      return c.json({ error: 'Email or username already exists' }, 400);
    }
    
    const passwordHash = await bcrypt.hash(validated.password, 10);
    const role = validated.email === c.env.ADMIN_EMAIL ? 'admin' : 'user';
    
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, username, password_hash, role) VALUES (?, ?, ?, ?) RETURNING id, email, username, role, level, points'
    ).bind(validated.email, validated.username, passwordHash, role).first();
    
    const token = await sign(
      { 
        id: result.id, 
        email: result.email, 
        username: result.username, 
        role: result.role 
      },
      c.env.JWT_SECRET
    );
    
    return c.json({
      message: 'Registration successful',
      token,
      user: {
        id: result.id,
        email: result.email,
        username: result.username,
        role: result.role,
        level: result.level,
        points: result.points
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', details: error.errors }, 400);
    }
    return c.json({ error: 'Registration failed' }, 500);
  }
});

authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const validated = loginSchema.parse(body);
    
    const user = await c.env.DB.prepare(
      'SELECT id, email, username, password_hash, role, level, points, avatar_url, current_streak, longest_streak FROM users WHERE email = ?'
    ).bind(validated.email).first();
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    const isValid = await bcrypt.compare(validated.password, user.password_hash as string);
    
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    const token = await sign(
      { 
        id: user.id, 
        email: user.email, 
        username: user.username, 
        role: user.role 
      },
      c.env.JWT_SECRET
    );
    
    return c.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        level: user.level,
        points: user.points,
        avatar_url: user.avatar_url,
        current_streak: user.current_streak,
        longest_streak: user.longest_streak
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', details: error.errors }, 400);
    }
    return c.json({ error: 'Login failed' }, 500);
  }
});

// GET /auth/profile - Get current user profile  
authRoutes.get('/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { verify } = await import('hono/jwt');
    
    const payload = await verify(token, c.env.JWT_SECRET) as any;
    
    if (!payload || !payload.id) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const user = await c.env.DB.prepare(`
      SELECT 
        id, email, username, role, level, points as totalPoints, 
        avatar_url as avatar, current_streak as currentStreak, 
        longest_streak as longestStreak,
        (SELECT COUNT(*) FROM progress WHERE user_id = users.id AND completed = 1) as completedLessons
      FROM users 
      WHERE id = ?
    `).bind(payload.id).first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});
