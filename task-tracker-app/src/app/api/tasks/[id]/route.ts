
import { kv } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { task } = await req.json();
    const workspace = task.workspace || 'Work';
    await kv.hset(`tasks:${workspace}`, { [id]: task });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const workspace = searchParams.get('workspace') || 'Work';
    await kv.hdel(`tasks:${workspace}`, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
