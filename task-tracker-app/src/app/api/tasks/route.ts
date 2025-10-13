
import { kv } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspace = searchParams.get('workspace') || 'Work';
    console.log('GET request for workspace:', workspace);
    const tasks = await kv.hgetall(`tasks:${workspace}`);
    console.log('Tasks from KV:', tasks);
    return NextResponse.json(tasks || {});
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { task } = await req.json();
    console.log('POST request - task:', task);
    const id = Math.random().toString(36).substring(2, 15);
    const workspace = task.workspace || 'Work';
    console.log('Saving to workspace:', workspace, 'with id:', id);
    await kv.hset(`tasks:${workspace}`, { [id]: { ...task, id } });
    console.log('Task saved successfully');
    return NextResponse.json({ id });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
