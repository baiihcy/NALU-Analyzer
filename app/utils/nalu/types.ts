// Basic NALU Information Interface
export interface BaseNALUInfo {
  /** 
   * Start code type, can be '00 00 01' or '00 00 00 01'
   * RFC6184: "The byte stream format for H.264 video signals has start codes to identify the boundaries of NAL units."
   */
  startCodeType: string;

  /** 
   * Size of the NAL unit in bytes
   * RFC6184: "The NAL unit size is indicated by the packet size."
   */
  size: number;

  /** 
   * Position of the NAL unit in the byte stream
   * Used for locating the NAL unit in the original data
   */
  position: number;

  /** 
   * Raw hexadecimal data of the NAL unit
   * RFC6184: "The payload of a NAL unit follows immediately."
   */
  rawHex: string;

  /** 
   * Detailed parsing information of the NAL unit
   * Contains specific information based on the NAL unit type
   */
  details?: any;
}

// H.264 NALU Header Interface
export interface H264NALUHeader {
  /** 
   * forbidden_zero_bit. A value of 1 indicates a syntax violation.
   * RFC6184: "The H.264 specification declares a value of 1 as a syntax violation."
   */
  forbidden_bit: number;

  /** 
   * nal_ref_idc. A value of 00 indicates that the content of the NAL unit is not used to reconstruct reference pictures for inter picture prediction.
   * RFC6184: "Values greater than 00 indicate that the decoding of the NAL unit is required to maintain the integrity of the reference pictures."
   */
  nal_ref_idc: number;

  /** 
   * nal_unit_type. This component specifies the NAL unit payload type.
   * RFC6184: "This component specifies the NAL unit payload type as defined in table 7-1 of [1], and later within this memo."
   */
  nal_unit_type: number;

  /** 
   * A textual description of the NAL unit type
   * Based on the mapping tables defined in RFC6184 and RFC7798
   */
  typeDescription: string;
}

// H.264 NALU Information Interface
export interface H264NALUInfo extends BaseNALUInfo {
  header: H264NALUHeader;
}

// H.265 NALU Header Interface
export interface H265NALUHeader {
  /** 
   * forbidden_zero_bit. A value of 1 indicates a syntax violation.
   * RFC6184: "The H.264 specification declares a value of 1 as a syntax violation."
   */
  forbidden_bit: number;

  /** 
   * nal_unit_type. This component specifies the NAL unit payload type.
   * RFC7798: "This component specifies the NAL unit payload type as defined in table 7-1."
   */
  nal_unit_type: number;

  /** 
   * layer_id. Used in H.265 for future scalability extensions, must be 0 for current version.
   * RFC7798: "The value of nuh_layer_id shall be equal to 0 for a HEVC bitstream conforming to this version of this Specification."
   */
  layer_id: number;

  /** 
   * temporal_id. Used in H.265 to indicate temporal layer, value is temporal_id_plus1 - 1.
   * RFC7798: "The value of TemporalId is equal to TID of the NAL unit minus 1."
   */
  temporal_id: number;

  /** 
   * A textual description of the NAL unit type
   * Based on the mapping tables defined in RFC6184 and RFC7798
   */
  typeDescription: string;
}

// H.265 NALU Information Interface
export interface H265NALUInfo extends BaseNALUInfo {
  header: H265NALUHeader;
}

// Parser Options Interface
export interface ParserOptions {
  /** 
   * Whether to use 4-byte start codes (true: 00 00 00 01, false: 00 00 01)
   * RFC6184: "The byte stream format for H.264 video signals has start codes to identify the boundaries of NAL units."
   */
  useLongStartCode: boolean;

  /** 
   * Whether the stream is H.265/HEVC format
   * Determines which NAL unit header format and type mappings to use
   */
  isH265: boolean;
}

// H.264 SPS Information Interface
export interface H264SPSInfo {
  /** 
   * Indicates the profile to which the encoded video conforms
   * RFC6184: "Indicates the profile to which the bitstream conforms"
   */
  profile_idc: number;

  /** 
   * Constraint flags indicating specific constraints on the bitstream
   * RFC6184: "Constraint flags that indicate specific restrictions on the bitstream"
   */
  constraint_set_flags: number;

