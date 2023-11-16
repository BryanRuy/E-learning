import { RoleType } from "../../../sequelize/types"
import { AdminCore } from "../admin";
import { StudentCore } from "../student";
import { SuperAdminCore } from "../super-admin";
import { TeacherCore } from "../teacher";
import { UserCore } from "./user-core";

export function UserFactory(userType: RoleType): UserCore {

    switch (userType) {
        case "student":
            return new StudentCore();
        case "teacher":
            return new TeacherCore();
        case "admin":
            return new AdminCore();
        case "super-admin":
            return new SuperAdminCore();
    }

    throw new Error("Invalid userType while creating user object")
}
