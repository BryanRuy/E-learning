import Joi from "joi";
import { ValidationError } from "../utils/errors";

export const UserAddSchema = Joi.object({
  role: Joi.string()
    .valid(...["admin", "super-admin", "teacher", "student"])
    .required()
    .error(new ValidationError("role is required")),

  name: Joi.string()
    .required()
    .error(new ValidationError("Please provide a name")),

  reCaptchaToken: Joi.string()
    .optional()
    .error(new ValidationError("Enable ReCaptcha")),

  email: Joi.string().email().required(),

  password: Joi.string()
    .min(4)
    .max(30)
    .required()
    .error(new ValidationError("Password must be between 8-30 characters")),

  confirmPassword: Joi.ref("password"),
}).with("password", "confirmPassword");