  /** 
   * Indicates the level to which the encoded video conforms
   * RFC6184: "Indicates the level to which the bitstream conforms"
   */
  level_idc: number;

  /** 
   * Sequence parameter set identifier
   * RFC6184: "Used to identify the sequence parameter set that is referred to"
   */
  seq_parameter_set_id: number;

  /** 
   * Used to calculate the maximum frame number value
   * RFC6184: "The value of max_frame_num_minus4 plus 4 determines the length of the frame_num syntax element"
   */
  log2_max_frame_num_minus4: number;

  /** 
   * Picture order count type (0-2)
   * RFC6184: "Specifies the method to decode picture order count"
   */
  pic_order_cnt_type: number;

  /** 
   * Used to calculate the maximum picture order count when pic_order_cnt_type is 0
   * RFC6184: "The value of log2_max_pic_order_cnt_lsb_minus4 plus 4 specifies the length of the pic_order_cnt_lsb syntax element"
   */
  log2_max_pic_order_cnt_lsb_minus4?: number;

  /** 
   * Maximum number of reference frames
   * RFC6184: "Specifies the maximum number of short-term and long-term reference frames"
   */
  max_num_ref_frames: number;

  /** 
   * Indicates whether gaps in frame_num values are allowed
   * RFC6184: "Specifies whether frame_num may contain gaps"
   */
  gaps_in_frame_num_value_allowed_flag: boolean;

  /** 
   * Picture width in macroblocks minus 1
   * RFC6184: "Specifies the width of each decoded picture in units of macroblocks"
   */
  pic_width_in_mbs_minus1: number;

  /** 
   * Picture height in macroblock pairs minus 1
   * RFC6184: "Specifies the height of each decoded picture in units of macroblocks"
   */
  pic_height_in_map_units_minus1: number;

  /** 
   * Indicates whether only frame coding is used
   * RFC6184: "Specifies whether only frame coding (not field coding) is used"
   */
  frame_mbs_only_flag: boolean;

  /** 
   * Specifies the method used in the derivation process for luma motion vectors
   * RFC6184: "Specifies the method used in the derivation process for luma motion vectors"
   */
  direct_8x8_inference_flag: boolean;

  /** 
   * Indicates whether the frame is cropped
   * RFC6184: "Indicates whether the frame dimensions are to be cropped"
   */
  frame_cropping_flag: boolean;

  /** 
   * Number of luma samples to crop from the left edge
   * RFC6184: "Specifies the number of luma samples to crop from the left edge"
   */
  frame_crop_left_offset?: number;

  /** 
   * Number of luma samples to crop from the right edge
   * RFC6184: "Specifies the number of luma samples to crop from the right edge"
   */
  frame_crop_right_offset?: number;

  /** 
   * Number of luma samples to crop from the top edge
   * RFC6184: "Specifies the number of luma samples to crop from the top edge"
   */
  frame_crop_top_offset?: number;

  /** 
   * Number of luma samples to crop from the bottom edge
   * RFC6184: "Specifies the number of luma samples to crop from the bottom edge"
   */
  frame_crop_bottom_offset?: number;
}

// H.264 PPS Information Interface
export interface H264PPSInfo {
  /** 
   * Picture parameter set identifier
   * RFC6184: "Uniquely identifies the picture parameter set"
   */
  pic_parameter_set_id: number;

  /** 
   * Sequence parameter set identifier that this PPS refers to
   * RFC6184: "Refers to the active sequence parameter set"
   */
  seq_parameter_set_id: number;

  /** 
   * Entropy coding mode flag (0: CAVLC, 1: CABAC)
   * RFC6184: "Specifies the entropy decoding method to be applied"
   */
  entropy_coding_mode_flag: boolean;

  /** 
   * Indicates if bottom_field_pic_order_in_frame_present_flag is present
   * RFC6184: "Specifies whether pic_order_cnt_type is present in slice headers"
   */
  bottom_field_pic_order_in_frame_present_flag: boolean;

  /** 
   * Number of slice groups minus 1
   * RFC6184: "Specifies the number of slice groups for a picture"
   */
  num_slice_groups_minus1: number;

