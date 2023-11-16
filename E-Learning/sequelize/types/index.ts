export * from "./SequelizeAttributes";
export * from "./SequelizeModel";

export const MeetingStatusEnum = <const>[
	"accepted",
	"rejected",
	"pending",
	"cancelled",
	"rescheduled",
];
export type MeetingStatus = typeof MeetingStatusEnum[number];

export const MessageStatusEnum = <const>[
	"sent",
	"delivered",
	"seen",
	"deleted",
];
export type MessageStatus = typeof MessageStatusEnum[number];

export const ChatTypesEnum = <const>["chat", "group"];
export type ChatTypes = typeof ChatTypesEnum[number];

export const TeacherStatusEnum = <const>["new", "approved", "blocked"];
export type TeacherStatus = typeof TeacherStatusEnum[number];

export const StudentStatusEnum = <const>[
	"new",
	"waiting-for-teacher",
	"active",
	"blocked",
];
export type StudentStatus = typeof StudentStatusEnum[number];

export const RoleTypeEnum = <const>[
	"student",
	"teacher",
	"admin",
	"super-admin",
];
export type RoleType = typeof RoleTypeEnum[number];
export const RoleTypeRegex = `${RoleTypeEnum.join("|")}`;

export type UserSearchType = "email" | "_userId" | "userId";
export type ChatSearchType = "_chatId" | "chatId";


export const AssignmentTypeEnum = <const>[
	"coding",
	"theoretical"
];
export type AssignmentType = typeof AssignmentTypeEnum[number];