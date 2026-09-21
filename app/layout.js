import "./globals.css";

export const metadata = {
  title: "MessMate",
  description: "Hostel mess menus, feedback and complaints in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
