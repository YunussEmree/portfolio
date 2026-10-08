import Link from "next/link";
import Footer from "@/components/footer";
import FunLayer from "@/components/fun/fun-layer";
import ArcadeButton from "@/components/fun/arcade-button";
import { FUN } from "@/data/fun";
import Nav from "@/components/nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main">
        <section className="container-page flex min-h-[70dvh] flex-col items-start justify-center pt-24">
          <p className="font-mono text-sm text-accent">404</p>
          <h1 className="display mt-4 text-[clamp(2.6rem,6vw,4.5rem)] text-fg">
            This route <span className="serif-accent text-muted">doesn&apos;t</span> resolve.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">The page you are looking for has moved or never existed.</p>
          <Link
            href="/"
            className="mt-10 inline-flex h-12 items-center rounded-full bg-accent-fill px-6 font-medium text-accent-ink"
          >
            Back to the home page
          </Link>
          <ArcadeButton label={FUN.arcade.play} className="mt-5 text-sm text-muted transition hover:text-fg" />
        </section>
      </main>
      <Footer />
      <FunLayer />
    </>
  );
}
