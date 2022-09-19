export const Utility = {
  isDeadlineGone(plannedEnd) {
    if (!plannedEnd) return false;
    const currentTime = new Date().getTime();
    const deadlineTime = new Date(plannedEnd.seconds * 1000).getTime();
    if (currentTime > deadlineTime) {
      return true;
    }
  },
};