  /** 
   * Number of reference indexes for list 0 for P and B slices
   * RFC6184: "Specifies the maximum reference index for reference picture list 0"
   */
  num_ref_idx_l0_default_active_minus1: number;

  /** 
   * Number of reference indexes for list 1 for B slices
   * RFC6184: "Specifies the maximum reference index for reference picture list 1"
   */
  num_ref_idx_l1_default_active_minus1: number;

  /** 
   * Indicates the presence of weighted prediction in P slices
   * RFC6184: "Specifies whether weighted prediction shall be applied to P and SP slices"
   */
  weighted_pred_flag: boolean;

  /** 
   * Weighted prediction mode for B slices (0-2)
   * RFC6184: "Specifies the weighted prediction method applied to B slices"
   */
  weighted_bipred_idc: number;

  /** 
   * Initial QP value minus 26
   * RFC6184: "Specifies the initial value minus 26 of SliceQPY for each slice"
   */
  pic_init_qp_minus26: number;

  /** 
   * Initial QS value for SP and SI slices minus 26
   * RFC6184: "Specifies the initial value minus 26 of SliceQSY for SP and SI slices"
   */
  pic_init_qs_minus26: number;

  /** 
   * Chroma QP offset value
   * RFC6184: "Specifies the offset to be added to QPY for addressing the QPC table for the Cb chroma component"
   */
  chroma_qp_index_offset: number;

  /** 
   * Indicates presence of deblocking filter parameters
   * RFC6184: "Specifies whether deblocking filter parameters are present in the slice header"
   */
  deblocking_filter_control_present_flag: boolean;

  /** 
   * Constrains intra prediction to use neighboring macroblocks coded in intra mode
   * RFC6184: "Specifies whether constrained intra prediction is used"
   */
  constrained_intra_pred_flag: boolean;

  /** 
   * Indicates presence of redundant slice coding
   * RFC6184: "Specifies whether redundant coded pictures are used"
   */
  redundant_pic_cnt_present_flag: boolean;
}

// H.264 Slice Header Information Interface
export interface H264SliceHeader {
  /** 
   * Address of the first macroblock in the slice
   * RFC6184: "Specifies the address of the first macroblock in the slice"
   */
  first_mb_in_slice: number;

  /** 
   * Type of slice (0: P, 1: B, 2: I, 3-9: SI/SP)
   * RFC6184: "Specifies the coding type of the slice"
   */
  slice_type: number;

  /** 
   * Picture parameter set ID that the slice refers to
   * RFC6184: "Specifies the picture parameter set in use"
   */
  pic_parameter_set_id: number;

  /** 
   * Frame number
   * RFC6184: "Used as an identifier for pictures"
   */
  frame_num: number;

  /** 
   * Indicates if the slice is coded as a field
   * RFC6184: "Indicates whether the slice is coded as a field"
   */
  field_pic_flag?: boolean;

  /** 
   * Indicates if the slice is the bottom field of a frame
   * RFC6184: "Indicates which field of a frame the slice represents"
   */
  bottom_field_flag?: boolean;

  /** 
   * Identifier for IDR pictures
   * RFC6184: "Identifies an IDR picture"
   */
  idr_pic_id?: number;

  /** 
   * Picture order count - least significant bits
   * RFC6184: "The picture order count modulo MaxPicOrderCntLsb"
   */
  pic_order_cnt_lsb?: number;

  /** 
   * Specifies the QP value used for the slice
   * RFC6184: "Specifies the initial value of QPY to be used for the slice"
   */
  slice_qp_delta: number;

  /** 
   * Disable deblocking filter (0: enabled, 1: disabled, 2: disabled at slice boundaries)
   * RFC6184: "Specifies whether the operation of the deblocking filter shall be disabled"
   */
  disable_deblocking_filter_idc?: number;

  /** 
   * Alpha component of deblocking filter strength
   * RFC6184: "Specifies the offset used in the deblocking filter equations for alpha"
   */
  slice_alpha_c0_offset_div2?: number;

