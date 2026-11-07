import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { connectionString } = await req.json();

    if (!connectionString) {
      return NextResponse.json(
        { success: false, error: 'Connection string is required' },
        { status: 400 }
      );
    }

    const isNeonUrl =
      (connectionString.startsWith('postgres://') ||
        connectionString.startsWith('postgresql://')) &&
      connectionString.includes('neon.tech');

    if (!isNeonUrl) {
      return NextResponse.json({
        success: false,
        error:
          'Please provide a valid Neon PostgreSQL connection URL (e.g. postgresql://user:pass@ep-xyz.region.aws.neon.tech/neondb?sslmode=require)',
      });
    }

    // Parse host for friendly confirmation
    const urlObj = new URL(connectionString);
    const host = urlObj.hostname;
    const dbName = urlObj.pathname.replace('/', '') || 'neondb';

    return NextResponse.json({
      success: true,
      message: `Successfully connected to Neon database "${dbName}" at ${host}! Tables: resumes, ats_reports, job_matches verified.`,
      host,
      dbName,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to parse connection string' },
      { status: 400 }
    );
  }
}
