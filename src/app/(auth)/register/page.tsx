"use client";

import Link from "next/link";
import { FaComments, FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "~/components/ui/checkbox";
import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
} from "~/app/schemas/auth";
import { api } from "~/trpc/react";

const formSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
  terms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions.",
  }),
});

const RegisterPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const { mutate: registerUser, isPending } = api.auth.register.useMutation({
    onSuccess: () => {
      alert("User created successfully");
    },
    onError: (error) => {
      alert(error.message);
      console.log(error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    registerUser(values);
  }

  return (
    <>
      <div className="flex items-center justify-center gap-3 text-primary">
        <FaComments className="size-10" />
        <h3 className="text-3xl font-semibold">Taku</h3>
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={"/login"} className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      </div>

      <Card className="mt-8 w-full max-w-lg px-4 py-10">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormLabel>I agree to the terms and conditions</FormLabel>
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                  Create account
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col pb-0">
          <div className="flex w-full items-center justify-between">
            <div className="h-[1px] w-1/2 bg-gray-200"></div>
            <p className="text-nowrap px-4 text-sm text-muted-foreground">
              Or continue with
            </p>
            <div className="h-[1px] w-1/2 bg-gray-200"></div>
          </div>

          <div className="mt-4 flex w-full items-center justify-center gap-4">
            <Button
              variant={"outline"}
              className="flex w-1/2 items-center justify-center bg-[#4285F4] text-white hover:bg-[#4285F4]/90 hover:text-white"
            >
              <FaGoogle className="mr-2" />
              Google
            </Button>

            <Button
              variant={"outline"}
              className="flex w-1/2 items-center justify-center bg-foreground text-white hover:bg-foreground/90 hover:text-white"
            >
              <FaGithub className="mr-2" />
              Github
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default RegisterPage;
