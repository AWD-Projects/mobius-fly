import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = privateMetadata("Crear cuenta");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
