import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
  async login(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { OR: [{ email: identifier }, { phone: identifier }] } });
    if (!user || user.status !== 'ACTIVE' || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedException('اطلاعات ورود معتبر نیست');
    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role, status: user.status });
    return { accessToken, tokenType: 'Bearer', expiresIn: this.config.get('JWT_ACCESS_TTL', '15m'), user: { id: user.id, displayName: user.displayName, role: user.role } };
  }
}
