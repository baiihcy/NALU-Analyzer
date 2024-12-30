# NALU Analysis Tool

A web-based tool for parsing and analyzing Network Abstraction Layer Units (NALUs) from H.264/AVC and H.265/HEVC bitstreams.

## Features

- Support for both H.264/AVC and H.265/HEVC bitstreams
- Parse NALUs from hex input or file upload
- Drag and drop file support
- Detailed NALU information display
- Filter NALUs by type
- Paginated results view
- Progress tracking for large files
- Web Worker based processing for better performance

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

## Demo

You can try out the live demo at: [nalu-analyzer.vpnight.xyz](https://nalu-analyzer.vpnight.xyz)


## References

- [ITU-T H.264 Specification](https://www.itu.int/rec/T-REC-H.264)
- [ITU-T H.265 Specification](https://www.itu.int/rec/T-REC-H.265)
- [RFC 6184: RTP Payload Format for H.264 Video](https://datatracker.ietf.org/doc/html/rfc6184)
- [RFC 7798: RTP Payload Format for HEVC](https://datatracker.ietf.org/doc/html/rfc7798)
