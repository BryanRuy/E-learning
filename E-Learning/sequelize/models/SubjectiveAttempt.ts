import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, BelongsTo, Column, Default, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';
import { Attempt } from './Attempt';
import { Question } from './Question';
import { Col } from 'sequelize/types/lib/utils';

@Table
export class SubjectiveAttempt extends SequelizeModel<SubjectiveAttempt>{

    @PrimaryKey
    @ForeignKey(() => Attempt)
    @Column(DataTypes.INTEGER.UNSIGNED)
    attemptId!: number

    @PrimaryKey
    @ForeignKey(() => Question)
    @Column(DataTypes.INTEGER.UNSIGNED)
    questionId!: number

    @AllowNull(true)
    @Column(DataTypes.INTEGER)
    obtainedMarks!: number

    @AllowNull(false)
    @Column(DataTypes.TEXT)
    answerText!: string


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


}