  /** 
   * Beta component of deblocking filter strength
   * RFC6184: "Specifies the offset used in the deblocking filter equations for beta"
   */
  slice_beta_offset_div2?: number;
}

// H.264 AUD Information Interface
export interface H264AUDInfo {
  /** 
   * Primary picture type (0-7)
   * RFC6184: "Indicates the type of pictures that may follow the AUD in decoding order"
   */
  primary_pic_type: number;
}

// H.265 Profile Tier Level Information
export interface H265ProfileTierLevel {
  /** 
   * Profile space (0-3)
   * RFC7798: "Specifies the context for the interpretation of general_profile_idc and general_profile_compatibility_flag"
   */
  general_profile_space: number;

  /** 
   * Tier flag (0: Main tier, 1: High tier)
   * RFC7798: "Specifies the tier context for the interpretation of general_level_idc"
   */
  general_tier_flag: boolean;

  /** 
   * Profile indicator (0-31)
   * RFC7798: "Specifies the profile to which the bitstream conforms"
   */
  general_profile_idc: number;

  /** 
   * Profile compatibility flags, 32 bits
   * RFC7798: "Each flag indicates conformance with a specific profile"
   */
  general_profile_compatibility_flags: number[];

  /** 
   * Constraint indicator flags, 48 bits
   * RFC7798: "Specify additional restrictions on the bitstream"
   */
  general_constraint_indicator_flags: number[];

  /** 
   * Level indicator (30 means Level 3.0)
   * RFC7798: "Specifies the level to which the bitstream conforms"
   */
  general_level_idc: number;

  /** 
   * Sub-layer profile presence flags
   * RFC7798: "Specifies whether profile information is present for each sub-layer"
   */
  sub_layer_profile_present_flag?: boolean[];

  /** 
   * Sub-layer level presence flags
   * RFC7798: "Specifies whether level information is present for each sub-layer"
   */
  sub_layer_level_present_flag?: boolean[];

  /** 
   * Sub-layer profile space
   * RFC7798: "Specifies the context for the interpretation of sub_layer_profile_idc"
   */
  sub_layer_profile_space?: number[];

  /** 
   * Sub-layer tier flags
   * RFC7798: "Specifies the tier context for the interpretation of sub_layer_level_idc"
   */
  sub_layer_tier_flag?: boolean[];

  /** 
   * Sub-layer profile indicators
   * RFC7798: "Specifies the profile to which each sub-layer conforms"
   */
  sub_layer_profile_idc?: number[];

  /** 
   * Sub-layer level indicators
   * RFC7798: "Specifies the level to which each sub-layer conforms"
   */
  sub_layer_level_idc?: number[];
}

// H.265 VPS Information Interface
export interface H265VPSInfo {
  /** 
   * Video parameter set ID (0-15)
   * RFC7798: "Identifies the VPS for reference by other syntax elements"
   */
  vps_video_parameter_set_id: number;

  /** 
   * Base layer internal flag
   * RFC7798: "Specifies whether the base layer is an internal layer"
   */
  vps_base_layer_internal_flag: boolean;

  /** 
   * Base layer available flag
   * RFC7798: "Specifies whether the base layer is available for reference"
   */
  vps_base_layer_available_flag: boolean;

  /** 
   * Maximum number of layers minus 1
   * RFC7798: "Specifies the maximum allowed number of layers in each CVS"
   */
  vps_max_layers_minus1: number;

  /** 
   * Maximum number of temporal sub-layers minus 1
   * RFC7798: "Specifies the maximum number of temporal sub-layers"
   */
  vps_max_sub_layers_minus1: number;

  /** 
   * Temporal ID nesting flag
   * RFC7798: "Specifies whether inter prediction is additionally restricted"
   */
  vps_temporal_id_nesting_flag: boolean;

  /** 
   * Reserved 16 bits that must be 0xFFFF
   * RFC7798: "Shall be equal to 0xFFFF"
   */
  vps_reserved_0xffff_16bits: number;

  /** 
   * Profile, tier and level information
   * RFC7798: "Specifies the profile, tier and level information for all layers"
   */
  profile_tier_level: H265ProfileTierLevel;

