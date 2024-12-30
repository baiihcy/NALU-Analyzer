import { ExpGolombDecoder } from './expGolomb';
import { H264SPSInfo, H264PPSInfo, H264SliceHeader, H264AUDInfo } from './types';
import { parseSEI } from './seiParser';

// Parse H.264 SPS
export function parseSPS(data: Uint8Array): H264SPSInfo {
  const reader = new ExpGolombDecoder(data);
  
  const spsInfo: H264SPSInfo = {
    profile_idc: reader.readBits(8),
    constraint_set_flags: reader.readBits(8),
    level_idc: reader.readBits(8),
    seq_parameter_set_id: reader.readUEG(),
    log2_max_frame_num_minus4: reader.readUEG(),
    pic_order_cnt_type: reader.readUEG(),
    max_num_ref_frames: reader.readUEG(),
    gaps_in_frame_num_value_allowed_flag: reader.readBits(1) === 1,
    pic_width_in_mbs_minus1: reader.readUEG(),
    pic_height_in_map_units_minus1: reader.readUEG(),
    frame_mbs_only_flag: reader.readBits(1) === 1,
    direct_8x8_inference_flag: reader.readBits(1) === 1,
    frame_cropping_flag: reader.readBits(1) === 1,
  };

  if (spsInfo.pic_order_cnt_type === 0) {
    spsInfo.log2_max_pic_order_cnt_lsb_minus4 = reader.readUEG();
  }

  if (spsInfo.frame_cropping_flag) {
    spsInfo.frame_crop_left_offset = reader.readUEG();
    spsInfo.frame_crop_right_offset = reader.readUEG();
    spsInfo.frame_crop_top_offset = reader.readUEG();
    spsInfo.frame_crop_bottom_offset = reader.readUEG();
  }

  return spsInfo;
}

// Parse H.264 PPS
export function parsePPS(data: Uint8Array): H264PPSInfo {
  const reader = new ExpGolombDecoder(data);
  
  return {
    pic_parameter_set_id: reader.readUEG(),
    seq_parameter_set_id: reader.readUEG(),
    entropy_coding_mode_flag: reader.readBits(1) === 1,
    bottom_field_pic_order_in_frame_present_flag: reader.readBits(1) === 1,
    num_slice_groups_minus1: reader.readUEG(),
    num_ref_idx_l0_default_active_minus1: reader.readUEG(),
    num_ref_idx_l1_default_active_minus1: reader.readUEG(),
    weighted_pred_flag: reader.readBits(1) === 1,
    weighted_bipred_idc: reader.readBits(2),
    pic_init_qp_minus26: reader.readSEG(),
    pic_init_qs_minus26: reader.readSEG(),
    chroma_qp_index_offset: reader.readSEG(),
    deblocking_filter_control_present_flag: reader.readBits(1) === 1,
    constrained_intra_pred_flag: reader.readBits(1) === 1,
    redundant_pic_cnt_present_flag: reader.readBits(1) === 1
  };
}

// Parse H.264 Slice Header
export function parseSliceHeader(data: Uint8Array, nal_unit_type: number): H264SliceHeader {
  const reader = new ExpGolombDecoder(data);
  
  const header: H264SliceHeader = {
    first_mb_in_slice: reader.readUEG(),
    slice_type: reader.readUEG(),
    pic_parameter_set_id: reader.readUEG(),
    frame_num: reader.readBits(16), // This should use log2_max_frame_num_minus4 from SPS
    slice_qp_delta: reader.readSEG(),
  };

  if (nal_unit_type === 5) { // IDR picture
    header.idr_pic_id = reader.readUEG();
  }

  // More field parsing can be added here as needed
  return header;
}

// Parse H.264 AUD
export function parseAUD(data: Uint8Array): H264AUDInfo {
  const reader = new ExpGolombDecoder(data);
  return {
    primary_pic_type: reader.readBits(3)
  };
}

// Parse H.264 NALU
export function parseH264NALU(data: Uint8Array, nal_unit_type: number): any {
  try {
    switch (nal_unit_type) {
      case 1:  // Non-IDR slice
      case 5:  // IDR slice
        return parseSliceHeader(data, nal_unit_type);
      case 6:  // SEI
        return parseSEI(data, false);
      case 7:  // SPS
        return parseSPS(data);
      case 8:  // PPS
        return parsePPS(data);
      case 9:  // AUD
        return parseAUD(data);
      default:
        return undefined;
    }
  } catch (error) {
    console.warn('Failed to parse H.264 NALU:', error);
    return undefined;
  }
}