import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/posts.entity';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { LikesEntity } from './likes.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikesEntity)
    private likesRepository: Repository<LikesEntity>,
  ) {}

  async likePost(post: PostEntity, user: UserEntity): Promise<boolean> {
    const alreadyLiked = await this.getLikedPost(post.id, user.id);

    if (alreadyLiked) {
      return false;
    }

    const newLike = new LikesEntity();
    newLike.post = post;
    newLike.user = user;

    const savedLike = await this.likesRepository.save(newLike);
    return savedLike !== null;
  }

  async unlikePost(postId: string, userId: string): Promise<boolean> {
    const likedPost = await this.getLikedPost(postId, userId);

    if (!likedPost) {
      return false;
    }

    const unlikePost = await this.likesRepository.delete(likedPost.id);
    return unlikePost.affected === 1;
  }

  async getLikedPost(postId: string, userId: string): Promise<LikesEntity> {
    if (!postId || !userId) {
      throw new BadRequestException('Missing postId or userId');
    }

    return await this.likesRepository
      .createQueryBuilder('likes')
      .leftJoinAndSelect('likes.post', 'post')
      .leftJoinAndSelect('likes.user', 'user')
      .where('post.id = :postId', { postId })
      .where('user.id = :userId', { userId })
      .getOne();
  }
}
