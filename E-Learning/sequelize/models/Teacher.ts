import { DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, BelongsToMany, Column, Default, ForeignKey, HasMany, Index, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { StudentStatus, TeacherStatus, TeacherStatusEnum } from '../types';
import { SequelizeModel } from '../types/SequelizeModel';
import { Student } from './Student';
import { TeacherStudent } from './TeacherStudent';
import { User } from './User';


@Table
export class Teacher extends SequelizeModel<Teacher> {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataTypes.INTEGER.UNSIGNED)
    teacherId?: number;

    @Column(DataTypes.ENUM(...TeacherStatusEnum))
    status!: TeacherStatus;

    @AllowNull(false)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    createdAt!: Date;

    @AllowNull(true)
    @Default(DataTypes.NOW)
    @Column(DataTypes.DATE)
    updatedAt!: Date;

    @BelongsTo(() => User)
    user!: User

    @HasMany(() => Student)
    students?: Student[]

}
