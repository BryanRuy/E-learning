
import { Console } from "node:console";
import { sequelize, Student, StudentAssignment, StudentTest, Teacher, TeacherStudent, Test, User } from "../../../sequelize";
import { StudentTeacherHistory } from "../../../sequelize/models/StudentTeacherHistory";
import { SequelizeAttributes } from "../../../sequelize/types"
import { AssignmentCore } from "../assignment";
import { StudentTeachertHistoryCore } from "../student-teacher-history";
import { TestCore } from "../test";
import { UserFactory } from "../user/user-factory";

export interface AssigmentStudentArgs {
    assignmentId: number
    studentId: number
    startDate: string
    endDate: string
}


export class AssignUtil {

    static async UnassignTeacherToStudent(studentId: string): Promise<User> {

     
        let studentCore = UserFactory('student')

        let student: User = await studentCore.GetUserByUuid({
            key: studentId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        } as any) as any

        const transaction = await sequelize.transaction()
        let unassignTeacherOfStudent = await Student.update({
            teacherId: null,
            studentId: student._userId,
            status:'waiting-for-teacher'
        } as any, { where: { studentId: student._userId }, transaction })

        let unassign = await TeacherStudent.destroy({
            where: { studentId: student._userId },
            transaction
        })


        await transaction.commit();

        student = await studentCore.GetUserById({
            key: student._userId!,
            returns: SequelizeAttributes.WithoutIndexes
        } as any) as any
        delete student.student

        return student

    }

    static async AssignTeacherToStudent(teacherId: string, studentId: string): Promise<TeacherStudent> {

        let studentCore = UserFactory('student')
        let teacherCore = UserFactory('teacher')

        let teacher: User = await teacherCore.GetUserByUuid({
            key: teacherId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        } as any) as any

        let student: User = await studentCore.GetUserByUuid({
            key: studentId,
            returns: SequelizeAttributes.WithIndexes,
            shouldThrowNotFound: true
        } as any) as any

        const transaction = await sequelize.transaction()
        let updateStudent = await Student.update({
            studentId: student._userId,
            teacherId: teacher._userId,
            status: 'active',
        }, { where: { studentId: student._userId }, transaction }
        )

        let updateTeacher = await Teacher.update({
            teacherId: teacher._userId,
            status: 'approved',
        }, { where: { teacherId: teacher._userId }, transaction }
        )

        let [assign,isNewRecord] = await TeacherStudent.findOrCreateSafe<TeacherStudent>(SequelizeAttributes.WithIndexes, {
            defaults: {
                studentId: student._userId,
                teacherId: teacher._userId
            } as any,
            where: {
                studentId: student._userId,
                teacherId: teacher._userId
            },
            transaction
        }) 
       
        await transaction.commit();
        if(isNewRecord){
            await StudentTeacherHistory.create({
                studentId: student._userId,
                teacherId: teacher._userId
            } as any  )
        }
        
        teacher = await teacherCore.GetUserById({ key: teacher._userId!, returns: SequelizeAttributes.WithoutIndexes } as any) as any
        student = await studentCore.GetUserById({ key: student._userId!, returns: SequelizeAttributes.WithoutIndexes } as any) as any

        delete teacher.teacher
        delete student.student

        let data = { teacher, student }
        return data as any
    }

    static async AssignTestToStudent(test: Test, student: User, startTime: string, endTime: string): Promise<StudentTest> {


        let assignTest = await StudentTest.create({
            studentId: student._userId!,
            testId: test._testId,
            startTime: startTime,
            endTime: endTime
        } as any)

        let studentCore = UserFactory('student')
        student = await studentCore.GetUserById({ key: student._userId!, returns: SequelizeAttributes.WithoutIndexes } as any) as any
        test = await TestCore.GetTestById(test._testId, SequelizeAttributes.WithoutIndexes)

        delete student.student

        let data = { test, student }
        return data as any
    }

    static async AssignAssignmentToStudent(args: AssigmentStudentArgs): Promise<any> {

        let assignAssigment = await StudentAssignment.create({
            ...args
        } as any)

        let studentCore = UserFactory('student')
        let student = await studentCore.GetUserById({
            key: args.studentId!,
            returns: SequelizeAttributes.WithoutIndexes
        } as any) as any

        let assignment = await AssignmentCore.GetAssignmentById({ key: args.assignmentId } as any)

        delete student.student

        let data = { assignment, student }
        return data as any
    }

}