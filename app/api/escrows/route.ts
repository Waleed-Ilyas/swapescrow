import { NextResponse } from 'next/server';
import { offers } from '@/lib/escrow';

export async function GET() {
  return NextResponse.json({ offers });
}
