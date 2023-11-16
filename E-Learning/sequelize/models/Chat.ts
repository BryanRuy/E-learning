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
import { ChatTypes, ChatTypesEnum } from "../types";
import { SequelizeModel } from "../types/SequelizeModel";
import { ChatParticipant } from "./ChatParticipant";
import { Message } from "./Message";
import { User } from "./User";

@Table
export class Chat extends SequelizeModel<Chat> {
	@Index
	@PrimaryKey
	@AutoIncrement
	@Column(DataTypes.INTEGER.UNSIGNED)
	_chatId!: number;

	@Index
	@AllowNull(false)
	@Unique(true)
	@Default(DataTypes.UUIDV4)
	@Column(DataTypes.STRING(36))
	chatId!: string;

	@Index
	@ForeignKey(() => User)
	@Column(DataTypes.INTEGER.UNSIGNED)
	createdBy!: number;

	@AllowNull(false)
	@Default("chat")
	@Column(DataTypes.ENUM(...ChatTypesEnum))
	type!: ChatTypes;

	@AllowNull(true)
	@Column(DataTypes.STRING(100))
	groupName!: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	groupPhoto!: string;

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

	@HasMany(() => ChatParticipant)
	chatParticipants!: ChatParticipant[];

	@HasMany(() => Message)
	messages!: Message[];
}
