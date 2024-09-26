"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";


interface TransactionData {
  status: string;
  value: number;
  color: string;
}

interface TransactionMetadataCardProps {
  data?: TransactionData[];
}

export default function MetaData({ data }: TransactionMetadataCardProps) {
  const defaultData: TransactionData[] = [
    { status: "Due", value: 30, color: "#FFD700" },
    { status: "Overdue", value: 15, color: "#FF0000" },
    { status: "Completed", value: 5, color: "#008000" },
    { status: "Pending", value: 10, color: "#CCCCCC" },
  ];

  const chartData = data || defaultData;
  const totalTransactions = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  // console.log("Chart Data:", chartData); 

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80} 
                paddingAngle={5}
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-4 h-4 mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium">
                {item.status}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


