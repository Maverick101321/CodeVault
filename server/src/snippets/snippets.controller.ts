import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { FirebaseGuard } from '../auth/firebase.guard';
import { Req, UseGuards } from '@nestjs/common';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  @UseGuards(FirebaseGuard)
  create(@Body() createSnippetDto: CreateSnippetDto, @Req() req) {
    return this.snippetsService.create(createSnippetDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.snippetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snippetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSnippetDto: UpdateSnippetDto) {
    return this.snippetsService.update(id, updateSnippetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.snippetsService.remove(id);
  }
}
