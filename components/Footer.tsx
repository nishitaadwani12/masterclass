import Link from "next/link";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-ink-soft">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <div className="font-display text-lg text-gradient">SwitchPath</div>
          <p className="mt-2 max-w-xs text-sm text-text-muted">
            Career clarity and role-switching mentorship for MBA and engineering
            students.
          </p>
        </div>

        <FooterColumn
          title="Learn"
          links={[
            { href: "/courses", label: "All courses" },
            { href: "/live-classes", label: "Live classes" },
            { href: "/signup", label: "Create account" },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { href: "/#how-it-works", label: "How it works" },
            { href: "/#mentors", label: "Mentors" },
          ]}
        />
        <FooterColumn
          title="Account"
          links={[
            { href: "/login", label: "Log in" },
            { href: "/dashboard", label: "Dashboard" },
          ]}
        />
      </div>
      <div className="border-t border-line/60 px-5 py-5 text-center text-xs text-text-muted">
        © {year} SwitchPath. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-text">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
