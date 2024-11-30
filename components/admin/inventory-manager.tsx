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
import { Loader2, Plus, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { getInventoryStats } from "@/lib/api";
import { toast } from "sonner";
import { uniformTypes } from "@/lib/uniform-types";
import { AddInventoryDialog } from "./add-inventory-dialog";
import { EditInventoryDialog } from "./edit-inventory-dialog";
import { DeleteInventoryDialog } from "./delete-inventory-dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/lib/supabase";
import { useTheme } from "next-themes";

type InventoryItem = {
  id: string;
  uniform_type: string;
  total_quantity: number;
  available_quantity: number;
};

function getUniformTypeName(type: string): string {
  return uniformTypes.find(u => u.id === type)?.name || type;
}

export function InventoryManager() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const loadInventory = async () => {
    try {
      const data = await getInventoryStats();
      console.log('Loaded inventory:', data);
      setInventory(data);
    } catch (error: any) {
      console.error('Error loading inventory:', error);
      toast.error(error.message || "Failed to load inventory");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    loadInventory();

    // Subscribe to ALL changes in the inventory table
    const inventoryChannel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        (payload) => {
          console.log('Inventory change detected:', payload);
          loadInventory();
        }
      )
      .subscribe((status) => {
        console.log('Inventory subscription status:', status);
      });

    // Subscribe to ALL changes in the transactions table
    const transactionChannel = supabase
      .channel('transaction-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          console.log('Transaction change detected:', payload);
          loadInventory();
        }
      )
      .subscribe((status) => {
        console.log('Transaction subscription status:', status);
      });

    // Cleanup subscriptions
    return () => {
      console.log('Cleaning up subscriptions...');
      inventoryChannel.unsubscribe();
      transactionChannel.unsubscribe();
    };
  }, []);

  const handleInventoryAdded = async () => {
    await loadInventory();
    setIsAddDialogOpen(false);
  };

  const handleInventoryEdited = async () => {
    await loadInventory();
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  const handleInventoryDeleted = async () => {
    await loadInventory();
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadInventory();
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const chartData = inventory.map(item => ({
    name: getUniformTypeName(item.uniform_type),
    total: item.total_quantity,
    onLoan: item.total_quantity - item.available_quantity,
    available: item.available_quantity
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
            Manage uniform inventory and stock levels
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Uniforms
          </Button>
        </div>
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
                dataKey="available" 
                fill="hsl(142.1 76.2% 36.3%)" 
                name="Available"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="onLoan" 
                fill={theme === 'dark' ? 'hsl(0 0% 100%)' : 'hsl(0 0% 0%)'} 
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
                <TableHead className="text-right">On Loan</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getUniformTypeName(item.uniform_type)}</TableCell>
                  <TableCell className="text-right">{item.total_quantity}</TableCell>
                  <TableCell className="text-right">{item.total_quantity - item.available_quantity}</TableCell>
                  <TableCell className="text-right">{item.available_quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(item)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {inventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No inventory items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AddInventoryDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onInventoryAdded={handleInventoryAdded}
      />

      {selectedItem && (
        <>
          <EditInventoryDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            inventory={selectedItem}
            onInventoryEdited={handleInventoryEdited}
          />
          <DeleteInventoryDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            inventory={selectedItem}
            onInventoryDeleted={handleInventoryDeleted}
          />
        </>
      )}
    </Card>
  );
}