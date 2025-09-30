import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-8 py-4 text-center text-muted-foreground">
      <p>
        © 2025{" "}
        <a
          href="https://lassestilvang.com"
          target="_blank"
          className="hover:underline"
        >
          Lasse Stilvang
        </a>{" "}
        - built with ☕ in{" "}
        <a
          href="https://en.wikipedia.org/wiki/Copenhagen"
          target="_blank"
          className="hover:underline"
        >
          Copenhagen, Denmark
        </a>{" "}
        🇩🇰
      </p>
      <p className="mt-5 mb-5 inline-block">
        <a href="https://www.buymeacoffee.com/lassestilvang" target="_blank">
          <Image
            src="/buymeacoffee.png"
            alt="Buy Me A Coffee"
            width={217}
            height={60}
          />
        </a>
      </p>
    </footer>
  );
}
