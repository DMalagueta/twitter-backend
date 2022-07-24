import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesEntity } from 'src/likes/likes.entity';
import { LikesModule } from 'src/likes/likes.module';
import { LikesService } from 'src/likes/likes.service';
import { PostsController } from './posts.controller';
import { PostEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, LikesEntity]), LikesModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
