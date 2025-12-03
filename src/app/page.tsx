import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BrainCircuit, LineChart } from 'lucide-react';

export default function Home() {

  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-primary" />,
      title: 'Evidence-Based Explanations',
      description: `Don\'t just know you\'re wrong. Understand why with detailed, expert-approved explanations for every question.`,
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: 'Personalized Learning',
      description: `Focus your efforts by quizzing yourself on questions you\'ve previously answered incorrectly.`,
    },
    {
      icon: <LineChart className="w-8 h-8 text-primary" />,
      title: 'Track Your Progress',
      description: `Watch your knowledge grow with detailed score tracking and results analysis after every quiz.`,
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-card py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Master Any Subject, Faster.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Welcome to Prof T, the ultimate learning tool. Tackle challenging questions and get instant, evidence-based feedback to accelerate your understanding.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/quiz/select">Start a Quiz</Link>
                </Button>
              </div>
            </div>
            <Image
              src="/touse.png"
              alt="Hero image for the quiz app"
              width={650}
              height={400}
              className="mx-auto aspect-[16/10] overflow-hidden rounded-xl object-cover sm:w-full"
              priority
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Why Choose Prof T?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Go beyond right or wrong. Our platform is built to help you truly learn and retain information.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
            {features.map((feature) => (
              <Card key={feature.title} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to Test Your Knowledge?</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Sign up or log in to start your personalized learning journey today. Your next "aha!" moment is just a quiz away.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
             <Button asChild size="lg" className="w-full">
                <Link href="/quiz/select">Get Started Now</Link>
              </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
