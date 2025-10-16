
import { kv } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const workspaces = ['Work', 'Projects', 'Personal'];

    for (const workspace of workspaces) {
      const tasks = await kv.hgetall(`tasks:${workspace}`) as Record<string, Task> | null;

      if (tasks) {
        const updates: Record<string, Task> = {};

        // Reset all completed daily reminders
        Object.entries(tasks).forEach(([id, task]) => {
          if (task.isDailyReminder && task.completed) {
            updates[id] = { ...task, completed: false };
          }
        });

        // Update all tasks that need to be reset
        if (Object.keys(updates).length > 0) {
          await kv.hset(`tasks:${workspace}`, updates);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Daily reminders reset successfully' });
  } catch (error) {
    console.error('Reset Daily Reminders Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
