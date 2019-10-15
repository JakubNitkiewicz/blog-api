const Joi = require('@hapi/joi')

const newNewsValidation = (data) => {
  const newsSchema = Joi.object({
    title: Joi.string()
      .min(10)
      .max(255)
      .required(),
    introductionText: Joi.string()
      .min(10)
      .max(255)
      .required(),
    expandedText: Joi.string()
      .allow('', null)
      .max(10000)
  })
  return newsSchema.validate(data)
}

module.exports.newNewsValidation = newNewsValidation
