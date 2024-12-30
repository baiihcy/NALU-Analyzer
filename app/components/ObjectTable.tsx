"use client";

import React from "react";
import { TooltipRow } from "./TooltipRow";
import {
  Table,
  TableBody,
  TableCaption,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ObjectTableProps {
  data: Record<string, any>;
  title?: string;
  className?: string;
  isH265?: boolean;
}

export function ObjectTable({ data, title, className, isH265 }: ObjectTableProps) {
  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        {title && <TableCaption>{title}</TableCaption>}
        <TableBody>
          {Object.entries(data).map(([key, value]) => (
            <TooltipRow key={key} fieldName={key} value={value} isH265={isH265} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}