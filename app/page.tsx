import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(79,70,229,0.12),_transparent_28%),linear-gradient(to_bottom_right,_rgba(248,250,252,1),_rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(129,140,248,0.12),_transparent_28%),linear-gradient(to_bottom_right,_rgba(15,23,42,1),_rgba(17,24,39,1))]" />
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge className="w-fit rounded-full px-3 py-1 text-xs font-medium tracking-wide">Design system foundation</Badge>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                A clean, reusable UI kit for the IntervueX experience.
              </h1>
              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                shadcn/ui primitives, Tailwind theme tokens, and dark mode support are now wired into the app shell.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="h-12 px-5">Explore components</Button>
              <Button variant="outline" className="h-12 px-5">View docs</Button>
            </div>
          </div>

          <Card className="border-border/70 bg-card/80 shadow-lg backdrop-blur">
            <CardHeader>
              <CardTitle>System preview</CardTitle>
              <CardDescription>Core controls are ready for future dashboard and interview flows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email address</label>
                <Input id="email" type="email" placeholder="you@company.com" />
              </div>
              <Separator />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Primary</p>
                  <p className="mt-2 font-medium">#2563EB</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Surface</p>
                  <p className="mt-2 font-medium">#F8FAFC</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Radius</p>
                  <p className="mt-2 font-medium">12px</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
