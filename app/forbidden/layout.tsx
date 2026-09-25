import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = privateMetadata("Acceso denegado");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
