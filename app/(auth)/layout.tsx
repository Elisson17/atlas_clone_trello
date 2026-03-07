import Script from "next/script";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      {children}
    </>
  );
}
