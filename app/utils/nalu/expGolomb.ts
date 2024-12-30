// Exp-Golomb Decoder Class
export class ExpGolombDecoder {
  private data: Uint8Array;
  private bitPos: number = 0;

  constructor(data: Uint8Array) {
    this.data = data;
  }

  // Read one bit
  private readBit(): number {
    const byteIndex = Math.floor(this.bitPos / 8);
    const bitOffset = 7 - (this.bitPos % 8);
    this.bitPos++;
    return (this.data[byteIndex] >> bitOffset) & 0x01;
  }

  // Read n bits
  readBits(n: number): number {
    let result = 0;
    for (let i = 0; i < n; i++) {
      result = (result << 1) | this.readBit();
    }
    return result;
  }

  // Read unsigned exponential Golomb code
  readUEG(): number {
    let leadingZeroBits = 0;
    while (this.readBit() === 0 && leadingZeroBits < 32) {
      leadingZeroBits++;
    }
    return (1 << leadingZeroBits) - 1 + this.readBits(leadingZeroBits);
  }

  // Read signed exponential Golomb code
  readSEG(): number {
    const value = this.readUEG();
    if (value === 0) return 0;
    const positive = (value & 0x01) === 1;
    return positive ? (value + 1) >> 1 : -(value >> 1);
  }

  // Skip alignment bits
  skipBits(n: number): void {
    this.bitPos += n;
  }

  // Byte alignment
  byteAlign(): void {
    this.bitPos = Math.ceil(this.bitPos / 8) * 8;
  }

  // Get remaining available bits
  bitsAvailable(): number {
    return (this.data.length * 8) - this.bitPos;
  }
}