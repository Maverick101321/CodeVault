import { IsString, IsOptional } from 'class-validator';

export class CreateContextDto {
  @IsString()
  @IsOptional()
  pageTitle?: string;

  @IsString()
  @IsOptional()
  scrapedContent?: string;
}
