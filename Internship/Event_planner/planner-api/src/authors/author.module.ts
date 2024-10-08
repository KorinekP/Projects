import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { AuthorService } from './author.service';
import { AuthorsController } from './author.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Author,Event])],
  providers: [AuthorService],
  controllers: [AuthorsController],
})
export class AuthorModule {}
