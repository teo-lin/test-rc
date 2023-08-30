import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as Joi from '@hapi/joi';

@Injectable()
export class WeatherValidationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const validationResult = weatherValidationSchema.validate(request.query);

        if (validationResult.error) {
            throw new BadRequestException(validationResult.error.message);
        }

        return next.handle();
    }
}

const weatherValidationSchema = Joi.object({
    location: Joi.string().required(),
});
