"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const BillingTab = () => {
  const invoices = [
    { date: "Dec 1, 2024", amount: "$12.00", status: "Paid" },
    { date: "Nov 1, 2024", amount: "$12.00", status: "Paid" },
    { date: "Oct 1, 2024", amount: "$12.00", status: "Paid" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
        <CardDescription>
          Manage your subscription and payment methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 gradient-primary rounded-xl text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Current Plan</p>
              <h3 className="text-2xl font-bold">Pro Plan</h3>
              <p className="text-sm opacity-90 mt-1">
                $12/month • Billed monthly
              </p>
            </div>
            <Button variant="secondary">Upgrade</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Billing History</h3>
          <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
            {invoices.map((invoice, idx) => (
              <div key={idx} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.amount}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
