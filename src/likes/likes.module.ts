import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesController } from './likes.controller';
import { LikesEntity } from './likes.entity';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([LikesEntity])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
