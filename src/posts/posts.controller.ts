import { Controller, Get, Param, Delete, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  @Get('/')
  getAllPosts(): string {
    return 'get all posts';
  }

  @Get('/:postid')
  getPostDetails(@Param('postid') postid: string): string {
    return `details of post id = ${postid}`;
  }

  @Post('/')
  createNewPost(): string {
    return 'new post';
  }

  @Delete('/:postid')
  deletePost(@Param('postid') postid: string): string {
    return `delete postid ${postid}`;
  }

  @Put('/:postid/like')
  likePost(@Param('postid') postid: string): string {
    return `liked ${postid}`;
  }

  @Delete('/:postid/unlike')
  unlikePost(@Param('postid') postid: string): string {
    return `unliked ${postid}`;
  }
}
