import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserDao } from '../../database/dao/user.dao';
import { Connection } from 'typeorm';
import { TokenType } from '../dto/token.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userDao: UserDao,
    private readonly connection: Connection,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (payload.tokenType !== TokenType.AUTH) {
      throw new UnauthorizedException();
    }
    const user = await this.userDao.findOne(this.connection.manager, {
      where: {
        id: payload.sub,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.email !== payload.username) {
      throw new UnauthorizedException('Email changed');
    }
    return user;
  }
}
