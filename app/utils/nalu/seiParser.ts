import { ExpGolombDecoder } from './expGolomb';
import { SEIMessage, SEIPayloadType } from './types';

// Parse the specific content of SEI messages
export function parseSEIPayload(reader: ExpGolombDecoder, payloadType: number, payloadSize: number, isH265: boolean): any {
  switch (payloadType) {
    case SEIPayloadType.BUFFERING_PERIOD:
      return parseBufferingPeriod(reader, isH265);
    case SEIPayloadType.PICTURE_TIMING:
      return parsePictureTiming(reader, isH265);
    case SEIPayloadType.RECOVERY_POINT:
      return parseRecoveryPoint(reader);
    case SEIPayloadType.FILM_GRAIN_CHARACTERISTICS:
      return parseFilmGrainCharacteristics(reader);
    case SEIPayloadType.FRAME_PACKING_ARRANGEMENT:
      return parseFramePackingArrangement(reader);
    case SEIPayloadType.DISPLAY_ORIENTATION:
      return parseDisplayOrientation(reader);
    case SEIPayloadType.MASTERING_DISPLAY_COLOUR_VOLUME:
      return parseMasteringDisplayColourVolume(reader);
    case SEIPayloadType.CONTENT_LIGHT_LEVEL_INFO:
      return parseContentLightLevelInfo(reader);
    default:
      // For unimplemented parsing types, return the raw byte data
      const payloadData = new Uint8Array(payloadSize);
      for (let i = 0; i < payloadSize; i++) {
        payloadData[i] = reader.readBits(8);
      }
      return { raw: Array.from(payloadData).map(b => b.toString(16).padStart(2, '0')).join(' ') };
  }
}

// Parse Buffering Period SEI
function parseBufferingPeriod(reader: ExpGolombDecoder, isH265: boolean): any {
  const info: any = {
    seq_parameter_set_id: reader.readUEG()
  };
  
  if (isH265) {
    info.irap_cpb_params_present_flag = reader.readBits(1) === 1;
    if (info.irap_cpb_params_present_flag) {
      info.cpb_delay_offset = reader.readBits(8);
      info.dpb_delay_offset = reader.readBits(8);
    }
  }
  
  return info;
}

// Parse Picture Timing SEI
function parsePictureTiming(reader: ExpGolombDecoder, isH265: boolean): any {
  const info: any = {};
  
  if (isH265) {
    info.pic_struct = reader.readBits(4);
    info.source_scan_type = reader.readBits(2);
    info.duplicate_flag = reader.readBits(1) === 1;
  } else {
    info.clock_timestamp_flag = reader.readBits(1) === 1;
    if (info.clock_timestamp_flag) {
      info.ct_type = reader.readBits(2);
      info.nuit_field_based_flag = reader.readBits(1) === 1;
      info.counting_type = reader.readBits(5);
      info.full_timestamp_flag = reader.readBits(1) === 1;
      info.discontinuity_flag = reader.readBits(1) === 1;
      info.cnt_dropped_flag = reader.readBits(1) === 1;
      info.n_frames = reader.readBits(8);
    }
  }
  
  return info;
}

// Parse Recovery Point SEI
function parseRecoveryPoint(reader: ExpGolombDecoder): any {
  return {
    recovery_cnt: reader.readSEG(),
    exact_match_flag: reader.readBits(1) === 1,
    broken_link_flag: reader.readBits(1) === 1
  };
}

// Parse Film Grain Characteristics SEI
function parseFilmGrainCharacteristics(reader: ExpGolombDecoder): any {
  return {
    film_grain_characteristics_cancel_flag: reader.readBits(1) === 1,
    film_grain_model_id: reader.readBits(2),
    separate_colour_description_present_flag: reader.readBits(1) === 1,
    film_grain_bit_depth_luma_minus8: reader.readBits(3),
    film_grain_bit_depth_chroma_minus8: reader.readBits(3),
    film_grain_full_range_flag: reader.readBits(1) === 1,
    film_grain_colour_primaries: reader.readBits(8),
    film_grain_transfer_characteristics: reader.readBits(8),
    film_grain_matrix_coefficients: reader.readBits(8)
  };
}

// Parse Frame Packing Arrangement SEI
function parseFramePackingArrangement(reader: ExpGolombDecoder): any {
  return {
    frame_packing_arrangement_id: reader.readUEG(),
    frame_packing_arrangement_cancel_flag: reader.readBits(1) === 1,
    frame_packing_arrangement_type: reader.readBits(7),
    quincunx_sampling_flag: reader.readBits(1) === 1,
    content_interpretation_type: reader.readBits(6),
    spatial_flipping_flag: reader.readBits(1) === 1,
    frame0_flipped_flag: reader.readBits(1) === 1,
    field_views_flag: reader.readBits(1) === 1,
    current_frame_is_frame0_flag: reader.readBits(1) === 1,
    frame0_self_contained_flag: reader.readBits(1) === 1,
    frame1_self_contained_flag: reader.readBits(1) === 1
  };
}

// Parse Display Orientation SEI
function parseDisplayOrientation(reader: ExpGolombDecoder): any {
  return {
    display_orientation_cancel_flag: reader.readBits(1) === 1,
    hor_flip: reader.readBits(1) === 1,
    ver_flip: reader.readBits(1) === 1,
    anticlockwise_rotation: reader.readBits(16)
  };
}

// Parse Mastering Display Colour Volume SEI
function parseMasteringDisplayColourVolume(reader: ExpGolombDecoder): any {
  const info: any = {
    display_primaries_x: [],
    display_primaries_y: []
  };
  
  for (let i = 0; i < 3; i++) {
    info.display_primaries_x[i] = reader.readBits(16);
    info.display_primaries_y[i] = reader.readBits(16);
  }
  
  info.white_point_x = reader.readBits(16);
  info.white_point_y = reader.readBits(16);
  info.max_display_mastering_luminance = reader.readBits(32);
  info.min_display_mastering_luminance = reader.readBits(32);
  
  return info;
}

// Parse Content Light Level Information SEI
function parseContentLightLevelInfo(reader: ExpGolombDecoder): any {
  return {
    max_content_light_level: reader.readBits(16),
    max_pic_average_light_level: reader.readBits(16)
  };
}

// Parse SEI messages
export function parseSEI(data: Uint8Array, isH265: boolean): SEIMessage[] {
  const reader = new ExpGolombDecoder(data);
  const messages: SEIMessage[] = [];
  
  while (reader.bitsAvailable() > 16) { // At least 2 bytes needed for payloadType and payloadSize
    let payloadType = 0;
    let payloadSize = 0;
    let byte = 0;

    // According to the standard, payloadType uses variable length encoding
    do {
      if (!reader.bitsAvailable()) {
        break;
      }
      byte = reader.readBits(8);
      payloadType += byte;
    } while (byte === 0xFF);

    // According to the standard, payloadSize uses variable length encoding
    do {
      if (!reader.bitsAvailable()) {
        break;
      }
      byte = reader.readBits(8);
      payloadSize += byte;
    } while (byte === 0xFF);

    const payload = parseSEIPayload(reader, payloadType, payloadSize, isH265);
    
    messages.push({
      payloadType,
      payloadSize,
      payloadTypeName: SEIPayloadType[payloadType] || `Unknown (${payloadType})`,
      payload
    });

    // Byte alignment required by the standard
    reader.byteAlign();
  }

  return messages;
}