import { Sequelize } from "sequelize-typescript";
import GlobalConfigs from "./configs";
const dbConfig = GlobalConfigs!.DatabaseConfigurations;
import { Op } from "sequelize";

export const sequelize = new Sequelize({
	dialect: "mysql",
	...dbConfig,
	set:{sql_mode:''},
	models: [__dirname + "/models"],
});

export const op = Op;
export * from "./models/Document";
export * from "./models/Meeting";
export * from "./models/Participant";
export * from "./models/Role";
export * from "./models/Student";
export * from "./models/Teacher";
export * from "./models/TeacherStudent";
export * from "./models/User";
export * from "./models/Test";
export * from "./models/Question";
export * from "./models/Option";
export * from "./models/Attempt";
export * from "./models/ObjectiveAttempt";
export * from "./models/SubjectiveAttempt";
export * from "./models/StudentTest";
export * from "./models/Assignment";
export * from "./models/StudentAssignment";
export * from "./models/AssignmentAttempt";
export * from "./models/Ebook";
export * from "./models/PaymentPlan";
