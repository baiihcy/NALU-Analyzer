// H.265 NALU type descriptions
export const H265_TYPE_DESCRIPTIONS: { [key: number]: string } = {
  0: `TRAIL_N (Trailing, Non-Reference)`,

  1: `TRAIL_R (Trailing, Reference)`,

  16: `BLA_W_LP (Broken Link Access with Leading Pictures)`,

  17: `BLA_W_RADL (BLA with Random Access Decodable Leading)`,

  18: `BLA_N_LP (BLA without Leading Pictures)`,

  19: `IDR_W_RADL (IDR with Random Access Decodable Leading)`,

  20: `IDR_N_LP (IDR without Leading Pictures)`,

  21: `CRA_NUT (Clean Random Access)`,

  32: `VPS_NUT (Video Parameter Set)`,

  33: `SPS_NUT (Sequence Parameter Set)`,

  34: `PPS_NUT (Picture Parameter Set)`,

  35: `AUD_NUT (Access Unit Delimiter)`,

  36: `EOS_NUT (End Of Sequence)`,

  37: `EOB_NUT (End Of Bitstream)`,

  38: `FD_NUT (Filler Data)`,

  39: `PREFIX_SEI_NUT (Prefix SEI)`,

  40: `SUFFIX_SEI_NUT (Suffix SEI)`
};

