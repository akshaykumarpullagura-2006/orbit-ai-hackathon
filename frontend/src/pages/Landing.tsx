import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Orbit,
  ArrowRight,
  Play,
  Brain,
  Route,
  Lightbulb,
  Zap,
  ShieldCheck,
  BarChart3,
  FileText,
  Bot,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/Badges';

const features = [
  { icon: Brain, title: 'AI Planner', desc: 'Classifies intent and selects the optimal workflow for every document.' },
  { icon: Route, title: 'Workflow Routing', desc: 'Dynamically routes tasks across specialized agents without manual setup.' },
  { icon: Lightbulb, title: 'Decision Intelligence', desc: 'Applies business rules and risk models to recommend confident decisions.' },
  { icon: Zap, title: 'Automation', desc: 'Executes approved actions across your connected systems instantly.' },
  { icon: ShieldCheck, title: 'Enterprise Security', desc: 'SOC 2 Type II, encryption at rest, and granular access controls.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track agent performance, throughput, and confidence over time.' },
];

const steps = [
  { icon: FileText, title: 'Upload', desc: 'Drop any business document — contracts, complaints, notes, reports.' },
  { icon: Bot, title: 'Agents Collaborate', desc: 'Five specialized agents analyze, reason, and decide together.' },
  { icon: CheckCircle2, title: 'Business-Ready Output', desc: 'Receive replies, summaries, and actions ready to act on.' },
];

const logos = ['Northwind', 'Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Stark'];

export default function Landing() {
  return (
    <div className="min-h-screen mesh-bg">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 shadow-glow">
              <Orbit className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">Orbit AI</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How it works</a>
            <a href="#agents" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Agents</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/app/dashboard">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="shadow-soft">
              <Link to="/app/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-60" />
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 flex justify-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary shadow-soft">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                The Autonomous AI Work Orchestrator
              </span>
            </motion.div>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]">
              The AI Employee That{' '}
              <span className="text-gradient">Gets Work Done</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Upload documents, complaints, contracts, meeting notes, or reports. Orbit AI
              automatically selects the right workflow, analyzes the content, and generates
              business-ready outputs.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild className="group h-12 px-6 shadow-premium">
                <Link to="/app/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-6 bg-white shadow-soft">
                <a href="#how">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Hero preview card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-16 max-w-5xl"
          >
            <div className="relative rounded-2xl border border-border bg-card p-2 shadow-premium">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-violet-500/5 to-chart-4/10 blur-2xl" />
              <div className="rounded-xl bg-gradient-to-b from-secondary/40 to-card p-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-destructive/50" />
                    <div className="h-3 w-3 rounded-full bg-warning/60" />
                    <div className="h-3 w-3 rounded-full bg-success/60" />
                  </div>
                  <div className="ml-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Orbit className="h-3.5 w-3.5 text-primary" />
                    orbit.ai/dashboard
                  </div>
                </div>
                <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Total Tasks', value: '1,284', pct: 70 },
                    { label: 'Completed', value: '1,097', pct: 85 },
                    { label: 'Pending', value: '187', pct: 45 },
                    { label: 'Avg Confidence', value: '94.2%', pct: 94 },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="rounded-xl border border-border bg-card p-4 shadow-soft"
                    >
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="mt-2 font-display text-2xl font-semibold">{s.value}</p>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-xl border border-border bg-card p-4 shadow-soft lg:col-span-2">
                    <p className="text-xs text-muted-foreground">Task Throughput</p>
                    <div className="mt-4 flex h-32 items-end gap-2">
                      {[40, 65, 52, 78, 88, 60, 45, 72, 95, 68, 82, 90].map((h, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.5 + i * 0.04, duration: 0.5 }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
                    <p className="text-xs text-muted-foreground">Active Agents</p>
                    <div className="mt-4 space-y-3">
                      {['Planner', 'Document', 'Decision', 'Report'].map((a, i) => (
                        <motion.div
                          key={a}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.08 }}
                          className="flex items-center gap-2"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                          </span>
                          <span className="text-xs font-medium">{a}</span>
                          <span className="ml-auto text-xs text-muted-foreground">{85 + i * 3}%</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-wider text-muted-foreground">
            Trusted by forward-thinking teams
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((l) => (
              <span key={l} className="font-display text-lg font-semibold text-muted-foreground/50">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="primary">Capabilities</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to orchestrate work
          </h2>
          <p className="mt-4 text-muted-foreground">
            Orbit AI brings together a team of specialized agents that collaborate to turn
            unstructured documents into structured, business-ready outcomes.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft shadow-card-hover"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary shadow-soft">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="info">How it works</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              From document to decision in three steps
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border bg-card p-8 shadow-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-glow">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="mt-5 block font-display text-sm font-medium text-primary">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-12 hidden h-6 w-6 text-border md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents preview */}
      <section id="agents" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="primary">Agent Network</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Five agents. One orchestrated outcome.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Each agent has a specialized role. They collaborate in real time — reading,
              reasoning, deciding, and acting — so your team receives a complete, actionable result.
            </p>
            <div className="mt-8 space-y-3">
              {[
                { name: 'Planner Agent', role: 'Classifies intent and routes work' },
                { name: 'Document Agent', role: 'Extracts entities from any file' },
                { name: 'Decision Agent', role: 'Applies rules and risk models' },
                { name: 'Automation Agent', role: 'Executes approved actions' },
                { name: 'Report Agent', role: 'Synthesizes business-ready output' },
              ].map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-soft"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.role}</p>
                  </div>
                  <CheckCircle2 className="ml-auto h-4 w-4 text-success" />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-radial-fade" />
            <div className="relative rounded-2xl border border-border bg-card p-8 shadow-premium">
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-64">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0"
                  >
                    {['Planner', 'Document', 'Decision', 'Automation', 'Report'].map((a, i) => {
                      const angle = (i / 5) * 2 * Math.PI;
                      const x = Math.cos(angle) * 110;
                      const y = Math.sin(angle) * 110;
                      return (
                        <div
                          key={a}
                          className="absolute flex h-16 w-16 flex-col items-center justify-center rounded-xl border border-border bg-card shadow-soft"
                          style={{ left: `calc(50% + ${x}px - 32px)`, top: `calc(50% + ${y}px - 32px)` }}
                        >
                          <Bot className="h-5 w-5 text-primary" />
                          <span className="mt-1 text-[9px] text-muted-foreground">{a}</span>
                        </div>
                      );
                    })}
                  </motion.div>
                  <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/15 to-violet-500/10 shadow-glow">
                    <Orbit className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-violet-500/5 p-10 text-center shadow-premium sm:p-16">
            <div className="absolute inset-0 mesh-bg-subtle" />
            <div className="relative">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 shadow-glow">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Put your work on autopilot
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Start orchestrating documents with AI agents today. No setup, no prompts — just
                business-ready results.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild className="h-12 px-6 shadow-premium">
                  <Link to="/app/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-6 bg-white shadow-soft">
                  <Link to="/app/upload">Try the Upload Workspace</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-500 shadow-soft">
                <Orbit className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-sm font-semibold">Orbit AI</span>
            </Link>
            <p className="text-xs text-muted-foreground">
              © 2026 Orbit AI. The Autonomous AI Work Orchestrator.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
