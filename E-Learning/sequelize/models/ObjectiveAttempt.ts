import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Index, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { Question } from './Question';
import { Option } from './Option';
import { Attempt } from './Attempt';


@Table
export class ObjectiveAttempt extends SequelizeModel<ObjectiveAttempt>{

    @PrimaryKey
    @ForeignKey(() => Attempt)
    @Column(DataTypes.INTEGER.UNSIGNED)
    attemptId!: number

    @PrimaryKey
    @ForeignKey(() => Question)
    @Column(DataTypes.INTEGER.UNSIGNED)
    questionId!: number

    @PrimaryKey
    @ForeignKey(() => Option)
    @Column(DataTypes.INTEGER.UNSIGNED)
    optionId!: number


    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date

    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date

    @BelongsTo(() => Attempt)
    attempt!: Attempt

    @BelongsTo(() => Question)
    question!: Question

    @BelongsTo(() => Option)
    option!: Option

}