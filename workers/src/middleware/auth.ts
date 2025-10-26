import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: 'user' | 'admin';
}

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set('user', payload as AuthUser);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

export const adminMiddleware = async (c: Context, next: Next) => {
  const user = c.get('user') as AuthUser;
  
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Forbidden: Admin access required' }, 403);
  }
  
  await next();
};
