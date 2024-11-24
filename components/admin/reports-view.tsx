"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getAnalytics } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sports } from "@/lib/uniform-types";

export function ReportsView() {
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [sportFilter, setSportFilter] = useState('all');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [reportType, sportFilter]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const analyticsData = await getAnalytics(reportType, sportFilter);
      setData(analyticsData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Analytics</CardTitle>
        <CardDescription>
          View uniform usage statistics and trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Period</Label>
              <Select 
                value={reportType} 
                onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setReportType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sport Filter</Label>
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {sports.map((sport) => (
                    <SelectItem key={sport.value} value={sport.value}>
                      {sport.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="h-[400px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sport" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="borrowed" fill="hsl(var(--primary))" name="Borrowed" />
              <Bar dataKey="returned" fill="hsl(var(--muted-foreground))" name="Returned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}