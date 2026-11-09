export const DISPLAY = {
  WIDTH: 512,
  HEIGHT: 384,
  TILE_SIZE: 16,
  COLS: 32,
  ROWS: 24,
  BACKGROUND_COLOR: '#0d0f18'
} as const;

export const PHYSICS = {
  FIXED_DT_MS: 1000 / 60, // 16.6667ms (60Hz fixed step)
  FIXED_DT_SEC: 1 / 60,
  MAX_SUBSTEPS: 5,
  GRAVITY: 820,
  MAX_FALL_SPEED: 480
} as const;

export const PLAYER_CONSTANTS = {
  WIDTH: 12,
  HEIGHT: 14,
  SPRITE_SIZE: 16,

  // Đi bộ trên mặt đất
  WALK_SPEED: 72,
  WALK_FRAME_MS: 85,
  WALK_DUST_INTERVAL_MS: 170,

  // Cơ chế nạp lực và nhảy (giữ đầy thanh lực, chỉ nhảy khi nhả phím)
  MAX_CHARGE_MS: 650,
  MIN_CHARGE_MS: 45,
  JUMP_VY_MIN: -165,
  JUMP_VY_MAX: -438,
  JUMP_VX_MIN: 98,
  JUMP_VX_MAX: 182,

  // Phản xạ va tường & trần
  WALL_BOUNCE_FACTOR: 0.5,
  BOUNCY_WALL_FACTOR: 0.92,
  BOUNCY_FLOOR_VY: -365,
  MIN_BOUNCE_VX: 38,
  CEILING_DAMPING: 0.0,

  // Rơi từ độ cao lớn & bẹp (splat)
  HARD_FALL_SPEED_THRESHOLD: 355,
  HARD_FALL_SPLAT_MS: 480,
  NORMAL_LAND_RECOVERY_MS: 55,
  HIT_STOP_MS: 60,

  // Tương tác bề mặt đặc biệt (Băng, Gió, Gai/Nước)
  GROUND_DECEL: 1150,
  GROUND_ACCEL: 950,
  ICE_DECEL: 58,
  ICE_ACCEL: 220,
  ICE_MAX_SLIDE_SPEED: 165,
  WIND_ACCEL: 215,
  WIND_MAX_BONUS_VX: 145,
  HAZARD_RESPAWN_FREEZE_MS: 220,

  // Khối sụp đổ (crumble): đủ thời gian nạp đầy lực rồi mới vỡ
  CRUMBLE_DELAY_MS: 1100,
  CRUMBLE_RESPAWN_MS: 2600
} as const;

export const CAMERA_CONSTANTS = {
  SNAP_DURATION_MS: 150,
  SHAKE_HARD_FALL_DURATION_MS: 180,
  SHAKE_HARD_FALL_INTENSITY: 0.012
} as const;
