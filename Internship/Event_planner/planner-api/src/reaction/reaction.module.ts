import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './reaction.entity';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { Event } from '../events/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction, Event])],
  providers: [ReactionService],
  controllers: [ReactionController],
})
export class ReactionModule {}
