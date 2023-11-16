import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Index, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { Student } from './Student';
import { Assignment } from './Assignment';
import { StudentAssignment } from './StudentAssignment';

@Table
export class AssignmentAttempt extends SequelizeModel<AssignmentAttempt>{

    @Index
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _assignmentAttemptId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    assignmentAttemptId!: string

    @AllowNull(true)
    @Column(DataTypes.INTEGER)
    obtainedMarks!: number

    @AllowNull(true)
    @Column(DataTypes.TEXT)
    answerText!: string

    @ForeignKey(() => Student)
    studentId!: number

    @ForeignKey(() => Assignment)
    assignmentId!: number

    @Index
    @ForeignKey(() => StudentAssignment)
    studentAssignmentId!: number

    @AllowNull(true)
    @Column(DataTypes.DATE)
    submittedAt!: Date


    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date

    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date

    @BelongsTo(() => Student)
    student!: Student

    @BelongsTo(() => Assignment)
    assignment!: Assignment

    @BelongsTo(() => StudentAssignment)
    studentAssignment!: StudentAssignment

}