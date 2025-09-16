import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { FindAllSnippetsDto } from './dto/find-all-snippets.dto';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto) {
    return this.snippetsService.create(createSnippetDto);
  }

  @Get()
  findAll(@Query() findAllSnippetsDto: FindAllSnippetsDto) {
    return this.snippetsService.findAll(findAllSnippetsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snippetsService.findOne(id);
  }
}
