import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';

@Injectable()
export class SnippetsService {
  constructor(private prisma: PrismaService) {}

  async create(createSnippetDto: CreateSnippetDto) {
    const { tags, context, ...snippetData } = createSnippetDto;

    return this.prisma.$transaction(async (prisma) => {
      const snippet = await prisma.snippet.create({
        data: {
          ...snippetData,
          context: {
            create: context,
          },
        },
      });

      if (tags && tags.length > 0) {
        const tagOperations = tags.map((name) =>
          prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
          }),
        );
        const createdTags = await Promise.all(tagOperations);

        await prisma.snippetTag.createMany({
          data: createdTags.map((tag) => ({
            snippetId: snippet.id,
            tagId: tag.id,
          })),
        });
      }

      return prisma.snippet.findUnique({
        where: { id: snippet.id },
        include: {
          context: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    });
  }

  findAll() {
    return this.prisma.snippet.findMany({
      include: { context: true, tags: { include: { tag: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.snippet.findUnique({
      where: { id },
      include: { context: true, tags: { include: { tag: true } } },
    });
  }

  async update(id: string, updateSnippetDto: UpdateSnippetDto) {
    const { tags, context, ...snippetData } = updateSnippetDto;

    return this.prisma.$transaction(async (prisma) => {
      await prisma.snippetTag.deleteMany({
        where: {
          snippetId: id,
        },
      });

      if (tags && tags.length > 0) {
        const tagOperations = tags.map((name) =>
          prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
          }),
        );
        const createdTags = await Promise.all(tagOperations);

        await prisma.snippetTag.createMany({
          data: createdTags.map((tag) => ({
            snippetId: id,
            tagId: tag.id,
          })),
        });
      }

      const snippet = await prisma.snippet.update({
        where: { id },
        data: {
          ...snippetData,
          context: {
            update: context,
          },
        },
      });

      return prisma.snippet.findUnique({
        where: { id: snippet.id },
        include: {
          context: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.snippetTag.deleteMany({
        where: {
          snippetId: id,
        },
      });

      await prisma.context.deleteMany({
        where: {
          snippetId: id,
        },
      });

      return prisma.snippet.delete({ where: { id } });
    });
  }
}
