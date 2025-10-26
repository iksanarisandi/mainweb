export function updateStreak(lastActivityDate: string | null, currentStreak: number): { newStreak: number; isNewDay: boolean } {
  const today = new Date().toISOString().split('T')[0];
  
  if (!lastActivityDate) {
    return { newStreak: 1, isNewDay: true };
  }
  
  if (lastActivityDate === today) {
    return { newStreak: currentStreak, isNewDay: false };
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (lastActivityDate === yesterdayStr) {
    return { newStreak: currentStreak + 1, isNewDay: true };
  }
  
  return { newStreak: 1, isNewDay: true };
}

export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}
