/**
 * @param {*} schema 
 * @returns ErrorObject{}
 * @description Does the validation for APIs when called
 */
const validate = (schema) => {
    return (req, res, next) => {
      const options = { abortEarly: false, allowUnknown: false };
      const { error } = schema.validate(req.body, options);
      if (error) {
        return res.status(400).json({
          status: 'Error',
          message: 'Validation error',
          details: error.details.map((d) => d.message),
        });
      }
      next();
    };
  };
  
  module.exports = validate;
  