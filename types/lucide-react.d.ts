declare module "lucide-react" {
    import type { FC, SVGProps, RefAttributes } from "react";

    interface LucideProps extends SVGProps<SVGSVGElement> {
        size?: number | string;
        absoluteStrokeWidth?: boolean;
    }

    type LucideIcon = FC<LucideProps & RefAttributes<SVGSVGElement>>;

    export type { LucideIcon, LucideProps };

    export const AlertCircle: LucideIcon;
    export const AlertTriangle: LucideIcon;
    export const ArrowLeft: LucideIcon;
    export const ArrowLeftRight: LucideIcon;
    export const ArrowRight: LucideIcon;
    export const ArrowUpDown: LucideIcon;
    export const BarChart3: LucideIcon;
    export const Bell: LucideIcon;
    export const Building2: LucideIcon;
    export const Calendar: LucideIcon;
    export const CalendarX: LucideIcon;
    export const Check: LucideIcon;
    export const CheckCircle: LucideIcon;
    export const CheckCircle2: LucideIcon;
    export const ChevronDown: LucideIcon;
    export const ChevronLeft: LucideIcon;
    export const ChevronRight: LucideIcon;
    export const CircleDot: LucideIcon;
    export const CircleUser: LucideIcon;
    export const Clock: LucideIcon;
    export const Clock3: LucideIcon;
    export const Compass: LucideIcon;
    export const Copy: LucideIcon;
    export const CreditCard: LucideIcon;
    export const DollarSign: LucideIcon;
    export const Download: LucideIcon;
    export const Edit2: LucideIcon;
    export const Eye: LucideIcon;
    export const EyeOff: LucideIcon;
    export const FileCheck: LucideIcon;
    export const FilePlus: LucideIcon;
    export const FileText: LucideIcon;
    export const Filter: LucideIcon;
    export const Hash: LucideIcon;
    export const HelpCircle: LucideIcon;
    export const History: LucideIcon;
    export const Image: LucideIcon;
    export const ImagePlus: LucideIcon;
    export const Inbox: LucideIcon;
    export const Info: LucideIcon;
    export const LayoutDashboard: LucideIcon;
    export const Loader2: LucideIcon;
    export const Lock: LucideIcon;
    export const LogOut: LucideIcon;
    export const MapPin: LucideIcon;
    export const Menu: LucideIcon;
    export const Minus: LucideIcon;
    export const MoreHorizontal: LucideIcon;
    export const Pencil: LucideIcon;
    export const Plane: LucideIcon;
    export const PlaneTakeoff: LucideIcon;
    export const Play: LucideIcon;
    export const Plus: LucideIcon;
    export const RefreshCw: LucideIcon;
    export const Repeat: LucideIcon;
    export const Search: LucideIcon;
    export const SearchX: LucideIcon;
    export const Settings: LucideIcon;
    export const Share2: LucideIcon;
    export const Star: LucideIcon;
    export const Ticket: LucideIcon;
    export const Trash2: LucideIcon;
    export const TrendingUp: LucideIcon;
    export const TriangleAlert: LucideIcon;
    export const User: LucideIcon;
    export const UserPlus: LucideIcon;
    export const Users: LucideIcon;
    export const Wallet: LucideIcon;
    export const X: LucideIcon;
}
