import Link from "next/link";
import LogoIcon from "../general/LogoIcon";

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Integrations", "Pricing", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Contact"],
  },
  {
    title: "Resources",
    links: ["Community", "Help Center", "Status", "Terms"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <LogoIcon />
            <p className="mt-4 text-sm text-muted-foreground">
              The collaborative workspace for high-performance teams. Designed
              in Delhi.
            </p>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Revo Inc. All rights reserved.
          </p>
          <div className="flex gap-6">{/* Social icons could go here */}</div>
        </div>
      </div>
    </footer>
  );
}
