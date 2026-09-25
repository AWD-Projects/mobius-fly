import { getLegalMetadata } from "@/lib/seo/metadata";

export const metadata = getLegalMetadata("terms");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
