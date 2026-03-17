import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  CurrentUserInfo,
  JwtPayload,
} from '@modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'temp-secret',
    });
  }

  validate(payload: JwtPayload): CurrentUserInfo {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
