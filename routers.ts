import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  tasks: router({
    list: publicProcedure.query(async () => {
      const { getTasks } = await import("./db");
      return getTasks({ status: "open", limit: 50 });
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getTaskById } = await import("./db");
        return getTaskById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        category: z.enum(["study", "fitness", "travel", "food", "life", "skill", "other"]),
        bountyAmount: z.number().min(0),
        location: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        isOnline: z.boolean().default(false),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        tags: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createTask } = await import("./db");
        return createTask({
          publisherId: ctx.user.id,
          title: input.title,
          description: input.description,
          category: input.category,
          bountyAmount: input.bountyAmount,
          location: input.location,
          latitude: input.latitude,
          longitude: input.longitude,
          isOnline: input.isOnline ? 1 : 0,
          startTime: input.startTime,
          endTime: input.endTime,
          tags: input.tags,
        });
      }),
  }),

  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const { getUserProfile } = await import("./db");
      return getUserProfile(ctx.user.id);
    }),
    
    update: protectedProcedure
      .input(z.object({
        bio: z.string().optional(),
        location: z.string().optional(),
        skills: z.string().optional(),
        interests: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { updateUserProfile, getUserProfile } = await import("./db");
        const existing = await getUserProfile(ctx.user.id);
        
        if (!existing) {
          const { createUserProfile } = await import("./db");
          await createUserProfile({
            userId: ctx.user.id,
            ...input,
          });
        } else {
          await updateUserProfile(ctx.user.id, input);
        }
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
