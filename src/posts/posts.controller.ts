import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Put,
  Query,
  Body,
} from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.decorator';
import { UserEntity } from 'src/users/users.entity';
import { PostEntity } from './posts.entity';
import { PostsService } from './posts.service';

class PostDetailsQueryParams {
  @ApiPropertyOptional() authorId: string;
  @ApiPropertyOptional() hashtag: string[];
}

class PostCreateRequestBody {
  @ApiProperty() text: string;
  @ApiPropertyOptional() originalPostId: string;
  @ApiPropertyOptional() replyToPostId: string;
}

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/')
  async getAllPosts(
    @Query() query: PostDetailsQueryParams,
  ): Promise<PostEntity[]> {
    return await this.postsService.getAllPosts(query.authorId);
  }

  @Get('/:postid')
  async getPostDetails(@Param('postId') postId: string): Promise<PostEntity> {
    return await this.postsService.getPost(postId);
  }

  @Post('/')
  async createNewPost(
    @User() author: UserEntity,
    @Body() post: PostCreateRequestBody,
  ): Promise<PostEntity> {
    const createdPost = await this.postsService.createPost(
      post,
      author,
      post.originalPostId,
      post.replyToPostId,
    );
    return createdPost;
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
