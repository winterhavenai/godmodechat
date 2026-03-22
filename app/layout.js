import "./globals.css";

export const metadata = {
  title: "GodModeChat — Talk to Jesus and Hear from Him Through His Word",
  description:
    "Bring any thought, worry, or decision to Jesus and receive a response grounded entirely in Scripture. GodModeChat helps you build a daily, personal relationship with God.",
  openGraph: {
    title: "GodModeChat — IAM > AI",
    description: "You can ask God anything and hear from Him right now.",
    url: "https://godmodechat.com",
    siteName: "GodModeChat",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GodModeChat — IAM > AI",
    description: "You can ask God anything and hear from Him right now.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
