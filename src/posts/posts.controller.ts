import { Delete, Param, Post, Put, Req } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { PostEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/')
  async getAllPosts(): Promise<PostEntity[]> {
    return await this.postsService.getAllPosts();
  }

  @Get('/:userId')
  async getUserPosts(@Param() userId: any): Promise<PostEntity[]> {
    console.log(userId);
    return await this.postsService.getUserPosts(userId.userId);
  }

  @Post('/')
  async createNewPost(@Req() req: any): Promise<PostEntity> {
    console.log(req.body.author);
    const createdPost = await this.postsService.createPost(
      req.body,
      req.body.author,
    );
    return createdPost;
  }

  @Post('/likePost')
  async likePosts(@Req() req: any) {
    const createdLike = await this.postsService.likePost(
      req.body.token,
      req.body.post,
    );
    /* if (createdLike) { */
    await this.postsService.likedPosts(req.body.post);
    return createdLike;
  }

  @Delete('/:postId')
  async deletePost(@Param('postId') postId: string) {
    console.log(postId);
    const deletedPost = {
      id: postId,
      deleted: await this.postsService.deletePost(postId),
    };

    return deletedPost;
  }

  @Put('/:postid/like')
  async likePost(@Param('postid') postid: string, @Req() req) {
    const token = (req.headers.authorization as string).replace('Bearer ', '');
    const likedPost = {
      postId: postid,
      liked: await this.postsService.likePost(token, postid),
    };
    return likedPost;
  }

  @Delete('/:postid/like')
  async unlikePost(@Param('postid') postid: string, @Req() req) {
    const token = (req.headers.authorization as string).replace('Bearer ', '');
    const unlikedPost = {
      postId: postid,
      unliked: await this.postsService.unlikePost(token, postid),
    };

    return unlikedPost;
  }
}
