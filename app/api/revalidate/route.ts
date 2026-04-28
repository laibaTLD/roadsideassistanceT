import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any));
    const secret = body?.secret as string | undefined;
    const path = (body?.path as string | undefined) ?? '/';

    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'REVALIDATE_SECRET is not configured' },
        { status: 500 }
      );
    }

    if (!secret || secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Invalid secret' },
        { status: 401 }
      );
    }

    revalidatePath(path);

    return NextResponse.json({ success: true, revalidated: true, path });
  } catch (error) {
    console.error('Revalidate error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
