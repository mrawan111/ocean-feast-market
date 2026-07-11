import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/order/$id")({
  component: OrderSuccess,
});

function OrderSuccess() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-gold" />
        <h1 className="mt-6 text-3xl font-bold">{t("order_success")}</h1>
        <p className="mt-3 text-muted-foreground">{t("order_success_desc")}</p>
        <p className="mt-4 text-sm">{t("order_number")}: <span className="font-mono text-gold">{id.slice(0, 8)}</span></p>
        <Link to="/" className="mt-8 inline-block gold-gradient rounded-full px-6 py-3 text-sm font-bold text-gold-foreground">{t("nav_home")}</Link>
      </div>
      <Footer />
    </div>
  );
}