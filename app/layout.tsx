import type { Metadata, Viewport } from "next"
import { Anton, Barlow_Condensed, Manrope } from "next/font/google"
import "./globals.css"
import PWAInit       from "@/components/PWAInit"
import InstallPrompt from "@/components/InstallPrompt"

/* next/font — noms de variables uniques pour éviter toute collision */
const antonFont = Anton({
  subsets: ["latin"],
  variable: "--font-anton",   /* → utilisé dans globals.css via var(--font-anton) */
  weight: "400",
  display: "swap",
})

const manropeFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const barlowFont = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["500", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "DT Muay Siam · Coach",
  description: "DT Muay Siam — Application coach Muay Thaï, enfants 6-10 ans",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DT Muay Siam",
  },
  formatDetection: { telephone: false },
  icons: { apple: "/apple-icon" },
}

export const viewport: Viewport = {
  themeColor:   "#0A0A0A",
  width:        "device-width",
  initialScale: 1,
  viewportFit:  "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Les classes next/font injectent --font-anton, --font-manrope, --font-barlow
       sur l'élément html. globals.css les réassigne sous --font-display / --font-ui / --font-num */
    <html
      lang="fr"
      className={[
        antonFont.variable,
        manropeFont.variable,
        barlowFont.variable,
      ].join(" ")}
    >
      <body>
        <PWAInit />
        <div className="app-shell">{children}</div>
        <InstallPrompt />
      </body>
    </html>
  )
}
