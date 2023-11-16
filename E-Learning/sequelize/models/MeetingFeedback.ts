import { DataTypes } from "sequelize";
import {
	BelongsTo,
	Column,
	ForeignKey,
	Index,
	PrimaryKey,
	Table,
	AutoIncrement,
	AllowNull,
	Default,
	Unique,
} from "sequelize-typescript";
import { Meeting } from "./Meeting";
import { User } from "./User";
import { SequelizeModel } from "../types/SequelizeModel";

@Table
export class MeetingFeedback extends SequelizeModel<MeetingFeedback> {
	@Index
	@PrimaryKey
	@AutoIncrement
	@Column(DataTypes.INTEGER.UNSIGNED)
	_meetingFeedbackId!: number;

	@Index
	@AllowNull(false)
	@Unique(true)
	@Default(DataTypes.UUIDV4)
	@Column(DataTypes.STRING(36))
	meetingFeedbackId!: string;

	@AllowNull(false)
	@Default(1)
	@Column(DataTypes.INTEGER)
	rating!: number;

	@AllowNull(true)
	@Column(DataTypes.TEXT)
	message!: string;

	@ForeignKey(() => Meeting)
	@Column(DataTypes.INTEGER.UNSIGNED)
	meetingId!: number;

	@ForeignKey(() => User)
	@Column(DataTypes.INTEGER.UNSIGNED)
	userId!: number;

	@BelongsTo(() => Meeting)
	meeting!: Meeting;

	@BelongsTo(() => User)
	user!: User;
}
