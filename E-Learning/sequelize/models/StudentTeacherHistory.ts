import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Index, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { Teacher } from './Teacher';
import { AssignmentType, AssignmentTypeEnum } from '../types';
import { User } from './User';
import { Student } from './Student';
import { indexOf } from 'lodash';

@Table
export class StudentTeacherHistory extends SequelizeModel<StudentTeacherHistory>{

    @Index
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _studentTeacherHistoryId?: number

    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    studentTeacherHistoryId!: string

    @ForeignKey(() => Student)
    @Column(DataTypes.INTEGER.UNSIGNED)
    studentId?: number

    @ForeignKey(() => Teacher)
    @Column(DataTypes.INTEGER.UNSIGNED)
    teacherId?: number

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

    @BelongsTo(() => Student)
    student!: Student
}