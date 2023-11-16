import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Index, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { AssignmentType, AssignmentTypeEnum } from '../types';
import { Teacher } from './Teacher';

@Table
export class Assignment extends SequelizeModel<Assignment>{

    @Index
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _assignmentId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    assignmentId!: string

    @ForeignKey(() => Teacher)
    teacherId!: number



    @AllowNull(false)
    @Column(DataTypes.STRING(60))
    title!: string


    @AllowNull(false)
    @Column(DataTypes.INTEGER)
    totalMarks!: number

    @AllowNull(false)
    @Column(DataTypes.ENUM(...AssignmentTypeEnum))
    type!: AssignmentType

    @AllowNull(false)
    @Column(DataTypes.TEXT)
    content!: string


    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date

    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date

    @BelongsTo(() => Teacher)
    teacher!: Teacher
}