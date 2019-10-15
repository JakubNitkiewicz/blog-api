const Joi = require('@hapi/joi')

const signupValidation = (data) => {
  const userSchema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(30)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
  })
  return userSchema.validate(data)
}

const loginValidation = (data) => {
  const userSchema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
  })
  return userSchema.validate(data)
}

module.exports.signupValidation = signupValidation
module.exports.loginValidation = loginValidation
