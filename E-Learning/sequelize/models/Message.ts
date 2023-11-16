import { DataTypes } from "sequelize";
import {
	AllowNull,
	AutoIncrement,
	BelongsTo,
	Column,
	Default,
	ForeignKey,
	HasOne,
	Index,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import { SequelizeModel } from "../types/SequelizeModel";
import { Chat } from "./Chat";
import { Document } from "./Document";
import { User } from "./User";

@Table
export class Message extends SequelizeModel<Message> {
	@Index
	@PrimaryKey
	@AutoIncrement
	@Column(DataTypes.INTEGER.UNSIGNED)
	messageId!: number;

	@Index
	@ForeignKey(() => Chat)
	@Column(DataTypes.INTEGER.UNSIGNED)
	chatId!: number;

	@Index
	@ForeignKey(() => User)
	@Column(DataTypes.INTEGER.UNSIGNED)
	createdBy!: number;

	@AllowNull(false)
	@Column(DataTypes.TEXT)
	content!: string;

	@ForeignKey(() => Document)
	@AllowNull(true)
	@Column(DataTypes.INTEGER.UNSIGNED)
	documentId!: number;

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

	@BelongsTo(() => Chat)
	chat!: Chat;

	@BelongsTo(() => Document)
	document!: Document;
}
