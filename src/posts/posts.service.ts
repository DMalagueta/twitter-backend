import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { LikesService } from 'src/likes/likes.service';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { PostEntity } from './posts.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly likesService: LikesService,
    private readonly authService: AuthService,
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {}

  async getAllPosts(
    authorId?: string,
    hashtags?: string[] | null,
  ): Promise<Array<PostEntity>> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.origPost', 'origPost')
      .addSelect('origPost.author')
      .leftJoinAndSelect('origPost.author', 'origPostAuthor')
      .addSelect('replyTo.author')
      .leftJoinAndSelect('replyTo.author', 'replyToAuthor');

    if (authorId) {
      queryBuilder.where('posts.author = :authorId', { authorId });
    }

    if (hashtags && hashtags.length > 0) {
      // TODO:
    }

    return queryBuilder
      .addSelect('posts.created_at')
      .orderBy('posts.created_at', 'DESC')
      .limit(100)
      .getMany();
  }

  async getPost(id: string): Promise<PostEntity> {
    return this.postsRepository.findOne({
      where: { id },
      relations: [
        'author',
        'origPost',
        'origPost.author',
        'replyTo',
        'replyTo.author',
      ],
    });
  }

  async deletePost(id: string): Promise<boolean> {
    const deleteResult = await this.postsRepository.delete({ id });
    return deleteResult.affected === 1;
  }

  async createPost(
    post: Partial<PostEntity>,
    author: UserEntity,
    originalPostId: any,
    replyToPostId: any,
  ): Promise<PostEntity> {
    if (!post.text && !originalPostId) {
      throw new BadRequestException('Post must contain text');
    }

    if (originalPostId && replyToPostId) {
      throw new BadRequestException('Repost');
    }

    const newPost = new PostEntity();
    newPost.text = post.text;
    newPost.author = author;

    if (originalPostId) {
      const origPost = await this.postsRepository.findOne(originalPostId);
      if (!origPost) {
        throw new NotFoundException('Original post not found');
      }
      newPost.origPost = origPost;
    }

    if (replyToPostId) {
      const replyTo = await this.postsRepository.findOne(replyToPostId);
      if (!replyTo) {
        throw new NotFoundException('Original Post not found');
      }
      newPost.replyTo = replyTo;
    }

    const savedPost = await this.postsRepository.save(newPost);
    return savedPost;
  }

  async likePost(token: string, postId: string): Promise<boolean> {
    return await this.likeUnlikePostHelper(token, postId, 'like');
  }
  async unlikePost(token: string, postId: string): Promise<boolean> {
    return await this.likeUnlikePostHelper(token, postId, 'unlike');
  }

  private async likeUnlikePostHelper(
    token: string,
    postId: string,
    type: 'like' | 'unlike',
  ) {
    const user = await this.authService.getUserFromSessionToken(token);

    const post = await this.getPost(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return type === 'like'
      ? await this.likesService.likePost(post, user)
      : await this.likesService.unlikePost(postId, user.id);
  }
}
