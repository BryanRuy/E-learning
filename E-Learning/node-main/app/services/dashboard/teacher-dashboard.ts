import moment from "moment";
import { op as Op, sequelize, User } from "../../../sequelize";

let Seq = sequelize.Sequelize
export  class TeacherDashboardCore {

    static async GetAllUser(role :'student'| 'teacher') :Promise<User[]>{

        const user = await  User.findAll({
            where:{
                roleId:  role
            }
        })
        return user
    }

    static async GetThisMonthUser(role :'student'| 'teacher') :Promise<User[]>{

        const user = await  User.findAll({
            where:{
                roleId:  role,
                createdAt :{
                    [Op.between]:[moment().subtract(1,'month').format() ,moment().format() ] as any
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