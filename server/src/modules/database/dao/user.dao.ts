import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import { AbstractDao } from './abstract.dao';

@Injectable()
export class UserDao extends AbstractDao<UserEntity> {
  target = UserEntity;
}
