import "@/lib/orpc.server"; // pre-rendering for ssr
import type { Metadata } from "next";
import { Grandstander } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";

const font = Grandstander();

export const metadata: Metadata = {
  title: {
    default: "Revo — Connect. Collaborate. Create.",
    template: "%s | Revo",
  },

  description:
    "Revo is a real-time collaboration platform for teams. Chat instantly, share files, and work together seamlessly — all in one place.",

  applicationName: "Revo",

  keywords: [
    "Revo",
    "real-time collaboration",
    "team chat",
    "Slack alternative",
    "workspace communication",
    "file sharing",
    "developer collaboration",
    "remote teams",
    "productivity tools",
  ],

  authors: [
    {
      name: "Dev Prasad Sethi",
      url: "https://github.com/Devsethi3",
    },
  ],

  creator: "Dev Prasad Sethi",
  publisher: "Revo",

  metadataBase: new URL("https://revo-liard.vercel.app"), 

  openGraph: {
    title: "Revo — Connect. Collaborate. Create.",
    description:
      "Bring your team together in real time. Chat, share files, and collaborate seamlessly with Revo.",
    url: "https://revo-liard.vercel.app",
    siteName: "Revo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Revo — Real-time collaboration for teams",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Revo — Connect. Collaborate. Create.",
    description:
      "A modern real-time collaboration app for teams. Chat, share files, and collaborate seamlessly.",
    images: ["/og-image.png"],
    creator: "@imsethidev",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${font.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>{children}</Providers>
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
