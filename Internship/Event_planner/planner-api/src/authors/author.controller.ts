import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateAuthorDto, UpdateAuthorDto } from './author.dto';
import { AuthorService } from './author.service';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorService) {}

  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({ status: 200, description: 'List of all authors.' })
  @Get()
  async findAll() {
    return this.authorsService.findAll();
  }

  @ApiOperation({ summary: 'Get a single author by ID' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 200, description: 'Author details.' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.authorsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new author' })
  @ApiBody({ type: CreateAuthorDto })
  @ApiResponse({ status: 201, description: 'Author created successfully.' })
  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @ApiOperation({ summary: 'Update an author' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiBody({ type: UpdateAuthorDto })
  @ApiResponse({ status: 200, description: 'Author updated successfully.' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @ApiOperation({ summary: 'Delete an author' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 200, description: 'Author deleted successfully.' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.authorsService.remove(id);
  }

  @ApiOperation({ summary: 'Get events assigned to a specified author' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 200, description: 'List of events by author.' })
  @Get(':id/events')
  async findEventsByAuthorId(@Param('id') id: number) {
    return this.authorsService.findEventsByAuthorId(id);
  }
}
