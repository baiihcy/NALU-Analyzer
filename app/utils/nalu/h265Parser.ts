import { ExpGolombDecoder } from './expGolomb';
import { H265VPSInfo, H265SPSInfo, H265PPSInfo, H265ProfileTierLevel } from './types';
import { parseSEI } from './seiParser';

// Parse Profile Tier Level
function parseProfileTierLevel(
  reader: ExpGolombDecoder,
  profilePresentFlag: boolean,
  maxNumSubLayersMinus1: number
): H265ProfileTierLevel {
  const ptl: H265ProfileTierLevel = {
    general_profile_space: reader.readBits(2),
    general_tier_flag: reader.readBits(1) === 1,
    general_profile_idc: reader.readBits(5),
    general_profile_compatibility_flags: [],
    general_constraint_indicator_flags: [],
    general_level_idc: reader.readBits(8)
  };

  // Read 32-bit profile compatibility flags
  for (let j = 0; j < 32; j++) {
    ptl.general_profile_compatibility_flags[j] = reader.readBits(1);
  }

  // Read 48-bit constraint flags
  for (let j = 0; j < 48; j++) {
    ptl.general_constraint_indicator_flags[j] = reader.readBits(1);
  }

  if (maxNumSubLayersMinus1 > 0) {
    ptl.sub_layer_profile_present_flag = [];
    ptl.sub_layer_level_present_flag = [];
    ptl.sub_layer_profile_space = [];
    ptl.sub_layer_tier_flag = [];
    ptl.sub_layer_profile_idc = [];
    ptl.sub_layer_level_idc = [];

    for (let i = 0; i < maxNumSubLayersMinus1; i++) {
      ptl.sub_layer_profile_present_flag[i] = reader.readBits(1) === 1;
      ptl.sub_layer_level_present_flag[i] = reader.readBits(1) === 1;
    }

    for (let i = 0; i < maxNumSubLayersMinus1; i++) {
      if (ptl.sub_layer_profile_present_flag[i]) {
        ptl.sub_layer_profile_space[i] = reader.readBits(2);
        ptl.sub_layer_tier_flag[i] = reader.readBits(1) === 1;
        ptl.sub_layer_profile_idc[i] = reader.readBits(5);
      }
      if (ptl.sub_layer_level_present_flag[i]) {
        ptl.sub_layer_level_idc[i] = reader.readBits(8);
      }
    }
  }

  return ptl;
}

// Parse H.265 VPS
export function parseVPS(data: Uint8Array): H265VPSInfo {
  const reader = new ExpGolombDecoder(data);
  
  const vpsInfo: H265VPSInfo = {
    vps_video_parameter_set_id: reader.readBits(4),
    vps_base_layer_internal_flag: reader.readBits(1) === 1,
    vps_base_layer_available_flag: reader.readBits(1) === 1,
    vps_max_layers_minus1: reader.readBits(6),
    vps_max_sub_layers_minus1: reader.readBits(3),
    vps_temporal_id_nesting_flag: reader.readBits(1) === 1,
    vps_reserved_0xffff_16bits: reader.readBits(16),
    profile_tier_level: parseProfileTierLevel(reader, true, 0),
    vps_sub_layer_ordering_info_present_flag: reader.readBits(1) === 1,
    vps_max_dec_pic_buffering_minus1: [],
    vps_max_num_reorder_pics: [],
    vps_max_latency_increase_plus1: [],
    vps_max_layer_id: reader.readBits(6),
    vps_num_layer_sets_minus1: reader.readUEG(),
    vps_timing_info_present_flag: reader.readBits(1) === 1
  };

  // Read sublayer information
  const maxSubLayers = vpsInfo.vps_max_sub_layers_minus1 + 1;
  for (let i = 0; i < maxSubLayers; i++) {
    vpsInfo.vps_max_dec_pic_buffering_minus1[i] = reader.readUEG();
    vpsInfo.vps_max_num_reorder_pics[i] = reader.readUEG();
    vpsInfo.vps_max_latency_increase_plus1[i] = reader.readUEG();
  }

  // Read timing information
  if (vpsInfo.vps_timing_info_present_flag) {
    vpsInfo.vps_num_units_in_tick = reader.readBits(32);
    vpsInfo.vps_time_scale = reader.readBits(32);
    vpsInfo.vps_poc_proportional_to_timing_flag = reader.readBits(1) === 1;
    if (vpsInfo.vps_poc_proportional_to_timing_flag) {
      vpsInfo.vps_num_ticks_poc_diff_one_minus1 = reader.readUEG();
    }
  }

  return vpsInfo;
}

