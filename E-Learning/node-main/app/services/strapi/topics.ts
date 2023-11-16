import { a } from "../../../sequelize/locales";
import { RoleType } from "../../../sequelize/types";
import { NotFoundError } from "../../../sequelize/utils/errors";
import { Topic } from "../../thirdparty/strapi";
import { noNameUserUtil } from "./noNameUser";
import { LessonsUtil } from "./lessons";
import { strapi, StrapiCore } from "./strapi-core";
import { studentLesson, StudentLessonsUtil } from "./student-lesson";

export class TopicUtil {
  static async GetTopics(userId: number, role: RoleType): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let noNameUserId = await noNameUserUtil.GetnoNameUserStarpi(userId);
    if (noNameUserId.length <= 0) return [];

    let topics;
    if (role == "teacher")
      topics = await strapi.getTeacherTopics(noNameUserId[0].id, token);
    if (role == "student") {
      let studentLesson = await StudentLessonsUtil.GetStudentLessons(userId);
      let lessons: number[] = [];
      studentLesson.forEach((e: any) => {
        lessons.push(e.lesson?.topic);
      });
      topics = await strapi.getStudentTopics(lessons, token);
    }

    topics.forEach((e: any) => {
      delete e.noNameUser.id;
      delete e.noNameUser.noNameUserId;
    });

    return topics;
  }

  static async PostTopic(topic: Topic, userId: number): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let noNameUser = await noNameUserUtil.GetnoNameUserStarpi(userId);
    topic.noNameUser = noNameUser[0].id;

    let topicRes = await strapi.postTopic(topic, token);
    return topicRes;
  }

  static async GetStudentTopics(lessons: number[]): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let topics = await strapi.getStudentTopics(lessons, token);
    return topics;
  }

  static async GetTopicById(
    topicId: number,
    shouldThrowNotFound: boolean
  ): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let topics = await strapi.getTopicById(topicId, token);

    if (topics.length === 0 && shouldThrowNotFound) {
      throw new NotFoundError(...a("No topic found"));
    }

    return topics;
  }

  static async DeleteTopicById(topic: any): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let lessons: any[] = topic.lessons;
    let deleteLessons = [];

    for (let lesson of lessons) {
      deleteLessons.push(LessonsUtil.DeleteLessonById(lesson));
    }

    let lessonRes: any[] = [];
    if (deleteLessons.length > 0) lessonRes = await Promise.all(deleteLessons);

    let topicRes = await strapi.deleteTopicById(topic.id, token);

    return topicRes;
  }

  static async UpdateTopic(topic: Topic): Promise<any> {
    let token = await StrapiCore.AuthToken();

    let topicRes = await strapi.updateTopic(topic, token);
    return topicRes;
  }
}
