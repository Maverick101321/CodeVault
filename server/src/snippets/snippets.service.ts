import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { FindAllSnippetsDto } from './dto/find-all-snippets.dto';

@Injectable()
export class SnippetsService {
  constructor(private prisma: PrismaService) {}

  async create(createSnippetDto: CreateSnippetDto) {
    const { tags, context, ...snippetData } = createSnippetDto;

    // This is a placeholder for the actual user ID.
    // In a real application, you would get this from the authenticated user.
    const userId = 'clerk_user_id_placeholder';
    const userEmail = 'user@example.com';

    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: userEmail,
        },
      });

      const snippet = await prisma.snippet.create({
        data: {
          ...snippetData,
          user: {
            connect: {
              id: user.id,
            },
          },
          context: context
            ? {
                create: context,
              }
            : undefined,
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

  async findAll(query: FindAllSnippetsDto) {
    const { page = 1, limit = 20, sort = 'createdAt:desc', tag } = query;
    const [sortField, sortOrder] = sort.split(':');
    const skip = (page - 1) * limit;

    const where = {
      ...(tag && {
        tags: {
          some: {
            tag: {
              name: tag,
            },
          },
        },
      }),
    };

    const [snippets, total] = await this.prisma.$transaction([
      this.prisma.snippet.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortField]: sortOrder,
        },
        include: {
          context: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      this.prisma.snippet.count({ where }),
    ]);

    return {
      data: snippets,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    return this.prisma.snippet.findUnique({
      where: { id },
      include: {
        context: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }
}