// Parse H.265 SPS
export function parseSPS(data: Uint8Array): H265SPSInfo {
  const reader = new ExpGolombDecoder(data);
  
  const spsInfo: H265SPSInfo = {
    sps_video_parameter_set_id: reader.readBits(4),
    sps_max_sub_layers_minus1: reader.readBits(3),
    sps_temporal_id_nesting_flag: reader.readBits(1) === 1,
    profile_tier_level: {
      general_profile_space: reader.readBits(2),
      general_tier_flag: reader.readBits(1) === 1,
      general_profile_idc: reader.readBits(5),
      general_level_idc: reader.readBits(8)
    },
    sps_seq_parameter_set_id: reader.readUEG(),
    chroma_format_idc: reader.readUEG(),
    pic_width_in_luma_samples: reader.readUEG(),
    pic_height_in_luma_samples: reader.readUEG(),
    conformance_window_flag: reader.readBits(1) === 1
  };

  if (spsInfo.conformance_window_flag) {
    spsInfo.conf_win_left_offset = reader.readUEG();
    spsInfo.conf_win_right_offset = reader.readUEG();
    spsInfo.conf_win_top_offset = reader.readUEG();
    spsInfo.conf_win_bottom_offset = reader.readUEG();
  }

  return spsInfo;
}

// Parse H.265 PPS
export function parsePPS(data: Uint8Array): H265PPSInfo {
  const reader = new ExpGolombDecoder(data);
  
  const ppsInfo: H265PPSInfo = {
    pps_pic_parameter_set_id: reader.readUEG(),
    pps_seq_parameter_set_id: reader.readUEG(),
    dependent_slice_segments_enabled_flag: reader.readBits(1) === 1,
    output_flag_present_flag: reader.readBits(1) === 1,
    num_extra_slice_header_bits: reader.readBits(3),
    sign_data_hiding_enabled_flag: reader.readBits(1) === 1,
    cabac_init_present_flag: reader.readBits(1) === 1,
    num_ref_idx_l0_default_active_minus1: reader.readUEG(),
    num_ref_idx_l1_default_active_minus1: reader.readUEG(),
    init_qp_minus26: reader.readSEG(),
    constrained_intra_pred_flag: reader.readBits(1) === 1,
    transform_skip_enabled_flag: reader.readBits(1) === 1,
    cu_qp_delta_enabled_flag: reader.readBits(1) === 1
  };

  if (ppsInfo.cu_qp_delta_enabled_flag) {
    ppsInfo.diff_cu_qp_delta_depth = reader.readUEG();
  }

  return ppsInfo;
}

// Parse H.265 NALU
export function parseH265NALU(data: Uint8Array, nal_unit_type: number): any {
  try {
    switch (nal_unit_type) {
      case 32:  // VPS
        return parseVPS(data);
      case 33:  // SPS
        return parseSPS(data);
      case 34:  // PPS
        return parsePPS(data);
      case 39:  // PREFIX_SEI
      case 40:  // SUFFIX_SEI
        return parseSEI(data, true);
      default:
        return undefined;
    }
  } catch (error) {
    console.warn('Failed to parse H.265 NALU:', error);
    return undefined;
  }
}