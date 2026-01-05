import Logger from "../utils/logger-wrapper";
import axios from "axios";
import { config } from "../config/environment.config";

export class MoodleService {
  /**
   * Crear usuario en Moodle vía Web Services API
   */
  static async createUserInMoodle(userData: {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    password?: string;
  }) {
    try {
      const moodleUrl = config.moodle.url;
      const moodleToken = config.moodle.apiToken;

      const params = new URLSearchParams({
        wstoken: moodleToken,
        wsfunction: "core_user_create_users",
        moodlewsrestformat: "json",
        "users[0][username]": userData.username,
        "users[0][email]": userData.email,
        "users[0][firstname]": userData.firstname,
        "users[0][lastname]": userData.lastname,
        "users[0][password]": userData.password || this.generateRandomPassword(),
        "users[0][auth]": "manual",
      });

      const response = await axios.post(
        `${moodleUrl}/webservice/rest/server.php`,
        params
      );

      Logger.info(`User created in Moodle: ${userData.email}`);
      return response.data[0];
    } catch (error) {
      Logger.error("Error creating user in Moodle", error);
      throw error;
    }
  }

  /**
   * Obtener usuario de Moodle por email
   */
  static async getUserByEmail(email: string) {
    try {
      const moodleUrl = config.moodle.url;
      const moodleToken = config.moodle.apiToken;

      const params = new URLSearchParams({
        wstoken: moodleToken,
        wsfunction: "core_user_get_users_by_field",
        moodlewsrestformat: "json",
        field: "email",
        "values[0]": email,
      });

      const response = await axios.post(
        `${moodleUrl}/webservice/rest/server.php`,
        params
      );

      return response.data[0] || null;
    } catch (error) {
      Logger.error("Error getting user from Moodle", error);
      return null;
    }
  }

  /**
   * Inscribir usuario en curso
   */
  static async enrollUserInCourse(userId: number, courseId: number, roleId: number = 5) {
    try {
      const moodleUrl = config.moodle.url;
      const moodleToken = config.moodle.apiToken;

      const params = new URLSearchParams({
        wstoken: moodleToken,
        wsfunction: "enrol_manual_enrol_users",
        moodlewsrestformat: "json",
        "enrolments[0][roleid]": roleId.toString(), // 5 = Student
        "enrolments[0][userid]": userId.toString(),
        "enrolments[0][courseid]": courseId.toString(),
      });

      const response = await axios.post(
        `${moodleUrl}/webservice/rest/server.php`,
        params
      );

      Logger.info(`User ${userId} enrolled in course ${courseId}`);
      return response.data;
    } catch (error) {
      Logger.error("Error enrolling user in course", error);
      throw error;
    }
  }

  /**
   * Generar contraseña aleatoria
   */
  private static generateRandomPassword(): string {
    return Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
  }
}
