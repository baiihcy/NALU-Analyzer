'use client';

import React, { useState, useRef, useMemo, useEffect } from "react";
import { H264_TYPES, H265_TYPES } from "./utils/nalu";
import { ObjectTable } from "./components/ObjectTable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination"

export default function Home() {
  const [hexInput, setHexInput] = useState("");
  const [naluInfos, setNaluInfos] = useState<any[]>([]);
  const [isH265, setIsH265] = useState(false);
  const [useLongStartCode, setUseLongStartCode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Display 10 NALUs per page

  // Calculate actual byte length (ignore spaces)
  const inputLength = useMemo(() => {
    const cleanHex = hexInput.replace(/\s+/g, "");
    return Math.floor(cleanHex.length / 2);
  }, [hexInput]);

  // Get NALU type mapping for current encoding type
  const naluTypes = useMemo(() => {
    return isH265 ? H265_TYPES : H264_TYPES;
  }, [isH265]);

  // Filtered NALU list
  const filteredNalus = useMemo(() => {
    if (selectedType === "all") {
      return naluInfos;
    }
    return naluInfos.filter(
      (nalu) => nalu.nal_unit_type === parseInt(selectedType)
    );
  }, [naluInfos, selectedType]);

  // Calculate paginated NALU list
  const paginatedNalus = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNalus.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNalus, currentPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredNalus.length / itemsPerPage);
  }, [filteredNalus]);

  // Handle page number change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to page top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page number array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than or equal to max visible pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Otherwise show partial page numbers with ellipsis
      if (currentPage <= 3) {
        // Current page near the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Current page near the end
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Current page in the middle
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Initialize Web Worker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      workerRef.current = new Worker(new URL('./utils/workers/naluWorker.ts', import.meta.url));
      
      // Handle Worker return messages
      workerRef.current.onmessage = (e) => {
        const { type, nalu, progress, error } = e.data;
        
        switch (type) {
          case 'nalu':
            setNaluInfos(prev => [...prev, nalu]);
            break;
          case 'progress':
            setProgress(Math.max(Math.min(100, progress), 0));
            break;
          case 'complete':
            setProgress(100);
            setIsProcessing(false);
            break;
          case 'error':
            console.error('Parsing NALU error:', error);
            alert(`Parsing NALU error: ${error}`);
            setIsProcessing(false);
            break;
        }
      };
    }
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const processFileInChunks = async (file: File, currentIsH265: boolean) => {
    setIsProcessing(true);
    setProgress(0);
    setNaluInfos([]);
    
    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    
    let allHexString = '';
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      const buffer = await chunk.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const hexString = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
              
        
      allHexString += hexString;
      
      // Update progress
      setProgress(_ => Math.min(100, ((i + 1.) / totalChunks) * 100));
    }
    
    setHexInput(allHexString);

    // Send data to Worker for processing
    workerRef.current?.postMessage({
      hexString: allHexString,
      options: { isH265: currentIsH265, useLongStartCode },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHexInput(e.target.value);
  };

  const handleParse = () => {
    if (!hexInput.trim()) {
      alert("Please enter hexadecimal data");
      return;
    }
    
    // Clear previous data
    setNaluInfos([]);
    setCurrentPage(1);
    setProgress(0);
    setIsProcessing(true);
    
    // For manually entered data, directly use Worker processing
    workerRef.current?.postMessage({
      hexString: hexInput,
      options: { isH265, useLongStartCode },
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const newIsH265 = fileName.endsWith('.h265') || 
                        fileName.endsWith('.265') || 
                        fileName.endsWith('.hevc');
      
      setIsH265(newIsH265);
      processFileInChunks(file, newIsH265);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      const newIsH265 = fileName.endsWith('.h265') || 
                        fileName.endsWith('.265') || 
                        fileName.endsWith('.hevc');
      
      setIsH265(newIsH265);
      processFileInChunks(file, newIsH265);
    }
  };

  return (
    <main className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>NALU Analysis Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input">
            <TabsList>
              <TabsTrigger value="input">Manual Input</TabsTrigger>
              <TabsTrigger value="file">File Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="input" className="space-y-4">
              <Textarea
                placeholder="Please enter hexadecimal data..."
                value={hexInput}
                onChange={handleInputChange}
                className="font-mono"
                rows={10}
              />
              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                <p>File size: {inputLength.toLocaleString()} bytes</p>
              </div>
            </TabsContent>
            <TabsContent value="file" className="space-y-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center",
                  isDragging ? "border-primary" : "border-muted-foreground",
                  "transition-colors duration-200"
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  onClick={(e) => {
                    (e.target as HTMLInputElement).value = '';
                  }}
                />
                <div className="space-y-2">
                  <p>Drag and drop files here, or</p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Choose File"}
                  </Button>
                </div>
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-in-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Processing... {Math.round(progress)}%
                  </p>
                </div>
              )}

              {hexInput && !isProcessing && (
                <div className="space-y-2">
                  <p className="font-medium">File content preview:</p>
                  <pre className="p-4 bg-muted rounded-lg overflow-auto max-h-40 font-mono text-sm">
                    {hexInput.length > 128 ? hexInput.slice(0, 128) + '...' : hexInput}
                  </pre>
                  <div className="text-sm text-muted-foreground mt-1 space-y-1">
                    <p>File size: {inputLength.toLocaleString()} bytes</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isH265}
                onChange={(e) => setIsH265(e.target.checked)}
              />
              H.265/HEVC
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useLongStartCode}
                onChange={(e) => setUseLongStartCode(e.target.checked)}
              />
              Use 4-byte start code
            </label>
            <Button onClick={handleParse} disabled={isProcessing}>Parse</Button>
          </div>
        </CardContent>
      </Card>

      {naluInfos.length > 0 && (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select
                    value={selectedType}
                    onValueChange={(value) => {
                      setSelectedType(value);
                      setCurrentPage(1); // Reset page number
                    }}
                  >
                    <SelectTrigger className="w-[520px]">
                      <SelectValue placeholder="Select NALU Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.entries(naluTypes).map(([type, desc]) => (
                        <SelectItem key={type} value={type}>
                          {type} - {desc.split('\n')[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing: {filteredNalus.length} / {naluInfos.length} NALUs
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {paginatedNalus.map((nalu, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>NALU #{((currentPage - 1) * itemsPerPage) + index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ObjectTable data={nalu} isH265={isH265} />
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={cn(
                        "cursor-pointer",
                        currentPage === 1 && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(page as number)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={cn(
                        "cursor-pointer",
                        currentPage === totalPages && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </main>
  );
}
