
import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const { t } = useTranslation();
  
  const getStatusColor = () => {
    switch (status) {
      case "draft":
        return "bg-gray-200 text-gray-700 hover:bg-gray-200";
      case "sent":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "paid":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "overdue":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "draft":
        return t("invoice.draft");
      case "sent":
        return t("invoice.sent");
      case "paid":
        return t("invoice.paid");
      case "overdue":
        return t("invoice.overdue");
      default:
        return status;
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border-0 capitalize",
        getStatusColor(),
        className
      )}
    >
      {getStatusText()}
    </Badge>
  );
}
