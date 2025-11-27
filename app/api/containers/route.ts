import { NextResponse } from 'next/server';
import { getContainers } from '@/actions/docker';

export const dynamic = 'force-dynamic';

export async function GET() {
    const containers = await getContainers();
    return NextResponse.json(containers);
}