  /** 
   * Sub-layer ordering info present flag
   * RFC7798: "Specifies whether vps_max_dec_pic_buffering_minus1, vps_max_num_reorder_pics and vps_max_latency_increase_plus1 are present"
   */
  vps_sub_layer_ordering_info_present_flag: boolean;

  /** 
   * Maximum number of decoded pictures minus 1
   * RFC7798: "Specifies the maximum required size of the decoded picture buffer"
   */
  vps_max_dec_pic_buffering_minus1: number[];

  /** 
   * Maximum number of pictures that can be reordered
   * RFC7798: "Specifies the maximum allowed number of pictures that can precede any picture in decoding order"
   */
  vps_max_num_reorder_pics: number[];

  /** 
   * Maximum latency increase plus 1
   * RFC7798: "Used to compute the value of PicLatencyCount"
   */
  vps_max_latency_increase_plus1: number[];

  /** 
   * Maximum layer ID
   * RFC7798: "Specifies the maximum value of nuh_layer_id"
   */
  vps_max_layer_id: number;

  /** 
   * Number of layer sets minus 1
   * RFC7798: "Specifies the number of layer sets that are specified by the VPS"
   */
  vps_num_layer_sets_minus1: number;

  /** 
   * Timing info present flag
   * RFC7798: "Indicates whether vps_num_units_in_tick, vps_time_scale, vps_poc_proportional_to_timing_flag, and vps_num_ticks_poc_diff_one_minus1 are present"
   */
  vps_timing_info_present_flag: boolean;

  /** 
   * Number of time units in a tick
   * RFC7798: "Specifies the number of time units of a clock operating at the frequency vps_time_scale Hz"
   */
  vps_num_units_in_tick?: number;

  /** 
   * Time scale
   * RFC7798: "Specifies the number of time units that pass in one second"
   */
  vps_time_scale?: number;

  /** 
   * POC proportional to timing flag
   * RFC7798: "Indicates whether the picture order count value is proportional to the output time"
   */
  vps_poc_proportional_to_timing_flag?: boolean;

  /** 
   * Number of ticks minus 1 between POC differences of one
   * RFC7798: "Specifies the number of clock ticks corresponding to a difference of picture order count values equal to 1"
   */
  vps_num_ticks_poc_diff_one_minus1?: number;
}

// H.265 SPS Information Interface
export interface H265SPSInfo {
  /** 
   * Video parameter set ID that this SPS refers to
   * RFC7798: "Identifies the VPS referred to by the SPS"
   */
  sps_video_parameter_set_id: number;

  /** 
   * Maximum number of temporal sub-layers minus 1
   * RFC7798: "Specifies the maximum number of temporal sub-layers"
   */
  sps_max_sub_layers_minus1: number;

  /** 
   * Temporal ID nesting flag
   * RFC7798: "Specifies whether inter prediction is additionally restricted"
   */
  sps_temporal_id_nesting_flag: boolean;

  /** 
   * Profile, tier and level information
   * RFC7798: "Specifies the profile, tier and level information for the CVS"
   */
  profile_tier_level: {
    /** 
     * Profile space (0-3)
     * RFC7798: "Specifies the context for the interpretation of general_profile_idc"
     */
    general_profile_space: number;

    /** 
     * Tier flag (0: Main tier, 1: High tier)
     * RFC7798: "Specifies the tier context for the interpretation of general_level_idc"
     */
    general_tier_flag: boolean;

    /** 
     * Profile indicator (0-31)
     * RFC7798: "Specifies the profile to which the CVS conforms"
     */
    general_profile_idc: number;

    /** 
     * Level indicator (30 means Level 3.0)
     * RFC7798: "Specifies the level to which the CVS conforms"
     */
    general_level_idc: number;
  };

  /** 
   * Sequence parameter set ID
   * RFC7798: "Identifies the SPS for reference by other syntax elements"
   */
  sps_seq_parameter_set_id: number;

  /** 
   * Chroma format (0: monochrome, 1: 4:2:0, 2: 4:2:2, 3: 4:4:4)
   * RFC7798: "Specifies the chroma sampling relative to the luma sampling"
   */
  chroma_format_idc: number;

