import { Controller, Get, Param } from '@nestjs/common';

@Controller('hashtags')
export class HashtagsController {

    @Get('/')
    getHashtags() :string {
        //TODO : ADD LOGIC

        return 'hashtags';
    }

    @Get('/:tag/posts')
    getPostsForHastag(@Param() param):string {
        return `show all posts with hashtag ${param.tag}`
    }

}
