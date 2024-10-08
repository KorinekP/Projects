import { Controller, Put, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReactionService } from './reaction.service';

@ApiTags('reactions')
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @ApiOperation({ summary: 'User reacts with a like to the event' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Event liked successfully.' })
  @Put(':userId/like/:eventId')
  async like(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.reactionService.like(userId, eventId);
  }

  @ApiOperation({ summary: 'User reacts with a dislike to the event' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Event disliked successfully.' })
  @Put(':userId/dislike/:eventId')
  async dislike(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.reactionService.dislike(userId, eventId);
  }

  @ApiOperation({ summary: 'Count the likes for an event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Number of likes for the event.' })
  @Get(':eventId/likes')
  async countLikes(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.reactionService.countLikes(eventId);
  }

  @ApiOperation({ summary: 'Count the dislikes for an event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Number of dislikes for the event.' })
  @Get(':eventId/dislikes')
  async countDislikes(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.reactionService.countDislikes(eventId);
  }

  @ApiOperation({ summary: 'Get the reaction status of a user for an event (liked/disliked/neither)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Reaction status for the event.' })
  @Get(':userId/status/:eventId')
  async getReactionStatus(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.reactionService.getReactionStatus(userId, eventId);
  }
}
