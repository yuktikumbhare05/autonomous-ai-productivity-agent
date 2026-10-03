import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ReactNode;
  badge?: ReactNode;
  iconClassName?: string;
};

export default function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  badge,
  iconClassName = "bg-gradient-to-br from-purple-600 to-indigo-600 text-white",
}: PageHeaderProps) {
  return (
    <div className="border-b border-slate-200 bg-white px-8 py-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div
            className={`relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${iconClassName}`}
          >
            <Icon size={27} />

            {badge && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
