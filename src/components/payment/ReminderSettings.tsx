
import { useState } from "react";
import { useInvoice } from "@/contexts/InvoiceContext";
import { ReminderSettings as ReminderSettingsType } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Send } from "lucide-react";

interface ReminderSettingsProps {
  invoiceId: string;
  settings?: ReminderSettingsType;
}

export const ReminderSettings = ({ invoiceId, settings }: ReminderSettingsProps) => {
  const { updateReminderSettings, sendPaymentReminder } = useInvoice();
  const [enabled, setEnabled] = useState(settings?.enabled ?? true);
  const [beforeDueDays, setBeforeDueDays] = useState(
    settings?.beforeDueDays ?? [7, 3, 1]
  );
  const [afterDueDays, setAfterDueDays] = useState(
    settings?.afterDueDays ?? [1, 3, 7, 14]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  const handleBeforeDueDaysChange = (value: string) => {
    const daysArray = value
      .split(",")
      .map(day => parseInt(day.trim()))
      .filter(day => !isNaN(day) && day > 0)
      .sort((a, b) => b - a);
    setBeforeDueDays(daysArray);
  };

  const handleAfterDueDaysChange = (value: string) => {
    const daysArray = value
      .split(",")
      .map(day => parseInt(day.trim()))
      .filter(day => !isNaN(day) && day > 0)
      .sort((a, b) => a - b);
    setAfterDueDays(daysArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateReminderSettings(invoiceId, {
        enabled,
        beforeDueDays,
        afterDueDays,
        lastSentDate: settings?.lastSentDate
      });
    } catch (error) {
      console.error("Failed to update reminder settings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReminder = async () => {
    setIsSendingReminder(true);
    
    try {
      await sendPaymentReminder(invoiceId);
    } catch (error) {
      console.error("Failed to send reminder:", error);
    } finally {
      setIsSendingReminder(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment Reminders</h3>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="reminder-enabled" 
            checked={enabled} 
            onCheckedChange={setEnabled}
          />
          <Label htmlFor="reminder-enabled">
            {enabled ? "Enabled" : "Disabled"}
          </Label>
        </div>
      </div>
      
      {settings?.lastSentDate && (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Last reminder sent on {new Date(settings.lastSentDate).toLocaleString('en-IN')}
          </span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="before-due-days">
            Send reminders before due date (days)
          </Label>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              id="before-due-days"
              placeholder="7, 3, 1"
              value={beforeDueDays.join(", ")}
              onChange={(e) => handleBeforeDueDaysChange(e.target.value)}
              disabled={!enabled}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {beforeDueDays.map(day => (
              <Badge key={`before-${day}`} variant="outline">
                {day} {day === 1 ? "day" : "days"} before
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="after-due-days">
            Send reminders after due date (days)
          </Label>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              id="after-due-days"
              placeholder="1, 3, 7, 14"
              value={afterDueDays.join(", ")}
              onChange={(e) => handleAfterDueDaysChange(e.target.value)}
              disabled={!enabled}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {afterDueDays.map(day => (
              <Badge key={`after-${day}`} variant="outline">
                {day} {day === 1 ? "day" : "days"} after
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || !enabled}
            className="flex-1"
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            disabled={isSendingReminder || !enabled}
            onClick={handleSendReminder}
            className="flex-1"
          >
            <Send className="mr-2 h-4 w-4" />
            {isSendingReminder ? "Sending..." : "Send Reminder Now"}
          </Button>
        </div>
      </form>
    </div>
  );
};