  /** 
   * Picture width in luma samples
   * RFC7798: "Specifies the width of each decoded picture in units of luma samples"
   */
  pic_width_in_luma_samples: number;

  /** 
   * Picture height in luma samples
   * RFC7798: "Specifies the height of each decoded picture in units of luma samples"
   */
  pic_height_in_luma_samples: number;

  /** 
   * Conformance window flag
   * RFC7798: "Indicates whether conformance window parameters are present"
   */
  conformance_window_flag: boolean;

  /** 
   * Number of luma samples to crop from the left edge
   * RFC7798: "Specifies the offset used in calculating the conformance window"
   */
  conf_win_left_offset?: number;

  /** 
   * Number of luma samples to crop from the right edge
   * RFC7798: "Specifies the offset used in calculating the conformance window"
   */
  conf_win_right_offset?: number;

  /** 
   * Number of luma samples to crop from the top edge
   * RFC7798: "Specifies the offset used in calculating the conformance window"
   */
  conf_win_top_offset?: number;

  /** 
   * Number of luma samples to crop from the bottom edge
   * RFC7798: "Specifies the offset used in calculating the conformance window"
   */
  conf_win_bottom_offset?: number;
}

// H.265 PPS Information Interface
export interface H265PPSInfo {
  /** 
   * Picture parameter set ID
   * RFC7798: "Identifies the PPS for reference by other syntax elements"
   */
  pps_pic_parameter_set_id: number;

  /** 
   * Sequence parameter set ID that this PPS refers to
   * RFC7798: "Identifies the SPS that is referenced by the PPS"
   */
  pps_seq_parameter_set_id: number;

  /** 
   * Dependent slice segments enabled flag
   * RFC7798: "Specifies whether dependent slice segments are enabled"
   */
  dependent_slice_segments_enabled_flag: boolean;

  /** 
   * Output flag present flag
   * RFC7798: "Indicates whether pic_output_flag is present in slice headers"
   */
  output_flag_present_flag: boolean;

  /** 
   * Number of extra bits in slice header
   * RFC7798: "Specifies the number of extra slice header bits"
   */
  num_extra_slice_header_bits: number;

  /** 
   * Sign data hiding enabled flag
   * RFC7798: "Specifies whether sign bit hiding is enabled"
   */
  sign_data_hiding_enabled_flag: boolean;

  /** 
   * CABAC initialization present flag
   * RFC7798: "Specifies whether CABAC initialization parameters are present"
   */
  cabac_init_present_flag: boolean;

  /** 
   * Number of reference indexes for list 0 minus 1
   * RFC7798: "Specifies the default value for num_ref_idx_l0_active_minus1"
   */
  num_ref_idx_l0_default_active_minus1: number;

  /** 
   * Number of reference indexes for list 1 minus 1
   * RFC7798: "Specifies the default value for num_ref_idx_l1_active_minus1"
   */
  num_ref_idx_l1_default_active_minus1: number;

  /** 
   * Initial QP minus 26
   * RFC7798: "Specifies the initial value minus 26 of SliceQpY"
   */
  init_qp_minus26: number;

  /** 
   * Constrained intra prediction flag
   * RFC7798: "Specifies whether constrained intra prediction is enabled"
   */
  constrained_intra_pred_flag: boolean;

  /** 
   * Transform skip enabled flag
   * RFC7798: "Specifies whether transform_skip_flag may be present"
   */
  transform_skip_enabled_flag: boolean;

  /** 
   * CU QP delta enabled flag
   * RFC7798: "Specifies whether cu_qp_delta_abs may be present"
   */
  cu_qp_delta_enabled_flag: boolean;

  /** 
   * Difference of CU QP delta depths
   * RFC7798: "Specifies the difference between the luma CTB size and the minimum luma coding block size of coding units"
   */
  diff_cu_qp_delta_depth?: number;
}

// SEI Message Interface
export interface SEIMessage {
  /** 
   * SEI message type
   * RFC7798: "Identifies the type of SEI message"
   */
  payloadType: number;

  /** 
   * Size of SEI message in bytes
   * RFC7798: "Specifies the size of the SEI message payload in bytes"
   */
  payloadSize: number;

