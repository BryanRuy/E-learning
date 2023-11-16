import { DataTypes } from 'sequelize';
import { AllowNull, Column, Default, PrimaryKey, Table } from "sequelize-typescript";
import { RoleType, RoleTypeEnum } from '../types';
import { SequelizeModel } from '../types/SequelizeModel';


@Table
export class Role extends SequelizeModel<Role>{

    @PrimaryKey
    @Column(DataTypes.ENUM(...RoleTypeEnum))
    roleId?: RoleType

    @AllowNull(false)
    @Column(DataTypes.STRING(70))
    roleName!: string

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date


    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date
}