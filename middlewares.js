const Joi = require('joi')
const { validate: uuidValidate, version: uuidVersion } = require('uuid');

function uuidValidateV4(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

const validateId = (req, res, next) => {
  
  const isValid = uuidValidateV4(req.params.id)

  if (!isValid) {
    return res.status(400).json({ error: 'id is not valid' });
  }

  next();
}

const validateReceipt = (req, res, next) => {
    const schema = Joi.object({
      retailer: Joi.string().pattern(/^.+$/).required(),
      purchaseDate: Joi.string().isoDate().required(),
      purchaseTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
      items: Joi.array().items(
        Joi.object({
          shortDescription: Joi.string().regex(/^.+$/).required(),
          price: Joi.string().regex(/^\d+\.\d{2}$/).required(),
        })
      ).min(1).required(),
      total: Joi.string().regex(/^\d+\.\d{2}$/).required(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    next();
};

module.exports = { validateId, validateReceipt }