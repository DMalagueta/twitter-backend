import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { HashtagsController } from './hashtags/hashtags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/users.entity';
import { PostEntity } from './posts/posts.entity';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { PostsModule } from './posts/posts.module';
import { HashtagsModule } from './hashtags/hashtags.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'diogo',
      password: '12345',
      database: 'talkline',
      synchronize: true,
      logger: 'advanced-console',
      logging: 'all',
      entities: [UserEntity, PostEntity],
      /* entities: [join(__dirname, '..', '**', '*.entity.js')],  */
      autoLoadEntities: true,
    }),
    UsersModule,
    PostsModule,
    HashtagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
