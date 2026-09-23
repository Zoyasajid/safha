import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">404</p>
      <h1 className="mt-2 font-serif text-4xl">This page isn’t on the shelf</h1>
      <Link href="/" className="btn-primary mx-auto mt-8 w-fit">
        Back to Safha
      </Link>
    </Container>
  );
}
