import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

const today = () => new Date().toISOString().slice(0, 10);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  progress: router({
    dashboard: protectedProcedure.query(({ ctx }) => db.getProgress(ctx.user.id)),
    ensureToday: protectedProcedure.mutation(({ ctx }) => db.ensureDailyMissions(ctx.user.id, today())),
  }),
  missions: router({
    complete: protectedProcedure.input(z.object({ missionId: z.number().int().positive() })).mutation(({ ctx, input }) => db.completeMission(ctx.user.id, input.missionId)),
  }),
  levelAi: router({
    ask: protectedProcedure.input(z.object({ message: z.string().min(1).max(1000) })).mutation(async ({ ctx, input }) => {
      const progress = await db.getProgress(ctx.user.id);
      const completion = await invokeLLM({
        model: "gemini-3.5-flash-lite",
        maxTokens: 500,
        messages: [
          { role: "system", content: "Você é LEVEL AI, copiloto pessoal de evolução. Responda em português do Brasil, de forma direta, motivadora e responsável, em até 180 palavras. Use os dados do usuário quando fornecidos. Não se apresente como médico, nutricionista ou treinador. Não incentive extremos." },
          { role: "user", content: `Dados atuais: XP ${progress.profile.xpTotal}; streak ${progress.streak}; missões de hoje ${progress.missions.filter(m => m.status === "approved").length}/${progress.missions.length}. Pergunta: ${input.message}` },
        ],
      });
      const content = completion.choices?.[0]?.message?.content;
      const text = typeof content === "string" ? content : "Não consegui responder agora. Tente novamente em alguns instantes.";
      return { text };
    }),
  }),
});

export type AppRouter = typeof appRouter;
