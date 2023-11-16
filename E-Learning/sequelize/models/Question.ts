import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, AutoIncrement, BelongsTo, Column, Comment, Default, ForeignKey, HasMany, Index, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { Option } from './Option';
import { Test } from './Test';

@Table
export class Question extends SequelizeModel<Question>{

    @Index
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _questionId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    questionId!: string

    @ForeignKey(() => Test)
    testId!: number

    @Index
    @AllowNull(false)
    @Column(DataTypes.STRING)
    text!: string

    @Index
    @AllowNull(false)
    @Comment('1 => Objective ,2 => Subjective')
    @Column(DataTypes.INTEGER)
    type!: number

    @AllowNull(false)
    @Column(DataTypes.INTEGER)
    marks!: number

    @AllowNull(true)
    @Column(DataTypes.STRING)
    image!: string

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date

    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date

    @BelongsTo(() => Test)
    Test!: Test

    @HasMany(() => Option)
    options!: Option[]

}