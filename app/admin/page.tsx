"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/admin-header";
import { InventoryManager } from "@/components/admin/inventory-manager";
import { TransactionList } from "@/components/admin/transaction-list";
import { ReportsView } from "@/components/admin/reports-view";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <InventoryManager />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <TransactionList />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <ReportsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}