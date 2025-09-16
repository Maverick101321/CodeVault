import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

// Ensure your tsconfig.json has "experimentalDecorators": true and "emitDecoratorMetadata": true

export class FindAllSnippetsDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit: number = 20;

  @IsOptional()
  @IsString()
  sort: string = 'createdAt:desc';

  @IsOptional()
  @IsString()
  tag?: string;
}
