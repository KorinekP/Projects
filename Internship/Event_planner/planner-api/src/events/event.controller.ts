import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateEventDto, UpdateEventDto } from './event.dto';
import { EventService } from './event.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventService) {}

  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'List of all events.' })
  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @ApiOperation({ summary: 'Get a single event by ID' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Event details.' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event created successfully.' })
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @ApiOperation({ summary: 'Update an event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Event updated successfully.' })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiOperation({ summary: 'Delete an event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully.' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.eventsService.remove(id);
  }

  @ApiOperation({ summary: 'Get authors assigned to a specified event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'List of authors for the event.' })
  @Get(':id/authors')
  async findAuthorsByEventId(@Param('id') id: number) {
    return this.eventsService.findAuthorsByEventId(id);
  }
}
