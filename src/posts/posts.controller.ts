import { Controller, Get, Param, Delete, Post, Put } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get('/')
  getAllPosts(): string {
    return 'get all posts';
  }

  @Get('/:postid')
  getPostDetails(@Param() param): string {
    return `details of post id = ${param.postid}`;
  }

  @Post('/')
  createNewPost(): string {
    return 'new post';
  }

  @Delete('/:postid')
  deletePost(@Param() param): string {
    return `delete postid ${param.postid}`;
  }

  @Put('/:postid/like')
  likePost(@Param() param): string {
    return `liked ${param.postid}`;
  }

  @Delete('/:postid/unlike')
  unlikePost(@Param() param): string {
    return `unliked ${param.postid}`;
  }
}
