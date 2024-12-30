"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { H264_FIELD_DESCRIPTIONS } from "../utils/nalu/h264Descriptions";
import { H265_FIELD_DESCRIPTIONS } from "../utils/nalu/h265Descriptions";
import { HexViewer } from "./HexViewer";

interface TooltipRowProps {
  fieldName: string;
  value: any;
  className?: string;
  isH265?: boolean;
}

export function TooltipRow({ fieldName, value, className, isH265 }: TooltipRowProps) {
  // Skip rendering if fieldName starts with underscore
  if (fieldName.startsWith('_')) {
    return null;
  }

  const description = ((isH265 ? H265_FIELD_DESCRIPTIONS : H264_FIELD_DESCRIPTIONS) as any)[fieldName];

  const renderValue = (val: any) => {
    if (val === undefined || val === null) {
      return "-";
    }
    if (typeof val === "boolean") {
      return val ? "ON" : "OFF";
    }
    if (Array.isArray(val)) {
      // Check if any element is an object
      const hasObjectElement = val.some(item => typeof item === 'object' && item !== null);
      
      if (!hasObjectElement) {
        // If no objects, return JSON string
        return JSON.stringify(val);
      }

      // Otherwise render table as before
      return (
        <table className="w-full">
          <tbody>
            {val.map((item, index) => (
              <TooltipRow
                key={index}
                fieldName={`[${index}]`}
                value={item}
                isH265={isH265}
                className="bg-gray-50"
              />
            ))}
          </tbody>
        </table>
      );
    }
    if (typeof val === "object") {
      return (
        <table className="w-full">
          <tbody>
            {Object.entries(val).map(([key, subValue]) => (
              <TooltipRow 
                key={key}
                fieldName={key}
                value={subValue}
                isH265={isH265}
                className="bg-gray-50"
              />
            ))}
          </tbody>
        </table>
      );
    }
    
    if (fieldName === "rawHex" || fieldName === "raw") {
      return <HexViewer hex={String(val)} />;
    }
    return String(val);
  };

  if (!description) {
    return (
      <tr className={className}>
        <td className="border px-4 py-2 font-medium">{fieldName}</td>
        <td className="border px-4 py-2">{renderValue(value)}</td>
      </tr>
    );
  }

  return (
    <tr className={className}>
      <td className="border px-4 py-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help font-medium">
                {fieldName}
                {description.link && (
                  <a 
                    href={description.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-blue-500 hover:text-blue-700"
                  >
                    [RFC]
                  </a>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-md space-y-2">
                <p className="font-medium">{description.description}</p>
                <p className="text-sm text-muted-foreground">{description.rfcQuote}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
      <td className="border px-4 py-2">
        {fieldName === "rawHex" ? (
          renderValue(value)
        ) : (
          <span>{renderValue(value)}</span>
        )}
      </td>
    </tr>
  );
}