import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENTITY_LIST } from './entity';
import { DAO_LIST } from './dao';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'server'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DATABASE_NAME', 'server'),
        entities: ENTITY_LIST,
        autoLoadEntities: false,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [...DAO_LIST],
  exports: [...DAO_LIST],
})
export default class DatabaseModule {}
