import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import qs from "qs";
import FormData from "form-data";
import { studentLesson } from "../services/strapi/student-lesson";

export interface Article {
  Title: string;
  Description: string;
  Content: string;
  PublishedDate: string;
  noNameUser: number;
  MainImage?: number;
}

export interface Lesson {
  id?: number;
  Title: string;
  Description: string;
  Content: string;
  videoUrl?: string;
  topic?: number;
}

export interface Topic {
  id?: number;
  title: string;
  description: string;
  noNameUser: number;
  image?: number;
}

export interface Comment {
  Text: string;
  blog: number;
  userId?: number;
  noNameUser?: number;
}

export interface Authentication {
  user: object;
  token: string;
}

export interface noNameUser {
  id?: number;
  name: string;
  profilePicture?: string;
  email: string;
  type?: string;
  noNameUserId?: number;
  noNameUserUuid?: string;
}

export declare type Provider = "facebook" | "google" | "github" | "twitter";

export interface ProviderToken {
  access_token?: string;
  code?: string;
  oauth_token?: string;
}

export interface CookieConfig {
  key: string;
  options: object;
}

export interface LocalStorageConfig {
  key: string;
}

export interface StoreConfig {
  cookie?: CookieConfig | false;
  localStorage?: LocalStorageConfig | false;
}

