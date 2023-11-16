import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, HasMany, HasOne, Index, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { Student } from './Student';
import { Test } from './Test';
import { ObjectiveAttempt } from './ObjectiveAttempt';
import { SubjectiveAttempt } from './SubjectiveAttempt';
import { User } from './User';
import { StudentTest } from './StudentTest';

@Table
export class Attempt extends SequelizeModel<Attempt>{

    @Index
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _attemptId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    attemptId!: string

    @ForeignKey(() => Student)
    studentId!: number

    @ForeignKey(() => Test)
    testId!: number

    @ForeignKey(() => StudentTest)
    studentTestId!: number

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date

    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date

    @AllowNull(true)
    @Column(DataTypes.DATE)
    submittedAt!: Date

    @BelongsTo(() => Student)
    student!: Student

    @BelongsTo(() => Test)
    test!: Test

    @BelongsTo(() => StudentTest)
    studentTest!: StudentTest

    @HasMany(() => ObjectiveAttempt)
    objectiveAttempt?: ObjectiveAttempt[]

    @HasMany(() => SubjectiveAttempt)
    subjectiveAttempt?: SubjectiveAttempt[]


}