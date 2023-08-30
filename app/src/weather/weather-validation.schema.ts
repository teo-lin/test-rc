import Joi from '@hapi/joi';

export const weatherValidationSchema = Joi.object({
    location: Joi.string().required(),
});
