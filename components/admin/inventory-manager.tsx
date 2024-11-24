"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { getInventoryStats } from "@/lib/api";
import { toast } from "sonner";
import { AddInventoryDialog } from "./add-inventory-dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type InventoryItem = {
  id: string;
  uniform_type: string;
  total_quantity: number;
  available_quantity: number;
};

export function InventoryManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await getInventoryStats();
      setInventory(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load inventory");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInventoryAdded = () => {
    loadInventory();
    setIsDialogOpen(false);
  };

  const chartData = inventory.map(item => ({
    name: item.uniform_type,
    total: item.total_quantity,
    onLoan: item.total_quantity - item.available_quantity,
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>
            Manage your uniform inventory and stock levels
          </CardDescription>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Uniforms
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inventory Chart */}
        <div className="h-[300px] w-full border rounded-lg p-4 bg-background">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs" 
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar 
                dataKey="total" 
                fill="hsl(var(--primary))" 
                name="Total"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="onLoan" 
                fill="hsl(var(--accent))" 
                name="On Loan"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Uniform Type</TableHead>
                <TableHead className="text-right">Total Quantity</TableHead>
                <TableHead className="text-right">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.uniform_type}</TableCell>
                  <TableCell className="text-right">{item.total_quantity}</TableCell>
                  <TableCell className="text-right">{item.available_quantity}</TableCell>
                </TableRow>
              ))}
              {inventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    No inventory items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AddInventoryDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onInventoryAdded={handleInventoryAdded}
      />
    </Card>
  );
}