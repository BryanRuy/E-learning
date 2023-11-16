export const URLs = {
  // main: 'http://192.168.10.101:3601',
  // rootApi: 'http://192.168.10.102:3600',
  // feedback: 'http://192.168.10.101:3600/meetings/feedback',
  // whiteBoard: "https://whiteboard.noName.ro/boards",
  main: "https://meet.noName.ro/",
  rootApi: "https://api.noName.ro/",
  feedback: "https://meet.noName.ro/api/meetings/feedback",
  whiteBoard: "https://whiteboard.noName.ro/boards",
};

export const getWhiteboardUrl = (meetingId, userId) =>
  `${URLs.whiteBoard}/${meetingId}?lang=ro`;
