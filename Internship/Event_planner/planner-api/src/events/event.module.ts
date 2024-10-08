import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Author } from '../authors/author.entity';
import { EventService } from './event.service';
import { EventsController } from './event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Author])],
  providers: [EventService],
  controllers: [EventsController],
})
export class EventModule {}
