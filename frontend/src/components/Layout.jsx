import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/book", label: "Book" },
  { to: "/coaches", label: "Coaches" },
  { to: "/memberships", label: "Membership" },
  { to: "/shop", label: "Shop" },
  { to: "/workouts", label: "Workouts" },
  { to: "/rewards", label: "Rewards" },
  { to: "/profile", label: "Profile" },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-den-black text-den-cream flex flex-col">
      <header className="border-b border-white/10 sticky top-0 bg-den-black/95 backdrop-blur z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="font-display tracking-widest text-lg">
            <span className="text-den-orange">LYON'S</span> DEN
          </div>
          <nav className="hidden md:flex gap-6 text-sm uppercase tracking-wide">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `pb-1 border-b-2 transition-colors ${
                    isActive
                      ? "border-den-orange text-white"
                      : "border-transparent text-den-muted hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-8">{children}</main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-den-charcoal border-t border-white/10 flex justify-between px-2 py-2 z-20">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 text-center text-[10px] uppercase tracking-wide py-1 ${
                isActive ? "text-den-orange" : "text-den-muted"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="md:hidden h-14" />

      <footer className="hidden md:block border-t border-white/10 text-center text-den-muted text-xs py-6">
        Lyon's Den · Movement Collective — Where the Forever Athlete Lives
      </footer>
    </div>
  );
}
