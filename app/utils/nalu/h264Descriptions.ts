// H.264 NALU type descriptions
export const H264_TYPE_DESCRIPTIONS: { [key: number]: string } = {
  0: `UNSPEC (Unspecified)`,

  1: `NONIDR (Non-IDR)`,

  2: `DPA (Data Partition A)`,

  3: `DPB (Data Partition B)`,

  4: `DPC (Data Partition C)`,

  5: `IDR (Instantaneous Decoding Refresh)`,

  6: `SEI (Supplemental Enhancement Information)`,

  7: `SPS (Sequence Parameter Set)`,

  8: `PPS (Picture Parameter Set)`,

  9: `AUD (Access Unit Delimiter)`,

  10: `EOS (End Of Sequence)`,

  11: `EOB (End Of Bitstream)`,

  12: `FD (Filler Data)`,

  13: `SPSE (SPS Extension)`,

  14: `PREFIX (Prefix NAL)`,

  15: `SSPS (Subset SPS)`,

  19: `AUX (Auxiliary)`,

  20: `CSE (Coded Slice Extension)`
};

export const H264_FIELD_DESCRIPTIONS = {
  // NALUInfo fields
  'startCodeType': {
    description: 'Start code type, can be \'00 00 01\' or \'00 00 00 01\'',
    rfcQuote: 'The byte stream format for H.264 video signals has start codes to identify the boundaries of NAL units.',
    link: 'https://www.ietf.org/rfc/rfc6184.html#section-5.1'
  },
  'forbidden_bit': {
    description: 'forbidden_zero_bit. A value of 1 indicates a syntax violation.',
    rfcQuote: 'The H.264 specification declares a value of 1 as a syntax violation.',
    link: 'https://www.ietf.org/rfc/rfc6184.html#section-5.3'
  },
  'nal_ref_idc': {
    description: 'nal_ref_idc. A value of 00 indicates that the content of the NAL unit is not used to reconstruct reference pictures for inter picture prediction.',
    rfcQuote: 'Values greater than 00 indicate that the decoding of the NAL unit is required to maintain the integrity of the reference pictures.',
    link: 'https://www.ietf.org/rfc/rfc6184.html#section-5.3'
  },
  'nal_unit_type': {
    description: 'nal_unit_type. This component specifies the NAL unit payload type.',
    rfcQuote: 'This component specifies the NAL unit payload type as defined in table 7-1 of [1], and later within this memo.',
    link: 'https://www.ietf.org/rfc/rfc6184.html#section-5.4'
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

  // ParserOptions fields
  'useLongStartCode': {
    description: 'Whether to use 4-byte start codes (true: 00 00 00 01, false: 00 00 01)',
    rfcQuote: 'The byte stream format for H.264 video signals has start codes to identify the boundaries of NAL units.'
  },
  'isH265': {
    description: 'Whether the stream is H.265/HEVC format',
    rfcQuote: 'Determines which NAL unit header format and type mappings to use',
  },

  // H264SPSInfo fields
  'profile_idc': {
    description: 'Indicates the profile to which the encoded video conforms',
    rfcQuote: 'The profile-level-id parameter indicates the default sub-profile (i.e., the subset of coding tools that may have been used to generate the stream or that the receiver supports) and the default level of the stream or the receiver supports.',
    link: 'https://www.ietf.org/rfc/rfc6184.html#section-8.1'
  },
  'constraint_set_flags': {
    description: 'Constraint flags indicating specific constraints on the bitstream',
    rfcQuote: 'The profile-iop octet indicates the supported profile-level-id combinations expressed as constraints of the bitstream',
    link: 'https://www.ietf.org/rfc/rfc6184.html#section-8.1'
  },
  'level_idc': {
    description: 'Indicates the level to which the encoded video conforms', 
    rfcQuote: 'The default level is indicated by the level_idc byte, and, when profile_idc is equal to 66, 77, or 88 (the Baseline, Main, or Extended profile) and level_idc is equal to 11, additionally by bit 4 (constraint_set3_flag) of the profile-iop byte.',
    link: 'https://www.ietf.org/rfc/rfc6184.html#section-8.1'
  },
  'seq_parameter_set_id': {
    description: 'Sequence parameter set identifier',
    rfcQuote: 'Used to identify the sequence parameter set that is referred to'
  },
  'log2_max_frame_num_minus4': {
    description: 'Used to calculate the maximum frame number value',
    rfcQuote: 'The value of max_frame_num_minus4 plus 4 determines the length of the frame_num syntax element'
  },
  'pic_order_cnt_type': {
    description: 'Picture order count type (0-2)',
    rfcQuote: 'Specifies the method to decode picture order count'
  },
  'log2_max_pic_order_cnt_lsb_minus4': {
    description: 'Used to calculate the maximum picture order count when pic_order_cnt_type is 0',
    rfcQuote: 'The value of log2_max_pic_order_cnt_lsb_minus4 plus 4 specifies the length of the pic_order_cnt_lsb syntax element'
  },
  'max_num_ref_frames': {
    description: 'Maximum number of reference frames',
    rfcQuote: 'Specifies the maximum number of short-term and long-term reference frames'
  },
  'gaps_in_frame_num_value_allowed_flag': {
    description: 'Indicates whether gaps in frame_num values are allowed',
    rfcQuote: 'Specifies whether frame_num may contain gaps'
  },
  'pic_width_in_mbs_minus1': {
    description: 'Picture width in macroblocks minus 1',
    rfcQuote: 'Specifies the width of each decoded picture in units of macroblocks'
  },
  'pic_height_in_map_units_minus1': {
    description: 'Picture height in macroblock pairs minus 1',
    rfcQuote: 'Specifies the height of each decoded picture in units of macroblocks'
  },
  'frame_mbs_only_flag': {
    description: 'Indicates whether only frame coding is used',
    rfcQuote: 'Specifies whether only frame coding (not field coding) is used'
  },
  'direct_8x8_inference_flag': {
    description: 'Specifies the method used in the derivation process for luma motion vectors',
    rfcQuote: 'Specifies the method used in the derivation process for luma motion vectors'
  },
  'frame_cropping_flag': {
    description: 'Indicates whether the frame is cropped',
    rfcQuote: 'Indicates whether the frame dimensions are to be cropped'
  },
  'frame_crop_left_offset': {
    description: 'Number of luma samples to crop from the left edge',
    rfcQuote: 'Specifies the number of luma samples to crop from the left edge'
  },
  'frame_crop_right_offset': {
    description: 'Number of luma samples to crop from the right edge',
    rfcQuote: 'Specifies the number of luma samples to crop from the right edge'
  },
  'frame_crop_top_offset': {
    description: 'Number of luma samples to crop from the top edge',
    rfcQuote: 'Specifies the number of luma samples to crop from the top edge'
  },
  'frame_crop_bottom_offset': {
    description: 'Number of luma samples to crop from the bottom edge',
    rfcQuote: 'Specifies the number of luma samples to crop from the bottom edge'
  },

  // H264PPSInfo fields
  'pic_parameter_set_id': {
    description: 'Picture parameter set identifier',
    rfcQuote: 'Uniquely identifies the picture parameter set'
  },
  'entropy_coding_mode_flag': {
    description: 'Entropy coding mode flag (0: CAVLC, 1: CABAC)',
    rfcQuote: 'Specifies the entropy decoding method to be applied'
  },
  'bottom_field_pic_order_in_frame_present_flag': {
    description: 'Indicates if pic_order_cnt_type is present in slice headers',
    rfcQuote: 'Specifies whether pic_order_cnt_type is present in slice headers'
  },
  'num_slice_groups_minus1': {
    description: 'Number of slice groups minus 1',
    rfcQuote: 'Specifies the number of slice groups for a picture'
  },
  'num_ref_idx_l0_default_active_minus1': {
    description: 'Default number of reference indexes for list 0 minus 1',
    rfcQuote: 'Specifies the maximum reference index for reference picture list 0'
  },
  'num_ref_idx_l1_default_active_minus1': {
    description: 'Default number of reference indexes for list 1 minus 1',
    rfcQuote: 'Specifies the maximum reference index for reference picture list 1'
  },
  'weighted_pred_flag': {
    description: 'Indicates if weighted prediction is used for P and SP slices',
    rfcQuote: 'Specifies whether weighted prediction shall be applied to P and SP slices'
  },
  'weighted_bipred_idc': {
    description: 'Specifies the weighted prediction method for B slices',
    rfcQuote: 'Specifies the weighted prediction method applied to B slices'
  },
  'pic_init_qp_minus26': {
    description: 'Initial QP value minus 26',
    rfcQuote: 'Specifies the initial value minus 26 of SliceQPY for each slice'
  },
  'pic_init_qs_minus26': {
    description: 'Initial QS value minus 26 for SP/SI slices',
    rfcQuote: 'Specifies the initial value minus 26 of SliceQSY for SP and SI slices'
  },
  'chroma_qp_index_offset': {
    description: 'Offset to be added to QPY for Cb chroma component',
    rfcQuote: 'Specifies the offset to be added to QPY for addressing the QPC table for the Cb chroma component'
  },
  'deblocking_filter_control_present_flag': {
    description: 'Indicates if deblocking filter parameters are present in slice header',
    rfcQuote: 'Specifies whether deblocking filter parameters are present in the slice header'
  },
  'constrained_intra_pred_flag': {
    description: 'Indicates if constrained intra prediction is used',
    rfcQuote: 'Specifies whether constrained intra prediction is used'
  },
  'redundant_pic_cnt_present_flag': {
    description: 'Indicates if redundant coded pictures are used',
    rfcQuote: 'Specifies whether redundant coded pictures are used'
  },
  // H264SliceHeader fields
  'first_mb_in_slice': {
    description: 'Address of the first macroblock in the slice',
    rfcQuote: 'Specifies the spatial address of the first macroblock in the slice'
  },
  'slice_type': {
    description: 'Type of slice (P, B, I, SP, SI)', 
    rfcQuote: 'Specifies the coding type of the slice according to Table 7-6 of H.264'
  },
  'frame_num': {
    description: 'Frame number used as picture identifier',
    rfcQuote: 'Used as an identifier for pictures and shall be represented by log2_max_frame_num_minus4 + 4 bits in the bitstream'
  },
  'field_pic_flag': {
    description: 'Indicates if picture is coded as field',
    rfcQuote: 'When present, indicates whether the slice is part of a coded field or a coded frame'
  },
  'bottom_field_flag': {
    description: 'Indicates if slice is bottom field',
    rfcQuote: 'When present, specifies whether the slice is part of a bottom field picture or a top field picture'
  },
  'idr_pic_id': {
    description: 'Identifier for IDR pictures',
    rfcQuote: 'Identifies an IDR picture. All slices of an IDR picture shall have the same value of idr_pic_id'
  },
  'pic_order_cnt_lsb': {
    description: 'Picture order count least significant bits',
    rfcQuote: 'Specifies the picture order count modulo MaxPicOrderCntLsb for the top field or the frame'
  },
  'slice_qp_delta': {
    description: 'QP value offset for the slice',
    rfcQuote: 'Specifies the initial value of QPY to be used for all macroblocks in the slice until modified by contents of the macroblock layer'
  },
  'disable_deblocking_filter_idc': {
    description: 'Controls deblocking filter (0: enabled, 1: disabled, 2: disabled at slice boundaries)',
    rfcQuote: 'Specifies whether the operation of the deblocking filter shall be disabled across some block edges of the slice'
  },
  'slice_alpha_c0_offset_div2': {
    description: 'Alpha offset for deblocking filter',
    rfcQuote: 'Specifies the offset used in the deblocking filter equations for controlling the filter strength'
  },
  'slice_beta_offset_div2': {
    description: 'Beta offset for deblocking filter',
    rfcQuote: 'Specifies the offset used in the deblocking filter equations for controlling the filter strength'
  },

  // H264AUDInfo fields
  'primary_pic_type': {
    description: 'Primary picture type (0-7)',
    rfcQuote: 'Specifies the picture type that may follow the access unit delimiter in decoding order'
  },
};