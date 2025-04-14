"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { FormType } from "@/types";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signUpTheUser = async (values: z.infer<typeof formSchema>) => {
    const { name, email, password } = values;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const result = await signUp({
      uid: userCredential.user.uid,
      name: name!,
      email: email,
      password,
    });

    return result;
  };

  const signInTheUser = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const idToken = await userCredential.user.getIdToken();
    if (!idToken) {
      toast.error("Sign in failed! Please try again.");
      return {
        success: false,
      };
    }

    await signIn({ email, idToken });
    return {
      success: true,
    };
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (type === "sign-up") {
        const result = await signUpTheUser(values);
        if (!result?.success) {
          toast.error(result?.message);
          return;
        }
        toast.success("Account created successfully! Please sign in.");
        router.push("/sign-in");
      } else {
        const { success } = await signInTheUser(values);
        if (success) {
          toast.success("Sign in successfully!");
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error(`There was an error: ${err}`);
    }
    console.log(values);
    setLoading(false);
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image
            src="/logo.svg"
            alt="logo"
            height={32}
            width={38}
            style={{ width: "auto", height: "auto" }}
          />
          <h2 className="text-primary-100">Interview Guru</h2>
        </div>
        <h3 className="text-center">Practice job interview with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            <Button className="btn" type="submit" disabled={loading}>
              {loading === false ? (
                isSignIn ? (
                  "Sign In"
                ) : (
                  "Create an account"
                )
              ) : (
                <BeatLoader />
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Already have an account?"}
          <Link
            href={!isSignIn ? "/sign-in" : "sign-up"}
            className="font-bold text-user-primary ml-1 underline"
          >
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
