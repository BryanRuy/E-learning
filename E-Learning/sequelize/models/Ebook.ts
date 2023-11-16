import { DataTypes } from 'sequelize';
import { SequelizeModel } from '../types/SequelizeModel'
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Index, PrimaryKey, Table, Unique } from 'sequelize-typescript';

import { User } from './User';

@Table
export class Ebook extends SequelizeModel<Ebook>{

    @Index
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _ebookId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    ebookId!: string

    @AllowNull(false)
    @Column(DataTypes.STRING(60))
    title!: string

    @AllowNull(false)
    @Column(DataTypes.TEXT)
    description!: string

    @AllowNull(false)
    @Column(DataTypes.STRING)
    coverImage!: string

    @AllowNull(false)
    @Column(DataTypes.STRING)
    previewImage!: string

    @AllowNull(false)
    @Column(DataTypes.TEXT)
    bookUrl?: string

    @Column(DataTypes.INTEGER.UNSIGNED)
    priceInCents!: number

    @Column(DataTypes.DECIMAL(10,2).UNSIGNED)
    price!: number

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date

    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date

    @ForeignKey(() => User)
    userId!: number

    @BelongsTo(() => User)
    user!: User
}