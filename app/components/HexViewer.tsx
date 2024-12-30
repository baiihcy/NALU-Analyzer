"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface HexViewerProps {
  hex: string;
  className?: string;
  maxPreviewLength?: number;
  bytesPerLine?: number;
}

export function HexViewer({
  hex,
  className,
  maxPreviewLength = 16,
  bytesPerLine = 16,
}: HexViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format hex string with bytesPerLine bytes per line
  const formatHex = (hexString: string): string => {
    // Remove all spaces
    const cleanHex = hexString.replace(/\s+/g, "");
    // Add space between every two characters (one byte)
    const hexWithSpaces = cleanHex.match(/.{2}/g)?.join(" ") || "";
    // Add newline after every bytesPerLine bytes
    const hexLines = hexWithSpaces.match(new RegExp(`.{1,${bytesPerLine * 3}}`, "g")) || [];
    return hexLines.join("\n");
  };

  // Get preview text
  const getPreviewText = (): string => {
    const cleanHex = hex.replace(/\s+/g, "");
    if (cleanHex.length <= maxPreviewLength * 2) {
      return formatHex(cleanHex);
    }
    return formatHex(cleanHex.slice(0, maxPreviewLength * 2)) + "...";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <pre
          className={cn(
            "p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto overflow-y-auto whitespace-pre",
            isExpanded ? "max-h-[500px]" : "max-h-[52px]",
            "transition-all duration-200"
          )}
        >
          {isExpanded ? formatHex(hex) : getPreviewText()}
        </pre>
        {hex.replace(/\s+/g, "").length > maxPreviewLength * 2 && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-8 h-8 px-2" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="mr-2 text-sm">
              {isExpanded ? "Collapse" : "Expand"}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {isExpanded && (
        <p className="text-sm text-muted-foreground">
          Total bytes: {Math.floor(hex.replace(/\s+/g, "").length / 2).toLocaleString()}
        </p>
      )}
    </div>
  );
}