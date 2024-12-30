import { BaseNALUInfo, H264NALUInfo, H265NALUInfo, H264NALUHeader, H265NALUHeader, ParserOptions, H264_TYPES, H265_TYPES } from './types';
import { parseH264NALU } from './h264Parser';
import { parseH265NALU } from './h265Parser';

export class NALUParser {
  static parseHexString(
    hexString: string, 
    options: ParserOptions = { useLongStartCode: true, isH265: false }, 
    onNALU?: (nalu: BaseNALUInfo, position: number) => void
  ): BaseNALUInfo[] {
    const cleanHex = hexString.replace(/\s+/g, "");
    if (cleanHex.length % 2 !== 0) {
      throw new Error("Invalid hex string length");
    }

    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }

    return this.parseBytes(bytes, options, onNALU);
  }

  static parseBytes(
    bytes: Uint8Array, 
    options: ParserOptions = { useLongStartCode: true, isH265: false }, 
    onNALU?: (nalu: BaseNALUInfo, position: number) => void
  ): BaseNALUInfo[] {
    const { isH265 = false, useLongStartCode = true } = options;
    const nalus: BaseNALUInfo[] = [];
    let position = 0;

    while (position < bytes.length) {
      // Find start code
      const startCodeInfo = this.findStartCode(bytes, position, useLongStartCode);
      if (!startCodeInfo) break;

      const { startCodeLength, startCodePosition } = startCodeInfo;

      // Find next start code
      const nextStartCode = this.findStartCode(bytes, startCodePosition + startCodeLength, useLongStartCode);
      const naluLength = nextStartCode
        ? nextStartCode.startCodePosition - (startCodePosition + startCodeLength)
        : bytes.length - (startCodePosition + startCodeLength);

      // Parse NALU
      const naluBytes = bytes.slice(startCodePosition, startCodePosition + startCodeLength + naluLength);
      const nalu = this.parseNALU(naluBytes, startCodeLength, startCodePosition, isH265);
      
      // Call callback if provided
      if (onNALU) {
        onNALU(nalu, startCodePosition);
      }
      
      nalus.push(nalu);
      position = startCodePosition + startCodeLength + naluLength;
    }

    return nalus;
  }

  static parseHeader(bytes: Uint8Array, isH265: boolean): {
    forbidden_bit: number;
    nal_unit_type: number;
    nal_ref_idc: number;
    layer_id: number;
    temporal_id: number;
    header_size: number;
  } {
    if (isH265) {
      // H.265 uses 2-byte NALU header
      const naluHeader1 = bytes[0];
      const naluHeader2 = bytes[1];
      
      return {
        forbidden_bit: (naluHeader1 & 0x80) >> 7,
        nal_unit_type: (naluHeader1 & 0x7E) >> 1,
        layer_id: ((naluHeader1 & 0x01) << 5) | ((naluHeader2 & 0xF8) >> 3),
        temporal_id: (naluHeader2 & 0x07),
        nal_ref_idc: 0, // H.265 does not use this field
        header_size: 2
      };
    } else {
      // H.264 uses 1-byte NALU header
      const naluHeaderByte = bytes[0];
      return {
        forbidden_bit: (naluHeaderByte & 0x80) >> 7,
        nal_ref_idc: (naluHeaderByte & 0x60) >> 5,
        nal_unit_type: naluHeaderByte & 0x1F,
        layer_id: 0,
        temporal_id: 0,
        header_size: 1
      };
    }
  }

  static parseNALU(
    bytes: Uint8Array, 
    startCodeLength: number, 
    position: number, 
    isH265: boolean
  ): BaseNALUInfo {
    const naluBytes = bytes.slice(startCodeLength);
    const { forbidden_bit, nal_unit_type, nal_ref_idc, layer_id, temporal_id, header_size } = this.parseHeader(naluBytes, isH265);
    const naluSize = naluBytes.length;
    const rawHex = Array.from(naluBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(' ');

    const typeMap = isH265 ? H265_TYPES : H264_TYPES;
    const typeDescription = typeMap[nal_unit_type] || `Unknown type (${nal_unit_type})`;

    const detailsBytes = naluBytes.slice(header_size);
    const details = isH265 ? 
      parseH265NALU(detailsBytes, nal_unit_type) :
      parseH264NALU(detailsBytes, nal_unit_type);

    let naluInfo: H264NALUInfo | H265NALUInfo;
    if (isH265) {
      const header: H265NALUHeader = {
        forbidden_bit,
        nal_unit_type,
        layer_id,
        temporal_id,
        typeDescription
      };

      naluInfo = {
        position,
        size: naluSize,
        startCodeType: startCodeLength === 4 ? '00 00 00 01' : '00 00 01',
        rawHex,
        header,
        details,
      };
    } else {
      const header: H264NALUHeader = {
        forbidden_bit,
        nal_ref_idc,
        nal_unit_type,
        typeDescription
      };

      naluInfo = {
        position,
        size: naluSize,
        startCodeType: startCodeLength === 4 ? '00 00 00 01' : '00 00 01',
        rawHex,
        header,
        details,
      };
    }

    return naluInfo;
  }

  static findStartCode(bytes: Uint8Array, position: number, useLongStartCode: boolean): { startCodeLength: number; startCodePosition: number } | null {
    const minLength = useLongStartCode ? 4 : 3;
    
    for (let i = position; i < bytes.length - minLength + 1; i++) {
      if (!useLongStartCode) {
        // Only look for 3-byte start code (00 00 01)
        if (bytes[i] === 0 && bytes[i + 1] === 0 && bytes[i + 2] === 1) {
          return { startCodeLength: 3, startCodePosition: i };
        }
      } else {
        // Only look for 4-byte start code (00 00 00 01)
        if (bytes[i] === 0 && bytes[i + 1] === 0 && bytes[i + 2] === 0 && bytes[i + 3] === 1) {
          return { startCodeLength: 4, startCodePosition: i };
        }
      }
    }
    return null;
  }
}

// Export type definitions
export * from './types';

// Export utility class
export { ExpGolombDecoder } from './expGolomb';

// Export SEI parser
export { parseSEI, parseSEIPayload } from './seiParser';

// Export H.264 parser
export {
  parseH264NALU as parseH264,
  parseSPS as parseH264SPS,
  parsePPS as parseH264PPS,
  parseSliceHeader as parseH264SliceHeader,
  parseAUD as parseH264AUD
} from './h264Parser';

// Export H.265 parser
export {
  parseH265NALU as parseH265,
  parseVPS as parseH265VPS,
  parseSPS as parseH265SPS,
  parsePPS as parseH265PPS
} from './h265Parser'; 