import { DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, Column, Default, ForeignKey, Index, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { SequelizeModel } from '../types/SequelizeModel';
import { User } from './User';

@Table
export class Document extends SequelizeModel<Document>{

    @Index
    @PrimaryKey
    @AutoIncrement
    @Column(DataTypes.INTEGER.UNSIGNED)
    _documentId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Default(DataTypes.UUIDV4)
    @Column(DataTypes.STRING(36))
    documentId!: string

    @ForeignKey(() => User)
    userId!: number

    @Index
    @AllowNull(false)
    @Unique(true)
    @Column(DataTypes.STRING)
    documentPublicId!: string


    @AllowNull(false)
    @Column(DataTypes.STRING(20))
    fileType!: string

    @AllowNull(false)
    @Column(DataTypes.BIGINT)
    fileSize!: number

    @AllowNull(false)
    @Column(DataTypes.STRING(70))
    name!: string

    @Index
    @AllowNull(true)
    @Column(DataTypes.STRING(36))
    Id?: string

    @Index
    @AllowNull(true)
    @Column(DataTypes.STRING(36))
    tag?: string

    @AllowNull(true)
    @Column(DataTypes.STRING(100))
    fileName?: string

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



