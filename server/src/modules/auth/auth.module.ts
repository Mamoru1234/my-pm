import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import DatabaseModule from '../database/database.module';
import AuthService from './auth.service';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30m', algorithm: 'HS512' },
        verifyOptions: { algorithms: ['HS512'] },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
})
export default class AuthModule {}
