import type { Metadata } from "next";
import { ContactForm } from "@/components/layout/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit Safha in Clifton, Karachi or write to the bookshop desk.",
};

export default function ContactPage() {
  return <ContactForm />;
}
