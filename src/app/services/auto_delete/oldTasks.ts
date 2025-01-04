import connect from "@/app/lib/db/mongodb";
import Task from "@/app/lib/models/taskSchema";

//delete tasks that finished one month ago or more
//run every day at midnight from vercel cron using the route in \src\app\api\cron\route.ts
export async function deleteOldTasks() {
    try {
        await connect();

        const oneMonthAgo = new Date();
        oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);

        const result = await Task.deleteMany({ end_time: { $lt: oneMonthAgo } });
        return result.deletedCount;
    } catch (error) {
        console.error('Error deleting old tasks:', error);
        throw new Error('Failed to delete tasks older than one month');
    }
}