import CommandMenu from "@/components/command-menu";
import Footer from "@/components/footer";
import FunLayer from "@/components/fun/fun-layer";
import Nav from "@/components/nav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[200] rounded-full bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <CommandMenu />
      <FunLayer />
    </>
  );
}
