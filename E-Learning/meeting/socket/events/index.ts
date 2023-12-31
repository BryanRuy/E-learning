export * from "./on-create-room";
export * from "./on-join-room";
export * from "./on-answer-call";
export * from "./on-start-call";
export * from "./on-create-ice-event-data";
export * from "./on-end-call";
export * from "./on-mute-audio";
export * from "./on-unmute-audio";
export * from "./on-mute-video";
export * from "./on-unmute-video";
export * from "./on-screen-sharing-disabled";
export * from "./on-screen-sharing-enabled";
export * from "./on-close-board";
export * from "./on-open-board";
export * from "./on-reconnecting";
export * from "./on-disconnect";

export const IOEvents = {
	CONNECT: "CONNECT",
	DISCONNECT: "disconnect",
	SET_LANGUAGE: "SET_LANGUAGE",
	AUTHORIZATION: "AUTHORIZATION",
	INVALID_PARTICIPANT: "INVALID_PARTICIPANT",
	ALREADY_JOINED: "ALREADY_JOINED",
	CREATE_ROOM: "CREATE_ROOM",
	ROOM_JOIN: "ROOM_JOIN",
	ROOM_EXIST: "ROOM_EXIST",
	ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
	JOINED_ROOM_AS_RECEIVER: "JOINED_ROOM_AS_RECEIVER",
	CALL_ON_WAIT: "CALL_ON_WAIT",
	START_CALL: "START_CALL",
	ANSWER_CALL: "ANSWER_CALL",
	END_CALL: "END_CALL",
	CALL_ENDED: "CALL_ENDED",
	RECEIVE_ANSWER: "RECEIVE_ANSWER",
	CREATE_ICE_EVENT_DATA: "CREATE_ICE_EVENT_DATA",
	MEETING_NOT_FOUND: "MEETING_NOT_FOUND",
	MEETING_NOT_ACTIVE: "MEETING_NOT_ACTIVE",
	MUTE_VIDEO: "MUTE_VIDEO",
	UNMUTE_VIDEO: "UNMUTE_VIDEO",
	MUTE_AUDIO: "MUTE_AUDIO",
	UNMUTE_AUDIO: "UNMUTE_AUDIO",
	SCREEN_SHARING_ENABLED: "SCREEN_SHARING_ENABLED",
	SCREEN_SHARING_DISABLED: "SCREEN_SHARING_DISABLED",
	OPEN_BOARD: "OPEN_BOARD",
	CLOSE_BOARD: "CLOSE_BOARD",
	ANSWER: "ANSWER",
	OFFER: "OFFER",
	RECONNECTING: "RECONNECTING",
};
