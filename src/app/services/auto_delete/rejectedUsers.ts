//delete newUsers one week after they were rejected
import connect from "@/app/lib/db/mongodb";
import NewUser from "@/app/lib/models/newUserSchema";

//delete tasks that finished one month ago or more
//run every day at midnight from vercel cron using the route in \src\app\api\cron\route.ts
export async function deleteOldRejects() {
    try {
        await connect();

        const oneWeekAgo = new Date();
        oneWeekAgo.setUTCDate(oneWeekAgo.getUTCDate() - 7);

        const result = await NewUser.deleteMany({
            reject_time: { $type: "date", $lt: oneWeekAgo }
        });
        return result.deletedCount;
    } catch (error) {
        console.error('Error deleting old rejected users:', error);
        throw new Error('Failed to delete rejected users older than one month');
    }
}