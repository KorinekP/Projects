import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';
import { Event } from '../events/event.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
  ) {}

  async like(userId: number, eventId: number): Promise<Reaction> {
    let reaction = await this.reactionRepository.findOne({ where: { user: { id: userId }, event: { id: eventId } } });
    if (!reaction) {
      reaction = this.reactionRepository.create({ user: { id: userId } as User, event: { id: eventId } as Event, isLiked: true });
    } else {
      reaction.isLiked = true;
    }
    return this.reactionRepository.save(reaction);
  }

  async dislike(userId: number, eventId: number): Promise<Reaction> {
    let reaction = await this.reactionRepository.findOne({ where: { user: { id: userId }, event: { id: eventId } } });
    if (!reaction) {
      reaction = this.reactionRepository.create({ user: { id: userId } as User, event: { id: eventId } as Event, isLiked: false });
    } else {
      reaction.isLiked = false;
    }
    return this.reactionRepository.save(reaction);
  }

  async countLikes(eventId: number): Promise<number> {
    return this.reactionRepository.count({ where: { event: { id: eventId }, isLiked: true } });
  }

  async countDislikes(eventId: number): Promise<number> {
    return this.reactionRepository.count({ where: { event: { id: eventId }, isLiked: false } });
  }

  async getReactionStatus(userId: number, eventId: number): Promise<boolean | null> {
    const reaction = await this.reactionRepository.findOne({ where: { user: { id: userId }, event: { id: eventId } } });
    if (reaction) {
      return reaction.isLiked;
    }
    return null;
  }
}
