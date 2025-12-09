import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { map } from "rxjs";

@Injectable()
export class UserResponseInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler) {
      console.log('UserResponseInterceptor')
      return next.handle().pipe(
         map((data) => {
            if (data) {
               delete data.password;
               delete data.token;
            }
            return data;
         }),
      );
   }
}
