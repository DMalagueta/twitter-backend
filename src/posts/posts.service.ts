import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { LikesEntity } from 'src/likes/likes.entity';
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
    @InjectRepository(LikesEntity)
    private likesRepository: Repository<LikesEntity>,
  ) {}

  async getAllPosts(): Promise<Array<PostEntity>> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.origPost', 'origPost')
      .addSelect('origPost.author')
      .leftJoinAndSelect('origPost.author', 'origPostAuthor')
      .leftJoinAndSelect('posts.replyTo', 'replyTo');

    return queryBuilder.addSelect('posts.created_at').limit(100).getMany();
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

  async getUserPosts(userId: string): Promise<Array<PostEntity>> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.origPost', 'origPost')
      .addSelect('origPost.author')
      .leftJoinAndSelect('posts.replyTo', 'replyTo');

    return queryBuilder
      .where('author.id = :userId', { userId })
      .addSelect('posts.created_at')
      .limit(100)
      .getMany();
  }

  async deletePost(id: string): Promise<boolean> {
    const deleteResult = await this.postsRepository.delete({ id });
    return deleteResult.affected === 1;
  }

  async createPost(
    post: Partial<PostEntity>,
    author: UserEntity,
  ): Promise<PostEntity> {
    console.log(post, author);
    const newPost = new PostEntity();
    newPost.text = post.text;
    newPost.author = author;

    const savedPost = await this.postsRepository.save(newPost);
    return savedPost;
  }

  async likePost(token: string, postId: string): Promise<boolean> {
    return await this.likeUnlikePostHelper(token, postId, 'like');
  }
  async unlikePost(token: string, postId: string): Promise<boolean> {
    return await this.likeUnlikePostHelper(token, postId, 'unlike');
  }

  async likedPosts(postId: string) {
    return this.postsRepository
      .createQueryBuilder()
      .update('posts')
      .set({ likeCount: () => 'like_count + 1' })
      .where('id = :postId', { postId })
      .execute();
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
