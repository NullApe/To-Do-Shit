
import { NextRequest, NextResponse } from 'next/server';

// This endpoint should be called by a cron job service (like Vercel Cron, cron-job.org, etc.)
// scheduled to run daily at 4am PST (12pm UTC during standard time, 11am UTC during daylight saving)
export async function GET(req: NextRequest) {
  try {
    // Verify the request is from a cron job (optional: add authorization header check)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Optional: Enable this check if you set up CRON_SECRET in environment variables
    // if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Call the reset-daily endpoint
    const baseUrl = req.nextUrl.origin;
    const response = await fetch(`${baseUrl}/api/tasks/reset-daily`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to reset daily reminders');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Daily reminder cron job executed successfully',
      result,
    });
  } catch (error) {
    console.error('Cron Job Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
