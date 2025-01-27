import { z } from "zod";
import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
} from "~/app/schemas/auth";
import { supabaseAdminClient } from "~/lib/supabase/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateFromEmail } from "unique-username-generator";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        fullName: fullNameSchema,
        email: emailSchema,
        password: passwordSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { fullName, email, password } = input;

      await db.$transaction(async (tx) => {
        let userId = "";

        try {
          const { data, error } =
            await supabaseAdminClient.auth.admin.createUser({
              email,
              password,
            });

          if (data.user) userId = data.user.id;

          if (error) throw error;

          const generatedUsername = generateFromEmail(email);

          await tx.profile.create({
            data: {
              fullName,
              email,
              userId: data.user.id,
              username: generatedUsername,
            },
          });
        } catch (error) {
          console.log(error);
          await supabaseAdminClient.auth.admin.deleteUser(userId);
        }
      });
    }),
});
