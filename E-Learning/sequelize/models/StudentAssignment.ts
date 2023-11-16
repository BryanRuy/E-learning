import { DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Index, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { SequelizeModel } from '../types/SequelizeModel';
import { Assignment } from './Assignment';
import { Student } from './Student';
import { Teacher } from './Teacher';

@Table
export class StudentAssignment extends SequelizeModel<StudentAssignment>{

    @PrimaryKey
    @AllowNull(false)
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _studentAssignmentId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    studentAssignmentId!: string

    @ForeignKey(() => Assignment)
    assignmentId!: number

    @ForeignKey(() => Student)
    studentId!: number

    @AllowNull(false)
    @Column(DataTypes.DATE)
    startDate!: Date

    @AllowNull(false)
    @Column(DataTypes.DATE)
    endDate!: Date

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date

    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date

    @BelongsTo(() => Assignment)
    assignment?: Assignment

    @BelongsTo(() => Student)
    student!: Student


}