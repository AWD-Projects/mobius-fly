import type { Metadata } from "next";
import { privateMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = privateMetadata("Servicio no disponible");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
