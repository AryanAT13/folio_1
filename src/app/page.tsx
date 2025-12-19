import Experience from "@/components/Experience";
import LinkWithIcon from "@/components/LinkWithIcon";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowDown, ArrowDownRight, ArrowRightIcon, FileDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnimatedText from "@/components/AnimatedText";
import WavingHand from "@/components/WavingHand";
import { cachedDataVersionTag } from "v8";

const birthDate = new Date(2004, 10, 13); // Months 0 - jan.... and so on
function getAccurateAge(date: Date) {
  const today = new Date();
  
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}
const LIMIT = 2;

export default function Home() {
  return (
    // We removed padding here because layout.tsx handles it now
    <article className="flex flex-col gap-16 pb-16">
      
      {/* --- Section 1: Intro --- */}
      <section className="flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between">
        <Image
          className="rounded-lg"
          src="/Aryan.jpg"
          alt="Photo of Aryan"
          width={175}
          height={175}
          priority
        />
        <div className="flex max-w-[320px] flex-col sm:max-w-full">
          <h1 className="title text-balance text-4xl sm:text-5xl">
            hi Aryan here. <WavingHand />
          </h1>

          <p className="mt-2 whitespace-nowrap text-sm font-medium sm:text-base">
            {getAccurateAge(birthDate)}
            {' '}yo software engineer from{' '}
            <a
              href="https://maps.app.goo.gl/sUitXcBh7XzDcFaq5"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Gurgaon
            </a>
            , India.
          </p>
          <div className="mt-4 max-w-sm text-balance">
            <p className="text-base font-semibold sm:text-lg">
              AI by Core. Dev in flow.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              I build reliable systems and software infrastructure, from backend APIs to developer workflows, always with a focus on performance & impact along with <strong>Opensource.</strong>
            </p>
          </div>

          <div className="mt-6 flex items-center gap-1">
            <p className="text-balance text-sm font-semibold sm:text-base">
              Ellie knows stuff. Probably. Ask her.
            </p>
            <ArrowDownRight className="hidden size-5 animate-bounce sm:block" />
            <ArrowDown className="block size-5 animate-bounce sm:hidden" />
          </div>

          <p className="mt-1 text-xs font-light">
            Sign my
            <Link
              href="/guestbook"
              className="link font-semibold"
              title="Guestbook"
            >
               guestbook 
            </Link>
            {/* ✅ FIXED: Replaced ' with &apos; */}
            while you&apos;re here.
          </p>

          <section className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/Resume.pdf" target="_blank">
              <Button variant="outline">
                <span className="font-semibold">Resume</span>
                <FileDown className="ml-2 size-5" />
              </Button>
            </Link>
            <Socials />
          </section>
        </div>
      </section>

      <Experience />

      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-2xl sm:text-3xl">featured projects.</h2>
          <LinkWithIcon
            href="/projects"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="view more"
          />
        </div>
        <Projects limit={LIMIT} />
      </section>

      {/* --- Section 3: About --- */}
      <section className="flex flex-col gap-4">
        <h2 className="title text-3xl">about.</h2>
        <Card className="p-6">
          <div className="flex flex-col gap-6">
            {/* First Block */}
            <div>
              <h3 className="text-xl font-semibold text-primary">
                I do.
              </h3>
              <AnimatedText
                className="mt-2 text-muted-foreground"
                text="I handle the flow of AI, wrangle data, and code until it clicks… somehow it all works. From scalable web apps to deployed ML pipelines, I build solutions that are impactful and efficient & yes, I do DSA so LeetCode stops judging me."
              />
              {/* --- Text Glow for Standout Quote --- */}
              <p className="text-glow-chase mt-4">
                 {/* ✅ FIXED: Replaced ' with &apos; in two places */}
                No loose ends, if anything&apos;s on me it&apos;s getting sorted. I get THINGS DONE.
              </p>
            </div>

            <div className="border-b border-border" />

            {/* Second Block */}
            <div>
              <h3 className="text-xl font-semibold text-primary">
                I like.
              </h3>
              <p className="mt-2 text-muted-foreground">
                I unwind by obsessing over{" "}
                <span className="rainbow-text font-bold">PlayStation®</span>{" "}
                <span className="glow-gold">exclusives</span>, watching way too many streams,
                and convincing myself that buying another pair of Jordans counts as “investing”. Speaking of <span className="glitchy-text" data-text="investments">investments</span> I stare at mine like they’re gonna apologize first.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </article>
  );
}