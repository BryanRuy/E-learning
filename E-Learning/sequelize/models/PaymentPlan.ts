import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Index, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { User } from './User';

@Table
export class PaymentPlan extends SequelizeModel<PaymentPlan>{

    @Index
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _paymentPlanId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    paymentPlanId!: string

    @ForeignKey(() => User)
    userId!: number

    @AllowNull(false)
    @Column(DataTypes.DECIMAL(10,2).UNSIGNED)
    price!: number

    @AllowNull(false)
    @Column(DataTypes.BIGINT.UNSIGNED)
    priceInCents!: number

    @AllowNull(false)
    @Column(DataTypes.STRING(3))
    currencyCode!: string

    @AllowNull(false)
    @Column(DataTypes.INTEGER.UNSIGNED)
    planDurationInDays!: number


    @AllowNull(false)
    @Column(DataTypes.STRING(255))
    planDuration!: string

    @AllowNull(false)
    @Column(DataTypes.ENUM('monthly', 'yearly'))
    planTerm!: 'monthly' | 'yearly'


    @AllowNull(true)
    @Column(DataTypes.DATEONLY)
    startDate?: Date

    @AllowNull(true)
    @Column(DataTypes.DATEONLY)
    endDate?: Date

    @Default('unset')
    @Column(DataTypes.ENUM('active', 'deactivated', 'unset'))
    status!: 'active' | 'deactivated' | 'unset'

    @BelongsTo(() => User)
    user!: User
}