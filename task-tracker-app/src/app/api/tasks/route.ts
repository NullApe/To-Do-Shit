
import { kv } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const tasks = await kv.hgetall('tasks');
    return NextResponse.json(tasks || {});
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { task } = await req.json();
    const id = Math.random().toString(36).substring(2, 15);
    await kv.hset('tasks', { [id]: { ...task, id } });
    return NextResponse.json({ id });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
