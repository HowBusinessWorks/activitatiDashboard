import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kanban Issues Dashboard",
  description: "Construction company issues tracking dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        {children}
      </body>
    </html>
  )
}
