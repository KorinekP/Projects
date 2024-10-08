import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { Author } from '../authors/author.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find({ relations: ['authors', 'createdBy'] });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id }, relations: ['authors', 'createdBy'] });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const authors = await this.authorRepository.findByIds(createEventDto.authors);
    const newEvent = this.eventRepository.create({ ...createEventDto, authors});
    return await this.eventRepository.save(newEvent);
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    let authors = [];
    if (updateEventDto.authors) {
      authors = await this.authorRepository.findByIds(updateEventDto.authors);
    }

    event.authors = authors;

    this.eventRepository.merge(event, { ...updateEventDto, authors: undefined } as DeepPartial<Event>);

    return await this.eventRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }

  async findAuthorsByEventId(id: number): Promise<Author[]> {
    const event = await this.eventRepository.findOne({ where: { id }, relations: ['authors'] });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event.authors;
  }
}
