import { deleteOldTasks } from '@/app/services/auto_delete/oldTasks';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    // Authorization check (vercel takes it from it's local variables)
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Call the function to delete old tasks
        const result = await deleteOldTasks();

        return NextResponse.json({
            ok: true,
            deletedTasks: result,
        });
    } catch (error) {
        console.error('Error deleting old tasks:', error);
        return NextResponse.json(
            { error: 'Failed to delete old tasks' },
            { status: 500 }
        );
    }
}
