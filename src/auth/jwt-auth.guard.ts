import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization as string | undefined;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException('توکن لازم است');
    try {
      const payload = await this.jwt.verifyAsync(header.slice(7));
      request.user = payload;
      return true;
    } catch { throw new UnauthorizedException('توکن نامعتبر یا منقضی شده است'); }
  }
}
