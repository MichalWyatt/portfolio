import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Moon,
  Sun,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Award,
  Code2,
  Heart,
  Shield,
  Sparkles,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import portraitAsset from "@/assets/michal-portrait.jpg.asset.json";
const portrait = portraitAsset.url;
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Michal Wyatt — Software & Mobile App Developer" },
      {
        name: "description",
        content:
          "Portfolio of Michal Wyatt — Software & Mobile App Developer in East Texas building secure, user-friendly solutions with faith and purpose.",
      },
      { property: "og:title", content: "Michal Wyatt — Software & Mobile App Developer" },
      {
        property: "og:description",
        content: "Projects, career roadmap, and story of a developer rooted in faith, family, and craft.",
      },
    ],
  }),
  component: Portfolio,
});

/* ----------------------------- DATA ----------------------------- */

const NAV = [
  { id: "about", label: "About" },
  { id: "roadmap", label: "Roadmap" },
  { id: "highlight", label: "What I Solve" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const TIMELINE = [
  {
    year: "2024 — Present",
    title: "BS Software Engineering",
    org: "Western Governors University",
    icon: GraduationCap,
    detail: "Pursuing a degree focused on secure software design, mobile development, and full-stack engineering.",
  },
  {
    year: "2023",
    title: "CompTIA Security+ Certified",
    org: "CompTIA",
    icon: Shield,
    detail: "Foundational cybersecurity certification — threat analysis, risk management, and secure architecture.",
  },
  {
    year: "2022 — Present",
    title: "IT & Media — Northside Christian Center",
    org: "Ministry IT",
    icon: Heart,
    detail: "Run media systems, livestream infrastructure, and internal tools that serve the church community weekly.",
  },
  {
    year: "2022",
    title: "Intern — Missionary TECH Team",
    org: "MTT",
    icon: Briefcase,
    detail: "Built and maintained tools for missionaries worldwide. First professional exposure to mission-driven software.",
  },
  {
    year: "2021 — 2022",
    title: "Student Government VP",
    org: "Kilgore College",
    icon: Award,
    detail: "Led student initiatives, learned servant leadership, and represented the student body in governance.",
  },
];

const SKILLS = [
  "C#", ".NET", "Flutter", "Dart", "Angular", "TypeScript",
  "C++", "Python", "SQL", "Git", "REST APIs", "Security+",
];

type Project = {
  name: string;
  description: string;
  longDescription: string;
  tech: string[];
  repo?: string;
  demo?: string;
  status: "shipped" | "planned";
};

const PROJECTS: Project[] = [
  {
    name: "MadMaxGaming-CS",
    description: "C# gaming utilities and engine experiments.",
    longDescription:
      "A growing collection of C# projects exploring game logic, OOP design, and engine fundamentals. Built as part of coursework and personal study.",
    tech: ["C#", ".NET", "OOP"],
    repo: "https://github.com/MichalWyatt/MadMaxGaming-CS",
    status: "shipped",
  },
  {
    name: "CS Multi-Project",
    description: "Algorithms, data structures, and console apps in C#.",
    longDescription:
      "Multi-module C# repository covering algorithms, data structures, and console applications — a portfolio of computer science fundamentals.",
    tech: ["C#", ".NET", "Algorithms"],
    repo: "https://github.com/MichalWyatt/CS-multi-project",
    status: "shipped",
  },
  {
    name: "C++ Console Payroll",
    description: "Payroll calculator with class-based design.",
    longDescription:
      "Object-oriented payroll application in C++ demonstrating encapsulation, file I/O, and clean console UX for small business workflows.",
    tech: ["C++", "OOP"],
    repo: "https://github.com/MichalWyatt/Cplusplus-Console-Payroll",
    status: "shipped",
  },
  {
    name: "BooksProgram",
    description: "Library management console app.",
    longDescription:
      "Console-based book inventory and lending tracker — practice in CRUD operations, persistence, and small-team workflows.",
    tech: ["C++", "File I/O"],
    repo: "https://github.com/MichalWyatt/BooksProgram",
    status: "shipped",
  },
  {
    name: "MD Airplane Seating",
    description: "Seat assignment simulator.",
    longDescription:
      "Airplane seating allocation program — explores 2D arrays, user input validation, and state management in a console environment.",
    tech: ["C++", "Arrays"],
    repo: "https://github.com/MichalWyatt/MDAirplaneSeating",
    status: "shipped",
  },
  {
    name: "GoodApp — Debt-Free Layaway",
    description: "Flutter app helping families buy what they need without debt.",
    longDescription:
      "A mobile-first layaway and savings tool built in Flutter. Helps families set goals, save in disciplined increments, and purchase essentials debt-free — rooted in stewardship and dignity.",
    tech: ["Flutter", "Dart", "Firebase"],
    status: "planned",
  },
  {
    name: "Angular World Map",
    description: "Interactive global ministry visualization.",
    longDescription:
      "Angular + D3 world map for visualizing ministry reach, missions data, and partner organizations. Designed for storytelling and stewardship reports.",
    tech: ["Angular", "TypeScript", "D3"],
    status: "planned",
  },
  {
    name: "Carmel by the Sea Ministry",
    description: "Modern church + grief support website.",
    longDescription:
      "Full ministry site with sermons, events, and a dedicated grief support hub — a digital front porch for the local body and community.",
    tech: ["TypeScript", "React", "CMS"],
    status: "planned",
  },
];

const ALL_TECH = Array.from(new Set(PROJECTS.flatMap((p) => p.tech))).sort();

/* ----------------------------- PAGE ----------------------------- */

function Portfolio() {
  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("mw-theme") : null;
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("mw-theme", next ? "dark" : "light");
  };

  const visibleProjects = useMemo(
    () => (filter ? PROJECTS.filter((p) => p.tech.includes(filter)) : PROJECTS),
    [filter],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#top" className="font-display text-lg font-semibold tracking-tight">
            Michal<span className="text-gradient">.</span>Wyatt
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {n.label}
              </a>
            ))}
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleDark}
              aria-label="Toggle theme"
              className="ml-2"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </nav>
          <div className="md:hidden flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={toggleDark} aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => setNavOpen((v) => !v)} aria-label="Menu">
              {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-6 py-4 flex flex-col gap-2">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setNavOpen(false)}
                  className="py-2 text-sm text-foreground"
                >
                  {n.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden"
      >
        <div
          className="absolute inset-0 -z-10 opacity-[0.18] dark:opacity-30"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/80 to-background" aria-hidden />

        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 text-xs text-muted-foreground mb-6">
              <MapPin className="h-3 w-3" /> East Texas · Available for opportunities
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight">
              Michal <span className="text-gradient">Wyatt</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Software &amp; Mobile App Developer — building secure, user-friendly solutions with
              <span className="text-foreground font-medium"> faith &amp; purpose</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <a href="#projects">
                  View Projects <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <a href="https://www.linkedin.com/in/michal-wyatt/" target="_blank" rel="noreferrer">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <a href="https://github.com/MichalWyatt" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="gap-2">
                <a href="#contact">
                  <Mail className="h-4 w-4" /> Contact
                </a>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto md:mx-0 w-full max-w-sm animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="absolute -inset-4 bg-gradient-hero rounded-3xl blur-2xl opacity-40 animate-float" aria-hidden />
            <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border bg-card">
              <img
                src={portrait}
                alt="Portrait of Michal Wyatt"
                width={1024}
                height={1536}
                className="w-full h-full object-cover aspect-[3/4]"
              />
              <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-background/70 border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--forest)] animate-pulse" />
                <span className="text-xs text-muted-foreground">Currently studying at WGU</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" eyebrow="Who I Am" title="Faith, code, and the long road.">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-5 text-base md:text-lg leading-relaxed text-muted-foreground">
            <p>
              I'm a software and mobile app developer in East Texas, pursuing a BS in Software
              Engineering at <span className="text-foreground font-medium">WGU</span>. My
              background spans <span className="text-foreground font-medium">ministry IT</span>,
              student leadership as former SGA Vice President, and a deep love for building tools
              that actually help people.
            </p>
            <p>
              I aspire to work in <span className="text-foreground font-medium">federal software development</span>
              — bringing transparency to government and dignity to{" "}
              <span className="text-foreground font-medium">Native and tribal communities</span>{" "}
              through technology that's secure, accessible, and honest.
            </p>
            <p>
              Off-screen, life looks like homesteading with my family, serving at our local
              church, and the slow, grateful work of building a life rooted in Christian values
              and grit.
            </p>
          </div>
          <Card className="p-6 bg-card border-border shadow-card-soft">
            <h3 className="font-display text-lg font-semibold mb-4">Skills &amp; Stack</h3>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <Badge key={s} variant="secondary" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4 text-[color:var(--forest)]" /> CompTIA Security+
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4 text-[color:var(--forest)]" /> BS Software Engineering · WGU
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="h-4 w-4 text-[color:var(--forest)]" /> LinkedIn Learning certifications
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* ROADMAP */}
      <Section id="roadmap" eyebrow="Career Roadmap" title="The path so far.">
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" aria-hidden />
          <div className="space-y-10">
            {TIMELINE.map((item, i) => {
              const Icon = item.icon;
              const left = i % 2 === 0;
              return (
                <div
                  key={item.title}
                  className={`relative grid md:grid-cols-2 gap-4 md:gap-12 items-start ${
                    left ? "" : "md:[&>*:first-child]:order-2"
                  }`}
                >
                  <div className={`pl-12 md:pl-0 ${left ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                    <Card className="p-5 bg-card border-border shadow-card-soft inline-block text-left">
                      <div className="text-xs font-medium text-[color:var(--forest)] mb-1">
                        {item.year}
                      </div>
                      <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                      <div className="text-sm text-muted-foreground mb-2">{item.org}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                    </Card>
                  </div>
                  <div className="hidden md:block" />
                  <div
                    className="absolute left-4 md:left-1/2 top-4 -translate-x-1/2 h-9 w-9 rounded-full bg-background border-2 border-[color:var(--forest)] flex items-center justify-center shadow-card-soft"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4 text-[color:var(--forest)]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="gap-2">
            <a href="https://www.linkedin.com/in/michal-wyatt/" target="_blank" rel="noreferrer">
              <Linkedin className="h-4 w-4" /> View full LinkedIn profile
            </a>
          </Button>
        </div>
      </Section>

      {/* HIGHLIGHT — Slide 16 */}
      <Section id="highlight" eyebrow="Featured · Slide 16 of 26" title="What problems I solve.">
        <Card className="relative overflow-hidden border-border shadow-elegant bg-gradient-hero text-primary-foreground">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} aria-hidden />
          <div className="relative p-8 md:p-14 grid md:grid-cols-[auto_1fr] gap-8 items-start">
            <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.2em] opacity-80">Who I Am · What I Build For</p>
              <h3 className="font-display text-3xl md:text-5xl font-semibold leading-tight">
                Real tools for real people — built with care, security, and conviction.
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                {[
                  { icon: Heart, title: "Ministry tech", body: "Software that helps churches and missionaries do their work with less friction." },
                  { icon: Shield, title: "Debt-free tools", body: "GoodApp — a layaway app that lets families buy what they need without sliding into debt." },
                  { icon: Code2, title: "Grief support", body: "Digital spaces for mourning families to find prayer, resources, and human presence." },
                  { icon: Sparkles, title: "Community uplift", body: "Secure, accessible apps that close the gap for underserved Native and tribal communities." },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="rounded-xl bg-white/10 backdrop-blur p-4 border border-white/15">
                    <Icon className="h-5 w-5 mb-2" />
                    <div className="font-semibold mb-1">{title}</div>
                    <div className="text-sm opacity-85 leading-relaxed">{body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" eyebrow="Projects" title="Things I've built — and what's next.">
        <div className="flex flex-wrap gap-2 mb-8">
          <FilterChip active={filter === null} onClick={() => setFilter(null)}>
            All
          </FilterChip>
          {ALL_TECH.map((t) => (
            <FilterChip key={t} active={filter === t} onClick={() => setFilter(t)}>
              {t}
            </FilterChip>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleProjects.map((p) => (
            <Card
              key={p.name}
              className="group p-6 bg-card border-border shadow-card-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              onClick={() => setActive(p)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                {p.status === "planned" ? (
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                    Planned
                  </Badge>
                ) : (
                  <Badge className="text-[10px] uppercase tracking-wider bg-[color:var(--forest)] text-[color:var(--forest-foreground)] hover:bg-[color:var(--forest)]">
                    Shipped
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {p.tech.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-sm">
                <span className="text-[color:var(--forest)] font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Details <ArrowRight className="h-3.5 w-3.5" />
                </span>
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`${p.name} on GitHub`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>

        {visibleProjects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No projects match that filter yet.
          </div>
        )}
      </Section>

      {/* CONTACT */}
      <Section id="contact" eyebrow="Get in touch" title="Let's build something worth building.">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-muted-foreground">
            <p className="text-base md:text-lg leading-relaxed">
              Whether it's a ministry project, federal opportunity, or a coffee in East Texas —
              I'd love to hear from you.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <a href="https://www.linkedin.com/in/michal-wyatt/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5 text-[color:var(--forest)]" /> linkedin.com/in/michal-wyatt
              </a>
              <a href="https://github.com/MichalWyatt" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-foreground transition-colors">
                <Github className="h-5 w-5 text-[color:var(--forest)]" /> github.com/MichalWyatt
              </a>
              <span className="inline-flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[color:var(--forest)]" /> East Texas, USA
              </span>
            </div>
          </div>

          <Card className="p-6 bg-card border-border shadow-card-soft">
            <ContactForm />
          </Card>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border mt-16">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Michal Wyatt. Built with faith &amp; purpose.
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/michal-wyatt/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-foreground">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://github.com/MichalWyatt" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-foreground">
              <Github className="h-4 w-4" />
            </a>
            <a href="#contact" aria-label="Email" className="hover:text-foreground">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* PROJECT DIALOG */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  {active.status === "planned" ? (
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">Planned</Badge>
                  ) : (
                    <Badge className="text-[10px] uppercase tracking-wider bg-[color:var(--forest)] text-[color:var(--forest-foreground)]">Shipped</Badge>
                  )}
                </div>
                <DialogTitle className="font-display text-2xl">{active.name}</DialogTitle>
                <DialogDescription className="leading-relaxed pt-2">
                  {active.longDescription}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {active.tech.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                {active.repo && (
                  <Button asChild variant="outline" className="gap-2">
                    <a href={active.repo} target="_blank" rel="noreferrer">
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  </Button>
                )}
                {active.demo && (
                  <Button asChild className="gap-2">
                    <a href={active.demo} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" /> Live demo
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ----------------------------- BITS ----------------------------- */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-20 md:py-28 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--forest)] mb-3">
            {eyebrow}
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      }`}
    >
      {children}
    </button>
  );
}

function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || name.length > 100) return toast.error("Please enter a valid name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 255)
      return toast.error("Please enter a valid email.");
    if (!message || message.length > 2000) return toast.error("Please enter a message.");

    setSubmitting(true);
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:hello@michalwyatt.dev?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Opening your email app…");
      form.reset();
    }, 400);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required maxLength={100} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required maxLength={255} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required maxLength={2000} rows={5} className="mt-1.5" />
      </div>
      <Button type="submit" disabled={submitting} className="w-full gap-2">
        Send message <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
