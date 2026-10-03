import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Overview", end: true },
  { to: "/assessments", label: "Assessments" },
  { to: "/assets", label: "Asset Inventory" },
  { to: "/evidence", label: "Evidence" },
  { to: "/policies", label: "Policies" },
  { to: "/audit-packages", label: "Audit Packages" },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-paper text-ink">
      <aside className="w-64 shrink-0 bg-ink text-paper flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="font-serif text-xl leading-tight">AdhereOne</div>
          <div className="text-[11px] tracking-wide text-white/50 mt-0.5">
            Adhere Systems
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-sm text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10 text-xs text-white/60">
          <div className="mb-2">
            Signed in as <span className="text-white">{user?.username}</span>
          </div>
          <button
            onClick={logout}
            className="text-white/70 hover:text-white underline underline-offset-2"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 px-10 py-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
