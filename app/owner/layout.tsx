import { OwnerLayoutClient } from "./_components/OwnerLayoutClient";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    return <OwnerLayoutClient>{children}</OwnerLayoutClient>;
}
