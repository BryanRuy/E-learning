import { DataTypes } from "sequelize";
import {
	AllowNull,
	AutoIncrement,
	BelongsTo,
	Column,
	Default,
	ForeignKey,
	HasMany,
	Index,
	PrimaryKey,
	Table,
	Unique,
} from "sequelize-typescript";
import { MeetingStatus, MeetingStatusEnum } from "../types";
import { SequelizeModel } from "../types/SequelizeModel";
import { MeetingFeedback } from "./MeetingFeedback";
import { Participant } from "./Participant";
import { User } from "./User";
@Table
export class Meeting extends SequelizeModel<Meeting> {
	@Index
	@PrimaryKey
	@AutoIncrement
	@Column(DataTypes.INTEGER.UNSIGNED)
	_meetingId!: number;

	@Index
	@AllowNull(false)
	@Unique(true)
	@Default(DataTypes.UUIDV4)
	@Column(DataTypes.STRING(36))
	meetingId!: string;

	@Index
	@ForeignKey(() => User)
	@Column(DataTypes.INTEGER.UNSIGNED)
	createdBy!: number;

	@AllowNull(false)
	@Default("pending")
	@Column(DataTypes.ENUM(...MeetingStatusEnum))
	status!: MeetingStatus;

	@AllowNull(false)
	@Default(DataTypes.NOW)
	@Column(DataTypes.DATE)
	scheduledAt!: Date;

	@AllowNull(true)
	@Default(null)
	@Column(DataTypes.STRING)
	message?: string;

	@AllowNull(false)
	@Column(DataTypes.STRING)
	agenda?: string;

	@AllowNull(false)
	@Default(DataTypes.NOW)
	@Column(DataTypes.DATE)
	createdAt!: Date;

	@AllowNull(true)
	@Default(DataTypes.NOW)
	@Column(DataTypes.DATE)
	updatedAt!: Date;

	@BelongsTo(() => User)
	user!: User;

	@HasMany(() => Participant)
	participants!: Participant[];

	@HasMany(() => MeetingFeedback)
	feedbacks!: MeetingFeedback[];
}
