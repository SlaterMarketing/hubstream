import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";

export default async function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = (await import(`@/messages/${routing.defaultLocale}.json`)).default;

  return (
    <NextIntlClientProvider locale={routing.defaultLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
