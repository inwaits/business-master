const Joi = require('joi');
const { USER_ROLES } = require('../config/constants');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  
  role: Joi.string().valid(USER_ROLES.TUTOR, USER_ROLES.PARENT).required().messages({
    'any.only': 'Role must be either TUTOR or PARENT',
    'any.required': 'Role is required',
  }),
  
  // Common fields
  fullName: Joi.string().required().messages({
    'any.required': 'Full name is required',
  }),
  
  phoneNumber: Joi.string().required().messages({
    'any.required': 'Phone number is required',
  }),
  
  address: Joi.string().required(),
  city: Joi.string().required(),
  province: Joi.string().required(),
  
  // Tutor-specific fields
  nicPassport: Joi.when('role', {
    is: USER_ROLES.TUTOR,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  
  dateOfBirth: Joi.when('role', {
    is: USER_ROLES.TUTOR,
    then: Joi.date().required(),
    otherwise: Joi.forbidden(),
  }),
  
  university: Joi.when('role', {
    is: USER_ROLES.TUTOR,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  
  degree: Joi.when('role', {
    is: USER_ROLES.TUTOR,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  
  graduationYear: Joi.when('role', {
    is: USER_ROLES.TUTOR,
    then: Joi.number().integer().min(1970).max(new Date().getFullYear()).required(),
    otherwise: Joi.forbidden(),
  }),
  
  yearsOfExperience: Joi.when('role', {
    is: USER_ROLES.TUTOR,
    then: Joi.number().integer().min(0),
    otherwise: Joi.forbidden(),
  }),
  
  bio: Joi.when('role', {
    is: USER_ROLES.TUTOR,
    then: Joi.string().allow(''),
    otherwise: Joi.forbidden(),
  }),
  
  // Parent-specific fields
  students: Joi.when('role', {
    is: USER_ROLES.PARENT,
    then: Joi.array().items(
      Joi.object({
        fullName: Joi.string().required(),
        gradeId: Joi.string().required(),
        school: Joi.string().allow(''),
        dateOfBirth: Joi.date(),
      })
    ).min(1).required(),
    otherwise: Joi.forbidden(),
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};

