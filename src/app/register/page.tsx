'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signUpUser } from '../auth/actions';
import { Logo } from '@/components/logo';
import { auth } from '@/lib/firebase';


const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  displayName: z.string().min(2, {
    message: 'Display name must be at least 2 characters.',
  }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Create user with Firebase Auth on the client
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(userCredential.user, { displayName: values.displayName });

      // 2. Call server action to add user to mock DB for isAdmin property
      const serverResult = await signUpUser({ 
        uid: userCredential.user.uid,
        email: values.email,
        displayName: values.displayName 
      });

      if (serverResult.success) {
        toast({
          title: 'Registration Successful',
          description: 'Welcome to QuizMaster! Please log in.',
        });
        router.push('/login');
      } else {
        // This part handles if the server-side action fails for some reason
         throw new Error(serverResult.error || 'Failed to save user data.');
      }
    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
       if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use.';
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Email/Password sign-up is not enabled for this project. Please use Google sign-up or contact an administrator to enable it in the Firebase console.";
      } else {
        console.error("Registration Error:", error);
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage,
      });
    }
  }

  async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const serverResult = await signUpUser({
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName!
      });

      if (serverResult.success) {
        toast({
          title: 'Registration Successful',
          description: `Welcome, ${user.displayName}!`,
        });
        router.push('/');
      } else {
         throw new Error(serverResult.error || 'Failed to save user data.');
      }
    } catch (error: any) {
       let errorMessage = error.message || "An unexpected error occurred.";
       if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Google Sign-In is not enabled for this project. Please contact an administrator to enable it in the Firebase console.";
      }
      toast({
        variant: 'destructive',
        title: 'Google Sign-Up Failed',
        description: errorMessage,
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="absolute top-8 left-8">
         <Logo />
       </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Sign up with Google or create an account with email.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                 <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 12.8 244 12.8c70.3 0 129.8 27.8 174.4 72.4l-64 64c-21.5-20.5-49-33-80.4-33-62.2 0-112.4 51.8-112.4 115.8 0 64 50.2 115.8 112.4 115.8 73.4 0 97.2-46.1 101-69.4H244v-85.8h236.1c2.4 12.9 3.9 26.4 3.9 40.8z"></path></svg>
                Sign Up with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
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
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <p className="text-xs text-muted-foreground">
                  Note: Email/Password sign-up might be disabled by the project administrator. If it fails, please use Google Sign-In.
                </p>
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account with Email'}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
