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
	Unique,
} from "sequelize-typescript";
import { RoleType } from "../types";
import { SequelizeModel } from "../types/SequelizeModel";
import { Role } from "./Role";
import { Student } from "./Student";
import { Teacher } from "./Teacher";

@Table
export class User extends SequelizeModel<User> {
	@Index
	@PrimaryKey
	@AutoIncrement
	@Column(DataTypes.INTEGER.UNSIGNED)
	_userId?: number;

	@Index
	@AllowNull(false)
	@Unique(true)
	@Default(DataTypes.UUIDV4)
	@Column(DataTypes.STRING(36))
	userId!: string;

	@ForeignKey(() => Role)
	roleId?: RoleType;

	@AllowNull(false)
	@Column(DataTypes.STRING(100))
	name!: string;

	@Unique(true)
	@AllowNull(false)
	@Column(DataTypes.STRING(255))
	email!: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	password?: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	profilePicture!: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	about!: string;

	@AllowNull(false)
	@Default(104857600)
	@Column(DataTypes.INTEGER)
	storage!: number;

	@AllowNull(true)
	@Column(DataTypes.STRING(20))
	zipCode!: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(20))
	contactNo!: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	gitLink!: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	twitterLink!: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	fbLink!: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	linkedInLink!: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	address?: string;
	
	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	city?: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	county?: string;

	@AllowNull(true)
	@Column(DataTypes.STRING(255))
	country?: string;

	@AllowNull(false)
	@Default(DataTypes.NOW)
	@Column(DataTypes.DATE)
	createdAt!: Date;

	@AllowNull(true)
	@Default(DataTypes.NOW)
	@Column(DataTypes.DATE)
	updatedAt!: Date;

	@BelongsTo(() => Role)
	role?: Role;

	@HasOne(() => Student)
	student?: Student;

	@HasOne(() => Teacher)
	teacher?: Teacher;
}
