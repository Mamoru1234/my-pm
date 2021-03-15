import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AuthModule from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