  /** 
   * Textual description of SEI message type
   * Based on the mapping defined in RFC7798
   */
  payloadTypeName: string;

  /** 
   * Specific content of the SEI message
   * Structure depends on the payloadType
   */
  payload: any;
}

// SEI Message Type Enumeration
export enum SEIPayloadType {
  // Common SEI messages for H.264 and H.265
  /** Buffering period */
  BUFFERING_PERIOD = 0,
  /** Picture timing */
  PICTURE_TIMING = 1,
  /** User data registered by ITU-T Rec. T.35 */
  USER_DATA_REGISTERED_ITU_T_T35 = 4,
  /** User data unregistered */
  USER_DATA_UNREGISTERED = 5,
  /** Recovery point */
  RECOVERY_POINT = 6,
  /** Scene information */
  SCENE_INFO = 9,
  /** Full-frame snapshot */
  FULL_FRAME_SNAPSHOT = 15,
  /** Progressive refinement segment start */
  PROGRESSIVE_REFINEMENT_SEGMENT_START = 16,
  /** Progressive refinement segment end */
  PROGRESSIVE_REFINEMENT_SEGMENT_END = 17,
  /** Film grain characteristics */
  FILM_GRAIN_CHARACTERISTICS = 19,
  /** Post-filter hint */
  POST_FILTER_HINT = 22,
  /** Tone mapping information */
  TONE_MAPPING_INFO = 23,
  /** Frame packing arrangement */
  FRAME_PACKING_ARRANGEMENT = 45,
  /** Display orientation */
  DISPLAY_ORIENTATION = 47,
  
  // HEVC specific SEI messages
  /** Active parameter sets */
  ACTIVE_PARAMETER_SETS = 129,
  /** Decoding unit information */
  DECODING_UNIT_INFO = 130,
  /** Temporal sub-layer zero index */
  TEMPORAL_SUB_LAYER_ZERO_IDX = 131,
  /** Decoded picture hash */
  DECODED_PICTURE_HASH = 132,
  /** Scalable nesting */
  SCALABLE_NESTING = 133,
  /** Region refresh information */
  REGION_REFRESH_INFO = 134,
  /** No display */
  NO_DISPLAY = 135,
  /** Time code */
  TIME_CODE = 136,
  /** Mastering display colour volume */
  MASTERING_DISPLAY_COLOUR_VOLUME = 137,
  /** Segmented rectangular frame packing arrangement */
  SEGMENTED_RECT_FRAME_PACKING_ARRANGEMENT = 138,
  /** Temporal motion constrained tile sets */
  TEMPORAL_MOTION_CONSTRAINED_TILE_SETS = 139,
  /** Chroma resampling filter hint */
  CHROMA_RESAMPLING_FILTER_HINT = 140,
  /** Knee function information */
  KNEE_FUNCTION_INFO = 141,
  /** Colour remapping information */
  COLOUR_REMAPPING_INFO = 142,
  /** Deinterlaced field identification */
  DEINTERLACED_FIELD_IDENTIFICATION = 143,
  /** Content light level information */
  CONTENT_LIGHT_LEVEL_INFO = 144,
  /** Dependent RAP indication */
  DEPENDENT_RAP_INDICATION = 145,
  /** Alternative transfer characteristics */
  ALTERNATIVE_TRANSFER_CHARACTERISTICS = 147,
  /** Ambient viewing environment */
  AMBIENT_VIEWING_ENVIRONMENT = 148
}

// Import NALU Descriptions
import { H264_TYPE_DESCRIPTIONS, H264_FIELD_DESCRIPTIONS } from './h264Descriptions';
import { H265_TYPE_DESCRIPTIONS, H265_FIELD_DESCRIPTIONS } from './h265Descriptions';

// NALU Type Mapping
export const H264_TYPES = H264_TYPE_DESCRIPTIONS;
export const H265_TYPES = H265_TYPE_DESCRIPTIONS;

// Export Type Descriptions for Other Modules
export { H264_TYPE_DESCRIPTIONS, H264_FIELD_DESCRIPTIONS };
export { H265_TYPE_DESCRIPTIONS, H265_FIELD_DESCRIPTIONS };