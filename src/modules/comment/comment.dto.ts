import { Prisma } from "@prisma/client";

export type GetCommentsByProductIdDto = Prisma.CommentGetPayload<{
    select: {
        id: true,
        content: true,
        images: true,
        parentId: true,
        user: {
            select: {
                id: true,
                avatar: true,
                name: true
            }
        },
        createdAt: true,
        _count: {
            select: {
                children: true
            }
        }
    }
}>