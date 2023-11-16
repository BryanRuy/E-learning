export const MeetingActions = {
    Accept: 'accepted',
    Reject: 'rejected',
    Cancel: 'cancelled',
    Reschedule: 'rescheduled'
}

export const getMeetingStatusColor = (meetingStatus) => {
    switch (meetingStatus) {
        case 'accepted': return 'light-success';
        case 'rejected': return 'light-danger';
        case 'pending': return 'light-warning';
        case 'cancelled': return 'light-danger';
        case 'rescheduled': return 'light-warning';
        default: return 'light-warning'
    }
}