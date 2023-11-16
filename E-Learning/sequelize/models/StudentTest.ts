import { DataTypes, Model } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Index, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { SequelizeModel } from '../types/SequelizeModel';
import { Student } from './Student';
import { Test } from './Test';

@Table
export class StudentTest extends SequelizeModel<StudentTest>{
    @Index
    @PrimaryKey
    @AllowNull(false)
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _studentTestId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    studentTestId!: string

    @ForeignKey(() => Student)
    @AllowNull(false)
    @Column(DataTypes.INTEGER.UNSIGNED)
    studentId!: number


    @ForeignKey(() => Test)
    @AllowNull(false)
    @Column(DataTypes.INTEGER.UNSIGNED)
    testId!: number


    @AllowNull(false)
    @Column(DataTypes.DATE)
    startTime!: Date

    @AllowNull(false)
    @Column(DataTypes.DATE)
    endTime!: Date

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date


    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date

    @BelongsTo(() => Student)
    user!: Student

    @BelongsTo(() => Test)
    test?: Test
}
