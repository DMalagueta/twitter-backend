import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('hashtags')
@Controller('hashtags')
export class HashtagsController {
  @Get('/')
  getHashtags(): string {
    //TODO : ADD LOGIC

    return 'hashtags';
  }

  @Get('/:tag/posts')
  getPostsForHastag(@Param('tag') tag): string {
    return `show all posts with hashtag ${tag}`;
  }
}
