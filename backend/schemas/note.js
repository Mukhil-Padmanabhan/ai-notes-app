const Joi = require('joi');

const createNoteSchema = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().min(10).required(),
});

const updateNoteSchema = Joi.object({
  title: Joi.string().min(1).optional(),
  content: Joi.string().min(10).optional(),
});

module.exports = {
  createNoteSchema,
  updateNoteSchema,
};
