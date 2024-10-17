import { NextResponse } from 'next/server';

export async function GET() {
    console.log('调用了')
    return NextResponse.json({ ok: true });
}