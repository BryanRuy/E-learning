import moment from "moment";
import { op as Op, sequelize, Student, Teacher, User } from "../../../sequelize";
import { t } from "../../../sequelize/locales";
import { RoleType, SequelizeAttributes, StudentStatus } from "../../../sequelize/types";

let Seq = sequelize.Sequelize
export  class AdminDashboardCore {

    static async GetAllActiveTeacher(returns : SequelizeAttributes = SequelizeAttributes.WithoutIndexes) :Promise<User[]>{

        const user = await  User.findAllSafe<User[]>(returns ,{
            include:[{
                model:Teacher,
                where:{
                    status :{
                        [Op.not]: 'blocked'
                    }
                }
            }],
            where:{
                roleId:  'teacher'
            }
        })
        return user
    }

    static async GetAllStudentByStatus(statusType : StudentStatus[] , limit:number , offset:number ,name?:any , returns : SequelizeAttributes = SequelizeAttributes.WithoutIndexes) :Promise<User[]>{

        let condtions :any = { roleId : 'student' }
        if(name){
            condtions = { roleId : 'student' ,
             name: { [Op.like]:`%${name}%`}}
        }

        const user = await  User.findAndCountAllSafe<User[]>(returns ,{
            include:[{
                model:Student,
                where:{
                    status :{
                        [Op.in]: [statusType] as any
                    }
                }
            }],
            where:condtions,
            limit:limit,
            offset:offset,
            order:[['createdAt','DESC']]
        })
        return user
    }


  
    static async GetAllUser(role :'student'| 'teacher' , limit:number , offset:number , returns : SequelizeAttributes = SequelizeAttributes.WithoutIndexes) :Promise<any>{

        const user = await  User.findAndCountAllSafe<User[]>(returns,{
            where:{
                roleId:  role,
            },
            limit:limit,
            offset:offset,
            order:[['createdAt','DESC']]
        })
        
        return user
    }

    static async GetUserOf(type: 'month' | 'year' ,role :'student'| 'teacher' , returns : SequelizeAttributes = SequelizeAttributes.WithoutIndexes) :Promise<User[]>{

        const user = await  User.findAllSafe<User[]>(returns,{
            where:{
                roleId:  role,
                createdAt :{
                    [Op.between]:[moment().subtract(1,type).format() ,moment().format() ] as any
                }
                
            }
        })
        return user
    }

    static async GetYearlySignUpUserCount(year:any = moment().year()) :Promise<any>{

       const data = await sequelize
        .query(`Select COUNT(*) AS Count, month(createdAt) AS month from Users where  year(createdAt) = ${year} and (roleId = 'student' OR roleId = 'teacher') GROUP by month(createdAt)`, {
            model:User,
            mapToModel: true
        })
       
        return data
    }



}