import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto, UpdateAuthorDto } from './author.dto';
import { Event } from '../events/event.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<Author[]> {
    return await this.authorRepository.find({ relations: ['events'] });
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne({ where: { id }, relations: ['events'] });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const newAuthor = this.authorRepository.create(createAuthorDto);
    return await this.authorRepository.save(newAuthor);
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);
    this.authorRepository.merge(author, updateAuthorDto);
    return await this.authorRepository.save(author);
  }

  async remove(id: number): Promise<void> {
    const author = await this.findOne(id);
    await this.authorRepository.remove(author);
  }

  async findEventsByAuthorId(id: number): Promise<Event[]> {
    const author = await this.authorRepository.findOne({ where: { id }, relations: ['events'] });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author.events;
  }
}