export default class Strapi {
  axios: AxiosInstance;
  storeConfig: StoreConfig;
  /**
   * Default constructor.
   * @param baseURL Your Strapi host.
   * @param axiosConfig Extend Axios configuration.
   */
  constructor(
    baseURL: string,
    storeConfig?: StoreConfig,
    requestConfig?: AxiosRequestConfig
  ) {
    this.axios = axios.create(
      Object.assign({ baseURL, paramsSerializer: qs.stringify }, requestConfig)
    );
    this.storeConfig = Object.assign(
      {
        cookie: {
          key: "jwt",
          options: {
            path: "/",
          },
        },
        localStorage: {
          key: "jwt",
        },
      },
      storeConfig
    );
  }
  /**
   * Axios request
   * @param method Request method
   * @param url Server URL
   * @param requestConfig Custom Axios config
   */
  async request(
    method: string,
    url: string,
    requestConfig?: AxiosRequestConfig
  ): Promise<any> {
    try {
      const response = await this.axios.request(
        Object.assign(
          {
            method,
            url,
          },
          requestConfig
        )
      );
      return response.data;
    } catch (error: any) {
      console.log("STRAPI BASE ERROR", error);
      console.log("STRAPI BASE ERROR Message", error.message);
      console.log(`error.response.data`, JSON.stringify(error.response.data));
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw error;
      }
    }
  }

  /**
   * Register a new user.
   * @param username
   * @param email
   * @param password
   * @returns Authentication User token and profile
   */
  async registerAdmin(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<Authentication> {
    this.clearToken();
    const authentication = await this.request("post", "/admin/register-admin", {
      data: {
        email,
        password,
        firstname,
        lastname,
      },
    });
    this.setToken(authentication.jwt);
    return authentication;
  }

  /**
   * Login by getting an authentication token.
   * @param email
   * @param password
   * @returns Authentication User token and profile
   */
  async loginAdmin(email: string, password: string): Promise<Authentication> {
    this.clearToken();
    const authentication = await this.request("post", "/admin/login", {
      data: {
        email,
        password,
      },
    });
    this.setToken(authentication.jwt);
    return authentication;
  }

  /**
   * get categories.
   * @param token
   * @returns categories
   */
  async getCategories(token: string): Promise<any> {
    const categories = await this.request("get", `/categories`, {
      headers: {
        Authorization: token,
      },
    });
    return categories;
  }

  //******************************************/
  //**********noName USER METHODS STARTS*****/
  //******************************************/
  /**
   * create account for noNameUser.
   * @param noNameUser
   * @param token
   * @returns noNameUser with created and updated by
   */
  async createnoNameUser(noNameUser: noNameUser, token: string): Promise<any> {
    const noNameUsers = await this.request("post", "/noName-users", {
      data: {
        ...noNameUser,
      },
      headers: {
        Authorization: token,
      },
    });
    return noNameUsers;
  }

  /**
   * update account for noNameUser.
   * @param noNameUser
   * @param token
   * @returns noNameUser with created and updated by
   */
  async updatenoNameUser(noNameUser: noNameUser, token: string): Promise<any> {
    const noNameUsers = await this.request(
      "put",
      `/noName-users/${noNameUser.id}`,
      {
        data: {
          ...noNameUser,
        },
        headers: {
          Authorization: token,
        },
      }
    );
    return noNameUsers;
  }

  /**
   * Get noNameUserId By Id
   * @param Id of noNameUser
   * @returns noNameUser
   */
  async getnoNameUserById(Id: number, token: string): Promise<any> {
    return await this.request("get", `/noName-users?noNameUserId=${Id}`, {
      headers: {
        Authorization: token,
      },
    });
  }

  /**
   * Get noNameUserId By Id
   * @param noNameUser of noNameUserId
   */
  async getnoNameUsersByIds(ids: number[], token: string): Promise<any> {
    let query = qs.stringify({ _where: { noNameUserId: ids } });
    let queryParams;
    for (let id of ids) {
      queryParams = queryParams
        ? queryParams + `&noNameUserId_in=${id}`
        : `?noNameUserId_in=${id}`;
    }
    return await this.request("get", `/noName-users${queryParams}`, {
      headers: {
        Authorization: token,
      },
    });
  }

  /**
   * Get Writers
   * @param token auth token
   */
  async getnoNameUsers(token: string): Promise<any> {
    return await this.request("get", `/noName-users`, {
      headers: {
        Authorization: token,
      },
    });
  }

  //******************************************/
  //**********noName USER METHODS ENDS*****/
  //******************************************/

  //******************************************/
  //**********BLOGS METHODS STARTS*****/
  //******************************************/
  /**
   * post blog.
   * @param article
   * @param token
   * @returns article posted
   */
  async postBlog(article: Article, token: string): Promise<any> {
    const articleRes = await this.request("post", "/blogs", {
      data: {
        ...article,
      },
      headers: {
        Authorization: token,
      },
    });
    return articleRes;
  }

  /**
   * get blog.
   * @param token
   * @returns blogs array list
   */
  async getBlogs(offset: number, limit: number, token: string): Promise<any> {
    const articleRes = await this.request(
      "get",
      `/blogs?_start=${offset}&_limit=${limit}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return articleRes;
  }

  /**
   * get blog.
   * @param Id
   * @param token
   * @returns blog
   */
  async getBlog(Id: number, token: string): Promise<any> {
    const articleRes = await this.request("get", `/blogs/${Id}`, {
      headers: {
        Authorization: token,
      },
    });
    return articleRes;
  }

  /**
   * post Comment.
   * @param comment
   * @param token
   * @returns comment posted
   */
  async posComment(comment: Comment, token: string): Promise<any> {
    const commentRes = await this.request("post", "/comments", {
      data: {
        ...comment,
      },
      headers: {
        Authorization: token,
      },
    });
    return commentRes;
  }

  /**
   * get blog.
   * @param blogId
   * @param token
   * @returns blog
   */
  async getBlogComments(blogId: number, token: string): Promise<any> {
    const blogComments = await this.request(
      "get",
      `/comments?blogs=${blogId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return blogComments;
  }

  //******************************************/
  //**********BLOGS METHODS ENDS*****/
  //******************************************/

  //******************************************/
  //**********UPLOAD FILES METHODS STARTS*****/
  //******************************************/

  /**
   * Get files
   * @param params Filter and order queries
   * @returns Object[] Files data
   */
  getFiles(params?: AxiosRequestConfig["params"]): Promise<object[]> {
    return this.request("get", "/upload/files", {
      params,
    });
  }

  /**
   * Get file
   * @param id ID of entry
   */
  getFile(id: number, token: string): Promise<object> {
    return this.request("get", `/upload/files/${id}`, { headers: token });
  }

  //******************************************/
  //**********UPLOAD FILES METHODS ENDS*****/
  //******************************************/

  //******************************************/
  //**********TOPICS METHODS STARTS*****/
  //******************************************/

  /**
   * get topics.
   * @param token
   * @returns topics
   */
  async getTopicById(id: number, token: string): Promise<any> {
    const topics = await this.request("get", `/topics?id=${id}`, {
      headers: {
        Authorization: token,
      },
    });
    return topics;
  }

  /**
   * post topics.
   * @param topic
   * @param token
   * @returns topic
   */
  async postTopic(topic: Topic, token: string): Promise<any> {
    const topicRes = await this.request("post", `/topics`, {
      data: {
        ...topic,
      },
      headers: {
        Authorization: token,
      },
    });
    return topicRes;
  }

  /**
   * Update topics.
   * @param topic
   * @param token
   * @returns topic
   */
  async updateTopic(topic: Topic, token: string): Promise<any> {
    const topicRes = await this.request("put", `/topics/${topic.id}`, {
      data: {
        ...topic,
      },
      headers: {
        Authorization: token,
      },
    });
    return topicRes;
  }

  /**
   * get topics.
   * @param token
   * @returns topics
   */
  async deleteTopicById(id: number, token: string): Promise<any> {
    const topics = await this.request("delete", `/topics/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    return topics;
  }

  /**
   * get topics.
   * @param token
   * @returns topics
   */
  async getTeacherTopics(id: number, token: string): Promise<any> {
    const topics = await this.request("get", `/topics?noNameUser=${id}`, {
      headers: {
        Authorization: token,
      },
    });
    return topics;
  }

  /**
   * get topics.
   * @param token
   * @returns topics
   */
  async getStudentTopics(ids: number[], token: string): Promise<any> {
    let url;
    for (let id of ids) {
      if (url) url = url + `&id_in=${id}`;
      else url = `?id_in=${id}`;
    }

    const topics = await this.request("get", `/topics${url}`, {
      headers: {
        Authorization: token,
      },
    });
    return topics;
  }

  //******************************************/
  //**********TOPICS METHODS ENDS*****/
  //******************************************/

  //******************************************/
  //**********LESSONS METHODS STARTS*****/
  //******************************************/
  /**
   * post lessons.
   * @param lesson
   * @param token
   * @returns lessons
   */
  async postLessons(lesson: Lesson, token: string): Promise<any> {
    const lessonRes = await this.request("post", `/lessons`, {
      data: {
        ...lesson,
      },
      headers: {
        Authorization: token,
      },
    });
    return lessonRes;
  }

  /**
   * update lessons.
   * @param lesson
   * @param token
   * @returns lessons
   */
  async updateLessons(lesson: Lesson, token: string): Promise<any> {
    const lessonRes = await this.request("put", `/lessons/${lesson.id}`, {
      data: {
        ...lesson,
      },
      headers: {
        Authorization: token,
      },
    });
    return lessonRes;
  }

  /**
   * get lessons.
   * @param token
   * @param id
   * @returns lessons
   */
  async getAllLessonsOfTopic(id: number, token: string): Promise<any> {
    const lessons = await this.request("get", `/lessons?topic=${id}`, {
      headers: {
        Authorization: token,
      },
    });
    return lessons;
  }

  /**
   * get student lessons.
   * @param token
   * @param topicId
   * @param ids
   * @returns lessons
   */
  async getLessonsOfStudentTopic(
    ids: number[],
    token: string,
    topicId: any = undefined
  ): Promise<any> {
    let url;
    for (let id of ids) {
      url = url ? url + `&id_in=${id}` : `?id_in=${id}`;
    }
    url = topicId ? `${url}&topic=${topicId}` : url;
    const lessons = await this.request("get", `/lessons${url}`, {
      headers: {
        Authorization: token,
      },
    });
    return lessons;
  }

  /**
   * get student lessons.
   * @param token
   * @param topicId
   * @param ids
   * @returns student lessons count
   */
  async getLessonsCountOfStudent(
    isCompleted: boolean,
    userId: number,
    token: string
  ): Promise<any> {
    const lessonsCount = await this.request(
      "get",
      `/student-lessons/count?isCompleted=${isCompleted}&noNameUser=${userId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return lessonsCount;
  }

  /**
   * get lessons.
   * @param lessonId
   * @param token
   * @returns Lesson
   */
  async getAllLessonsByTopics(topicIds: any[], token: string): Promise<any> {
    let queryParams;
    for (let id of topicIds) {
      queryParams = queryParams
        ? queryParams + `&topic_in=${id}`
        : `?topic_in=${id}`;
    }
    const lessons = await this.request("get", `/lessons${queryParams}`, {
      headers: {
        Authorization: token,
      },
    });
    return lessons;
  }

  /**
   * get lessons.
   * @param lessonId
   * @param token
   * @returns Lesson
   */
  async getLessonById(lessonId: number, token: string): Promise<any> {
    const lessons = await this.request("get", `/lessons?id=${lessonId}`, {
      headers: {
        Authorization: token,
      },
    });
    return lessons;
  }

  /**
   * get lessons.
   * @param lessonId
   * @param token
   * @returns Lesson
   */
  async getLessonByIds(lessonIds: number[], token: string): Promise<any> {
    let queryParams;
    for (let id of lessonIds) {
      queryParams = queryParams ? queryParams + `&id_in=${id}` : `?id_in=${id}`;
    }
    const lessons = await this.request("get", `/lessons${queryParams}`, {
      headers: {
        Authorization: token,
      },
    });
    return lessons;
  }

  /**
   * delete lessons.
   * @param topicId
   * @param token
   * @returns Lesson
   */
  async deleteLessonByTopic(topicId: number, token: string): Promise<any> {
    const lessons = await this.request("delete", `/lessons?topic=${topicId}`, {
      headers: {
        Authorization: token,
      },
    });
    return lessons;
  }

  /**
   * delete lessons.
   * @param lessonId
   * @param token
   * @returns Lesson
   */
  async deleteLessonById(lessonId: number, token: string): Promise<any> {
    const lessons = await this.request("delete", `/lessons/${lessonId}`, {
      headers: {
        Authorization: token,
      },
    });
    return lessons;
  }

  /**
   * delete lessons.
   * @param lessonIds
   * @param token
   * @returns Lesson
   */
  async deleteLessonByIds(lessonIds: number[], token: string): Promise<any> {
    let queryParams;
    for (let Id of lessonIds) {
      let url = `_where[_in][id]=${Id}`;
      queryParams = queryParams ? queryParams + url : url;
    }
    console.log("delete query params ==>", queryParams);

    const lessons = await this.request("delete", `/lessons${queryParams}`, {
      headers: {
        Authorization: token,
      },
    });
    return lessons;
  }

  //******************************************/
  //**********LESSONS METHODS ENDS*****/
  //******************************************/

  //******************************************/
  //**********STUDENT LESSONS METHODS STARTS*****/
  //******************************************/
  /**
   * delete Student lessons.
   * @param studentLesssonId
   * @param token
   * @returns studentLesson
   */
  async unassignOrDeleteLessonToStudentsByIds(
    studentLesssonId: number[],
    token: string
  ): Promise<any> {
    let queryParams;
    for (let id of studentLesssonId) {
      queryParams = queryParams ? queryParams + `&id_in=${id}` : `?id_in=${id}`;
    }
    const studentLesson = await this.request(
      "delete",
      `/student-lessons${queryParams}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return studentLesson;
  }

  /**
   * delete Student lessons.
   * @param studentLesssonId
   * @param token
   * @returns studentLesson
   */
  async unassignOrDeleteLessonToStudent(
    studentLesssonId: number,
    token: string
  ): Promise<any> {
    const studentLesson = await this.request(
      "delete",
      `/student-lessons/${studentLesssonId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return studentLesson;
  }

  /**
   * post lessons.
   * @param data
   * @param token
   * @returns studentLesson
   */
  async assignLessonToStudent(
    data: studentLesson,
    token: string
  ): Promise<any> {
    const assignRes = await this.request("post", `/student-lessons`, {
      data: {
        ...data,
      },
      headers: {
        Authorization: token,
      },
    });
    return assignRes;
  }

  /**
   * get lessons.
   * @param lessonId
   * @param studentId
   * @param token
   * @returns studentLesson
   */
  async getStudentLessonByLessonIdAndStudentId(
    lessonId: number,
    studentId: number,
    token: string
  ): Promise<any> {
    const studentLesson = await this.request(
      "get",
      `/student-lessons?lesson=${lessonId}&noNameUser=${studentId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return studentLesson;
  }

  /**
   * gte lessons.
   * @param studentId
   * @param token
   * @returns studentLesson
   */
  async getStudentLessons(studentId: number, token: string): Promise<any> {
    const studentLessons = await this.request(
      "get",
      `/student-lessons?noNameUser=${studentId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return studentLessons;
  }

  /**
   * get lessons.
   * @param lessonId
   * @param token
   * @returns studentLesson
   */
  async getStudentLessonsByLesson(
    lessonId: number,
    token: string
  ): Promise<any> {
    const studentLessons = await this.request(
      "get",
      `/student-lessons?lesson=${lessonId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return studentLessons;
  }

  /**
   * get delete student lessons.
   * @param lessonId
   * @param token
   * @returns studentLesson
   */
  async deleteStudentLessonsByLesson(
    lessonId: number,
    token: string
  ): Promise<any> {
    const studentLessons = await this.request(
      "delete",
      `/student-lessons?lesson=${lessonId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return studentLessons;
  }

  /**
   * post studentLessons
   * @param isCompleted
   * @param studentLessonId
   * @param token
   * @returns topic
   */
  async updateStudentLesson(
    isCompleted: boolean,
    studentLessonId: number,
    token: string
  ): Promise<any> {
    const studentLessons = await this.request(
      "put",
      `/student-lessons/${studentLessonId}`,
      {
        data: {
          isCompleted,
        },
        headers: {
          Authorization: token,
        },
      }
    );
    return studentLessons;
  }

  /**
   * get getStudentLessonsByIds
   * @param token
   * @param id
   * @returns studentLessons
   */
  async getStudentLessonsByIds(ids: number[], token: string): Promise<any> {
    let url;
    for (let id of ids) {
      url = url ? url + `&id_in=${id}` : `?id_in=${id}`;
    }

    const studentLessons = await this.request("get", `/student-lessons${url}`, {
      headers: {
        Authorization: token,
      },
    });
    return studentLessons;
  }

  //******************************************/
  //**********STUDENT LESSONS METHODS ENDS*****/
  //******************************************/

  //******************************************/
  //*****RICH TEXT CONTENT METHODS STARTS*****/
  //******************************************/

  /**
   * getContent
   * @param token
   * @param id
   * @returns content
   */
  async getContentBySlug(slug: any, token: string): Promise<any> {
    const content = await this.request("get", `/contents?slug=${slug}`, {
      headers: {
        Authorization: token,
      },
    });
    return content;
  }

  //******************************************/
  //*****RICH TEXT CONTENT METHODS ENDS*****/
  //******************************************/
  /**
   * Upload files
   *
   * ### Browser example
   * ```js
   * const form = new FormData();
   * form.append('files', fileInputElement.files[0], 'file-name.ext');
   * form.append('files', fileInputElement.files[1], 'file-2-name.ext');
   * const files = await strapi.upload(form);
   * ```
   *
   * ### Node.js example
   * ```js
   * const FormData = require('form-data');
   * const fs = require('fs');
   * const form = new FormData();
   * form.append('files', fs.createReadStream('./file-name.ext'), 'file-name.ext');
   * const files = await strapi.upload(form, {
   *   headers: form.getHeaders()
   * });
   * ```
   *
   * @param data FormData
   * @param requestConfig
   */

  public upload(
    data: FormData,
    requestConfig?: AxiosRequestConfig
  ): Promise<object> {
    return this.request("post", "/upload", {
      data,
      ...requestConfig,
    });
  }

  /**
   * Set token on Axios configuration
   * @param token Retrieved by register or login
   */
  setToken(token: string, comesFromStorage?: boolean): void {
    this.axios.defaults.headers.common.Authorization = "Bearer " + token;
  }

  /**
   * Remove token from Axios configuration
   */
  clearToken(): void {
    delete this.axios.defaults.headers.common.Authorization;
  }
}
