import { Controller, Get, Param } from '@nestjs/common';

@Controller('hashtags')
export class HashtagsController {
  @Get('/')
  getHashtags(): string {
    return 'hashtags';
  }

  @Get('/:tag/posts')
  getPostsForHastag(@Param('tag') tag): string {
    return `show all posts with hashtag ${tag}`;
  }
}
