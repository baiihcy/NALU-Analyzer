import { NALUParser } from '../nalu';
import { BaseNALUInfo } from '../nalu/types';

// Handle messages from the main thread
self.onmessage = (e: MessageEvent) => {
  const { hexString, options } = e.data;
  
  try {
    // Calculate total byte length
    const totalBytes = hexString.replace(/\s+/g, "").length / 2;
    let processedBytes = 0;
    
    // Parse NALU using callback approach
    NALUParser.parseHexString(
      hexString, 
      options,
      (nalu: BaseNALUInfo, position: number) => {
        // Update processed bytes count
        processedBytes = position + nalu.size;
        
        // Send progress message
        self.postMessage({
          type: 'progress',
          progress: Math.min(100, (processedBytes / totalBytes) * 100)
        });
        
        // Send each parsed NALU back to main thread
        self.postMessage({
          type: 'nalu',
          nalu,
          position
        });
      }
    );
    
    // Send completion message after parsing
    self.postMessage({
      type: 'complete'
    });
  } catch (error) {
    // Send error message back to main thread
    self.postMessage({
      type: 'error',
      error: (error as Error).message
    });
  }
};

export {}; 