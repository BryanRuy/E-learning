import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, HasMany, Index, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { Teacher } from './Teacher';
import { Question } from './Question';

@Table
export class Test extends SequelizeModel<Test>{

    @Index
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _testId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    testId!: string


    @AllowNull(false)
    @Column(DataTypes.STRING(60))
    title!: string

    @AllowNull(false)
    @Column(DataTypes.INTEGER)
    totalMarks!: number

    @AllowNull(false)
    @Column(DataTypes.INTEGER)
    timeLimit!: number

    @ForeignKey(() => Teacher)
    teacherId!: number

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

    @HasMany(() => Question)
    questions?: Question[]
}