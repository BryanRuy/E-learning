import { DataTypes } from "sequelize";
import {
	BelongsTo,
	Column,
	ForeignKey,
	Index,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import { Meeting } from "./Meeting";
import { User } from "./User";
import { SequelizeModel } from "../types/SequelizeModel";

@Table
export class Participant extends SequelizeModel<Participant> {
	@Index
	@ForeignKey(() => Meeting)
	@PrimaryKey
	@Column(DataTypes.INTEGER.UNSIGNED)
	meetingId!: number;

	@Index
	@ForeignKey(() => User)
	@PrimaryKey
	@Column(DataTypes.INTEGER.UNSIGNED)
	participantId!: number;

	@BelongsTo(() => Meeting)
	meeting!: Meeting;

	@BelongsTo(() => User)
	user!: User;
}
