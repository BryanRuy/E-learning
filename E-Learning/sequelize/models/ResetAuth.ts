import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Index, PrimaryKey, Table, Unique } from 'sequelize-typescript';

import { User } from './User';

@Table
export class ResetAuth extends SequelizeModel<ResetAuth>{

    @Index
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _authId!: number

    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    authId!: string

    @AllowNull(false)
    @Column(DataTypes.DATE)
    expiry!: Date

    @AllowNull(false)
    @Default(0)
    @Column(DataTypes.BOOLEAN)
    isUsed!: Boolean

    @ForeignKey(() => User)
    userId!: number

   
    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date

    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date

    @BelongsTo(() => User)
    user!: User
}