export const H265_FIELD_DESCRIPTIONS = {
  // NALUInfo fields
  'startCodeType': {
    description: 'Start code type, can be \'00 00 01\' or \'00 00 00 01\'',
    rfcQuote: 'The byte stream format for H.265 video signals has start codes to identify the boundaries of NAL units.',
    link: 'https://www.ietf.org/rfc/rfc7798.html#section-1.1.4'
  },
  'forbidden_bit': {
    description: 'forbidden_zero_bit. A value of 1 indicates a syntax violation.',
    rfcQuote: 'The H.265 specification declares a value of 1 as a syntax violation.',
    link: 'https://www.ietf.org/rfc/rfc7798.html#section-1.1.4'
  },
  'nal_unit_type': {
    description: 'nal_unit_type. This component specifies the NAL unit payload type.',
    rfcQuote: 'This component specifies the NAL unit payload type as defined in table 7-1 of [1], and later within this memo.',
    link: 'https://www.ietf.org/rfc/rfc7798.html#section-1.1.4'
  },
  'layer_id': {
    description: 'layer_id. Used in H.265 for future scalability extensions, must be 0 for current version.',
    rfcQuote: 'The value of nuh_layer_id shall be equal to 0 for a HEVC bitstream conforming to this version of this Specification.',
    link: 'https://www.ietf.org/rfc/rfc7798.html#section-1.1.4'
  },
  'temporal_id': {
    description: 'temporal_id. Used in H.265 to indicate temporal layer, value is temporal_id_plus1 - 1.',
    rfcQuote: 'The value of TemporalId is equal to TID of the NAL unit minus 1.',
    link: 'https://www.ietf.org/rfc/rfc7798.html#section-1.1.4'
  },
  'typeDescription': {
    description: 'A textual description of the NAL unit type',
    rfcQuote: 'Based on the mapping tables defined in RFC6184 and RFC7798'
  },
  'size': {
    description: 'Size of the NAL unit in bytes',
    rfcQuote: 'The NAL unit size is indicated by the packet size.'
  },
  'rawHex': {
    description: 'Raw hexadecimal data of the NAL unit',
    rfcQuote: 'The payload of a NAL unit follows immediately.'
  },
  'position': {
    description: 'Position of the NAL unit in the byte stream',
    rfcQuote: 'Used for locating the NAL unit in the original data'
  },
  'details': {
    description: 'Detailed parsing information of the NAL unit',
    rfcQuote: 'Contains specific information based on the NAL unit type'
  },

  // H265ProfileTierLevel fields
  'general_profile_space': {
    description: 'Profile space (0-3)',
    rfcQuote: 'Specifies the context for the interpretation of general_profile_idc and general_profile_compatibility_flag'
  },
  'general_tier_flag': {
    description: 'Tier flag (0: Main tier, 1: High tier)',
    rfcQuote: 'Specifies the tier context for the interpretation of general_level_idc'
  },
  'general_profile_idc': {
    description: 'Profile indicator',
    rfcQuote: 'Indicates the profile to which the coded video sequence conforms'
  },
  'general_profile_compatibility_flags': {
    description: 'Profile compatibility flags, 32 bits',
    rfcQuote: 'Each flag indicates conformance with a specific profile'
  },
  'general_constraint_indicator_flags': {
    description: 'Constraint indicator flags, 48 bits',
    rfcQuote: 'Specify additional restrictions on the bitstream'
  },
  'general_level_idc': {
    description: 'Level indicator (30 means Level 3.0)',
    rfcQuote: 'Specifies the level to which the bitstream conforms'
  },
  'sub_layer_profile_present_flag': {
    description: 'Sub-layer profile presence flags',
    rfcQuote: 'Specifies whether profile information is present for each sub-layer'
  },
  'sub_layer_level_present_flag': {
    description: 'Sub-layer level presence flags',
    rfcQuote: 'Specifies whether level information is present for each sub-layer'
  },
  'sub_layer_profile_space': {
    description: 'Sub-layer profile space',
    rfcQuote: 'Specifies the context for the interpretation of sub_layer_profile_idc'
  },
  'sub_layer_tier_flag': {
    description: 'Sub-layer tier flags',
    rfcQuote: 'Specifies the tier context for the interpretation of sub_layer_level_idc'
  },
  'sub_layer_profile_idc': {
    description: 'Sub-layer profile indicators',
    rfcQuote: 'Specifies the profile to which each sub-layer conforms'
  },
  'sub_layer_level_idc': {
    description: 'Sub-layer level indicators',
    rfcQuote: 'Specifies the level to which each sub-layer conforms'
  },

  // H265VPSInfo fields
  'vps_video_parameter_set_id': {
    description: 'Video parameter set ID (0-15)',
    rfcQuote: 'Identifies the VPS for reference by other syntax elements'
  },
  'vps_base_layer_internal_flag': {
    description: 'Base layer internal flag',
    rfcQuote: 'Specifies whether the base layer is an internal layer'
  },
  'vps_base_layer_available_flag': {
    description: 'Base layer available flag',
    rfcQuote: 'Specifies whether the base layer is available for reference'
  },
  'vps_max_layers_minus1': {
    description: 'Maximum number of layers minus 1',
    rfcQuote: 'Specifies the maximum allowed number of layers in each CVS'
  },
  'vps_max_sub_layers_minus1': {
    description: 'Maximum number of temporal sub-layers minus 1 (0-6)',
    rfcQuote: 'Specifies the maximum number of temporal sub-layers that may be present in each CVS'
  },
  'vps_temporal_id_nesting_flag': {
    description: 'Temporal ID nesting flag',
    rfcQuote: 'Specifies whether inter prediction is additionally restricted'
  },
  'vps_reserved_0xffff_16bits': {
    description: 'Reserved 16 bits that must be 0xFFFF',
    rfcQuote: 'Shall be equal to 0xFFFF'
  },
  'vps_sub_layer_ordering_info_present_flag': {
    description: 'Sub-layer ordering info present flag',
    rfcQuote: 'Specifies whether vps_max_dec_pic_buffering_minus1, vps_max_num_reorder_pics and vps_max_latency_increase_plus1 are present'
  },
  'vps_max_dec_pic_buffering_minus1': {
    description: 'Maximum number of decoded pictures minus 1',
    rfcQuote: 'Specifies the maximum required size of the decoded picture buffer'
  },
  'vps_max_num_reorder_pics': {
    description: 'Maximum number of pictures that can be reordered',
    rfcQuote: 'Specifies the maximum allowed number of pictures that can precede any picture in decoding order'
  },
  'vps_max_latency_increase_plus1': {
    description: 'Maximum latency increase plus 1',
    rfcQuote: 'Used to compute the value of PicLatencyCount'
  },
  'vps_max_layer_id': {
    description: 'Maximum layer ID',
    rfcQuote: 'Specifies the maximum value of nuh_layer_id'
  },
  'vps_num_layer_sets_minus1': {
    description: 'Number of layer sets minus 1',
    rfcQuote: 'Specifies the number of layer sets that are specified by the VPS'
  },
  'vps_timing_info_present_flag': {
    description: 'Timing info present flag',
    rfcQuote: 'Indicates whether vps_num_units_in_tick, vps_time_scale, vps_poc_proportional_to_timing_flag, and vps_num_ticks_poc_diff_one_minus1 are present'
  },
  'vps_num_units_in_tick': {
    description: 'Number of time units in a tick',
    rfcQuote: 'Specifies the number of time units of a clock operating at the frequency vps_time_scale Hz'
  },
  'vps_time_scale': {
    description: 'Time scale',
    rfcQuote: 'Specifies the number of time units that pass in one second'
  },
  'vps_poc_proportional_to_timing_flag': {
    description: 'POC proportional to timing flag',
    rfcQuote: 'Indicates whether the picture order count value is proportional to the output time'
  },
  'vps_num_ticks_poc_diff_one_minus1': {
    description: 'Number of ticks minus 1 between POC differences of one',
    rfcQuote: 'Specifies the number of clock ticks corresponding to a difference of picture order count values equal to 1'
  },

  // H265SPSInfo fields
  'sps_video_parameter_set_id': {
    description: 'Video parameter set ID that this SPS refers to',
    rfcQuote: 'Identifies the VPS referred to by the SPS'
  },
  'sps_max_sub_layers_minus1': {
    description: 'Maximum number of temporal sub-layers minus 1 (0-6)',
    rfcQuote: 'Specifies the maximum number of temporal sub-layers that may be present in each CVS'
  },
  'sps_temporal_id_nesting_flag': {
    description: 'Temporal ID nesting flag',
    rfcQuote: 'Specifies whether inter prediction is additionally restricted'
  },
  'sps_seq_parameter_set_id': {
    description: 'Sequence parameter set ID',
    rfcQuote: 'Identifies the SPS for reference by other syntax elements'
  },
  'chroma_format_idc': {
    description: 'Chroma format (0: monochrome, 1: 4:2:0, 2: 4:2:2, 3: 4:4:4)',
    rfcQuote: 'Specifies the chroma sampling relative to the luma sampling'
  },
  'pic_width_in_luma_samples': {
    description: 'Picture width in luma samples',
    rfcQuote: 'Specifies the width of each decoded picture in units of luma samples'
  },
  'pic_height_in_luma_samples': {
    description: 'Picture height in luma samples',
    rfcQuote: 'Specifies the height of each decoded picture in units of luma samples'
  },
  'conformance_window_flag': {
    description: 'Conformance window flag',
    rfcQuote: 'Indicates whether conformance window parameters are present'
  },
  'conf_win_left_offset': {
    description: 'Number of luma samples to crop from the left edge',
    rfcQuote: 'Specifies the offset used in calculating the conformance window'
  },
  'conf_win_right_offset': {
    description: 'Number of luma samples to crop from the right edge',
    rfcQuote: 'Specifies the offset used in calculating the conformance window'
  },
  'conf_win_top_offset': {
    description: 'Number of luma samples to crop from the top edge',
    rfcQuote: 'Specifies the offset used in calculating the conformance window'
  },
  'conf_win_bottom_offset': {
    description: 'Number of luma samples to crop from the bottom edge',
    rfcQuote: 'Specifies the offset used in calculating the conformance window'
  },

  // H265PPSInfo fields
  'pps_pic_parameter_set_id': {
    description: 'Picture parameter set ID',
    rfcQuote: 'Identifies the PPS for reference by other syntax elements'
  },
  'pps_seq_parameter_set_id': {
    description: 'Sequence parameter set ID that this PPS refers to',
    rfcQuote: 'Identifies the SPS that is referenced by the PPS'
  },
  'dependent_slice_segments_enabled_flag': {
    description: 'Dependent slice segments enabled flag',
    rfcQuote: 'Specifies whether dependent slice segments are enabled'
  },
  'output_flag_present_flag': {
    description: 'Output flag present flag',
    rfcQuote: 'Indicates whether pic_output_flag is present in slice headers'
  },
  'num_extra_slice_header_bits': {
    description: 'Number of extra bits in slice header',
    rfcQuote: 'Specifies the number of extra slice header bits'
  },
  'sign_data_hiding_enabled_flag': {
    description: 'Sign data hiding enabled flag',
    rfcQuote: 'Specifies whether sign bit hiding is enabled'
  },
  'cabac_init_present_flag': {
    description: 'CABAC initialization present flag',
    rfcQuote: 'Specifies whether CABAC initialization parameters are present'
  },
  'init_qp_minus26': {
    description: 'Initial QP minus 26',
    rfcQuote: 'Specifies the initial value minus 26 of SliceQpY'
  },
  'transform_skip_enabled_flag': {
    description: 'Transform skip enabled flag',
    rfcQuote: 'Specifies whether transform_skip_flag may be present'
  },
  'cu_qp_delta_enabled_flag': {
    description: 'CU QP delta enabled flag',
    rfcQuote: 'Specifies whether cu_qp_delta_abs may be present'
  },
  'diff_cu_qp_delta_depth': {
    description: 'Difference of CU QP delta depths',
    rfcQuote: 'Specifies the difference between the luma CTB size and the minimum luma coding block size of coding units'
  },

  // SEIMessage fields
  'payloadType': {
    description: 'SEI message type',
    rfcQuote: 'Identifies the type of SEI message'
  },
  'payloadSize': {
    description: 'Size of SEI message in bytes',
    rfcQuote: 'Specifies the size of the SEI message payload in bytes'
  },
  'payloadTypeName': {
    description: 'Textual description of SEI message type',
    rfcQuote: 'Based on the mapping defined in RFC7798'
  },
  'payload': {
    description: 'Specific content of the SEI message',
    rfcQuote: 'Structure depends on the payloadType'
  }
} as const;