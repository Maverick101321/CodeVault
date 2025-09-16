import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContextDto } from './create-context.dto';

export class CreateSnippetDto {
  @IsString()
  title: string;

  @IsString()
  code: string;

  @IsString()
  language: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @ValidateNested()
  @Type(() => CreateContextDto)
  @IsOptional()
  context?: CreateContextDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
