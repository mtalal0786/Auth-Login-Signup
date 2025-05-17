const Joi = require('joi');

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    // Check if the error is related to password length
    const passwordError = error.details.find(detail =>
      detail.context.key === 'password' && detail.type === 'string.min'
    );

    if (passwordError) {
      return res.status(400).json({ message: "Password Must have 6 characters", error });
    }

    // For other errors (like invalid email, missing fields), respond with 403
    return res.status(403).json({ message: "Email or Password Incorrect", error });
  }

  next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
    });                        

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400)
        .json({ message: "Password Must have 6 characters", error });
    }
    next();
}       

module.exports = {
    signupValidation,
    loginValidation 
};