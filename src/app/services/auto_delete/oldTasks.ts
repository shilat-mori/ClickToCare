//delete tasks that finished one month ago or more

//determine the status of task (done means those that should be deleted)
export function getStatusFilter(status: string) {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setUTCMonth(today.getUTCMonth() - 1);

    if (status === 'running') {
        return { end_time: { $gt: now } }; //not finished yet
    } else if (status === 'standby') {
        return { end_time: { $lte: now, $gt: oneMonthAgo } }; //finished in the last month
    } else if (status === 'done') {
        return { end_time: { $lte: oneMonthAgo } }; //finished more than a month ago.
    }
    return {}; // Default for 'all'
}