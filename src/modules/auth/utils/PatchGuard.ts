import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export default class JwtPatchGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new UnauthorizedException({
          message: 'User isnt logged in',
        });
      }

      const user = this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (e) {
      throw new HttpException(`${e}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
