import { APP_CONFIG } from '../config';
import {
  computeCanonicalSeedCode,
  computeDifficultyMeta,
  generateProceduralLevel
} from '../data/generator/RandomLevelGenerator';
import { hashString } from '../data/generator/rng';
import { LevelData, WorldMeta } from '../data/levelTypes';
import { validateLevelData } from '../data/levelValidator';
import { LocalStorageSaveService } from './SaveService';

export interface LevelRepository {
  listWorlds(): Promise<WorldMeta[]>;
  getLevel(id: string): Promise<LevelData>;
}

const WORLDS_CATALOG: readonly WorldMeta[] = [
  // ==================== 1. CỔ NGUYÊN (3 Map Gốc) ====================
  {
    id: 'forest-01',
    name: '1. Rừng Thông Cổ Thụ',
    theme: 'forest',
    file: 'forest-01.json',
    realm: 'Cổ Nguyên',
    easterEggName: 'Trái Tim Lục Bảo Rừng Già'
  },
  {
    id: 'ice-01',
    name: '2. Hang Băng Vĩnh Cửu',
    theme: 'ice',
    file: 'ice-01.json',
    realm: 'Cổ Nguyên',
    easterEggName: 'Vương Miện Băng Tuyết Cổ Đại'
  },
  {
    id: 'wind-01',
    name: '3. Tháp Gió Phong Vũ',
    theme: 'wind',
    file: 'wind-01.json',
    realm: 'Cổ Nguyên',
    easterEggName: 'La Bàn Tinh Vân Gió Lốc'
  },

  // ==================== 2. MINECRAFT (12 Map) ====================
  {
    id: 'mc-01-overworld',
    name: 'MC 1. Thảo Nguyên & Đảo Cây Sồi',
    theme: 'mc-overworld',
    file: 'mc-01-overworld.json',
    realm: 'Minecraft',
    easterEggName: 'Táo Vàng Phù Phép (Enchanted Golden Apple)'
  },
  {
    id: 'mc-02-lush-caves',
    name: 'MC 2. Hang Động Quả Sáng & Hoa Azalea',
    theme: 'mc-lush',
    file: 'mc-02-lush-caves.json',
    realm: 'Minecraft',
    easterEggName: 'Axolotl Xanh Lam Hiếm (Blue Axolotl Relic)'
  },
  {
    id: 'mc-03-deep-dark',
    name: 'MC 3. Cổ Thành Sculk Âm Vang (Y=-54)',
    theme: 'mc-deepdark',
    file: 'mc-03-deep-dark.json',
    realm: 'Minecraft',
    easterEggName: 'La Bàn Hồi Sinh & Đĩa Nhạc 5 (Echo Shard Relic)'
  },
  {
    id: 'mc-04-frozen-peaks',
    name: 'MC 4. Đỉnh Tuyết Hoàng Hôn & Băng Xanh',
    theme: 'mc-frozen',
    file: 'mc-04-frozen-peaks.json',
    realm: 'Minecraft',
    easterEggName: 'Sừng Dê Núi Băng Giá (Glacial Goat Horn)'
  },
  {
    id: 'mc-05-ocean-monument',
    name: 'MC 5. Đền Đại Dương & Rạn San Hô',
    theme: 'mc-ocean',
    file: 'mc-05-ocean-monument.json',
    realm: 'Minecraft',
    easterEggName: 'Trái Tim Biển Cả & Đinh Ba (Heart of the Sea)'
  },
  {
    id: 'mc-11-cherry-amethyst',
    name: 'MC 6. Đồi Hoa Anh Đào & Hốc Thạch Anh',
    theme: 'mc-cherry',
    file: 'mc-11-cherry-amethyst.json',
    realm: 'Minecraft',
    easterEggName: 'Ống Nhòm Tinh Thể Thạch Anh (Amethyst Spyglass)'
  },
  {
    id: 'mc-12-trial-redstone',
    name: 'MC 7. Hầm Mỏ Đá Đỏ & Điện Thử Thách',
    theme: 'mc-redstone',
    file: 'mc-12-trial-redstone.json',
    realm: 'Minecraft',
    easterEggName: 'Chùy Gió Lõi Nặng (Heavy Core Mace)'
  },
  {
    id: 'mc-06-nether-wastes',
    name: 'MC 8. Pháo Đài Dung Nham & Cầu Gãy',
    theme: 'mc-nether',
    file: 'mc-06-nether-wastes.json',
    realm: 'Minecraft',
    easterEggName: 'Trượng Quỷ Lửa Blaze (Blaze Sovereign Rod)'
  },
  {
    id: 'mc-07-soul-valley',
    name: 'MC 9. Thung Lũng Lửa Linh Hồn & Hóa Thạch',
    theme: 'mc-soul',
    file: 'mc-07-soul-valley.json',
    realm: 'Minecraft',
    easterEggName: 'Ngôi Sao Địa Ngục (Nether Star Beacon)'
  },
  {
    id: 'mc-08-bastion-remnant',
    name: 'MC 10. Phế Tích Hắc Đá Khảm Vàng',
    theme: 'mc-bastion',
    file: 'mc-08-bastion-remnant.json',
    realm: 'Minecraft',
    easterEggName: 'Đĩa Nhạc Pigstep & Phôi Netherite'
  },
  {
    id: 'mc-09-obsidian-pillars',
    name: 'MC 11. Trụ Hắc Diện Thạch & Rồng Đen',
    theme: 'mc-end',
    file: 'mc-09-obsidian-pillars.json',
    realm: 'Minecraft',
    easterEggName: 'Trứng Rồng Ender Tối Thượng (Dragon Egg)'
  },
  {
    id: 'mc-10-end-city',
    name: 'MC 12. Thành Phố Purpur & Chiến Hạm Bay',
    theme: 'mc-endcity',
    file: 'mc-10-end-city.json',
    realm: 'Minecraft',
    easterEggName: 'Đôi Cánh Huyền Thoại (Royal Elytra Wings)'
  },

  // ==================== 3. TERRARIA (5 Map Mới) ====================
  {
    id: 'tr-01-forest-slime',
    name: 'TR 1. Rừng Purity & Vương Quốc Vua Slime',
    theme: 'tr-purity',
    file: 'tr-01-forest-slime.json',
    realm: 'Terraria',
    easterEggName: 'Thanh Gươm Huyền Thoại Zenith (Zenith Blade)'
  },
  {
    id: 'tr-02-corruption-chasm',
    name: 'TR 2. Hẻm Núi Corruption & Đá Ebonstone',
    theme: 'tr-corruption',
    file: 'tr-02-corruption-chasm.json',
    realm: 'Terraria',
    easterEggName: 'Khăn Quàng Sâu Tối Thượng (Worm Scarf Relic)'
  },
  {
    id: 'tr-03-hallow-crystal',
    name: 'TR 3. Thánh Địa Hallow & Động Pha Lê',
    theme: 'tr-hallow',
    file: 'tr-03-hallow-crystal.json',
    realm: 'Terraria',
    easterEggName: 'Trượng Dịch Chuyển Hỗn Mang (Rod of Discord)'
  },
  {
    id: 'tr-04-jungle-temple',
    name: 'TR 4. Đền Thờ Rừng Rậm Lihzahrd',
    theme: 'tr-jungle',
    file: 'tr-04-jungle-temple.json',
    realm: 'Terraria',
    easterEggName: 'Pin Năng Lượng Mặt Trời Golem (Lihzahrd Power Cell)'
  },
  {
    id: 'tr-05-lunar-pillar',
    name: 'TR 5. Trụ Tinh Vân Nebula & Điện Moon Lord',
    theme: 'tr-nebula',
    file: 'tr-05-lunar-pillar.json',
    realm: 'Terraria',
    easterEggName: 'Lăng Kính Cuối Cùng (The Last Prism)'
  },

  // ==================== 4. CELESTE (5 Map Mới) ====================
  {
    id: 'cl-01-forsaken-city',
    name: 'CL 1. Thành Phố Bỏ Hoang (Forsaken City)',
    theme: 'cl-city',
    file: 'cl-01-forsaken-city.json',
    realm: 'Celeste',
    easterEggName: 'Dâu Tây Có Cánh Đầu Tiên (Winged Strawberry)'
  },
  {
    id: 'cl-02-old-site',
    name: 'CL 2. Phế Tích Giấc Mơ (Old Site Dream)',
    theme: 'cl-dream',
    file: 'cl-02-old-site.json',
    realm: 'Celeste',
    easterEggName: 'Băng Cassette Mặt B (B-Side Crystal Tape)'
  },
  {
    id: 'cl-03-celestial-resort',
    name: 'CL 3. Khách Sạn Bóng Ma (Celestial Resort)',
    theme: 'cl-resort',
    file: 'cl-03-celestial-resort.json',
    realm: 'Celeste',
    easterEggName: 'Chìa Khóa Tổng Quản Oshiro (Master Resort Key)'
  },
  {
    id: 'cl-04-golden-ridge',
    name: 'CL 4. Sườn Núi Gió Vàng (Golden Ridge)',
    theme: 'cl-ridge',
    file: 'cl-04-golden-ridge.json',
    realm: 'Celeste',
    easterEggName: 'Lông Vũ Vàng Bay Lượn (Golden Feather)'
  },
  {
    id: 'cl-05-summit-core',
    name: 'CL 5. Đỉnh Celeste & Lõi Băng Lửa (The Summit)',
    theme: 'cl-summit',
    file: 'cl-05-summit-core.json',
    realm: 'Celeste',
    easterEggName: 'Trái Tim Pha Lê & Dâu Tây Mặt Trăng (Moon Berry)'
  },

  // ==================== 5. HOLLOW KNIGHT (5 Map Mới) ====================
  {
    id: 'hk-01-forgotten-crossroads',
    name: 'HK 1. Ngã Tư Lãng Quên (Forgotten Crossroads)',
    theme: 'hk-crossroads',
    file: 'hk-01-forgotten-crossroads.json',
    realm: 'Hollow Knight',
    easterEggName: 'Bùa La Bàn Kiêu Hãnh (Wayward Compass Charm)'
  },
  {
    id: 'hk-02-greenpath',
    name: 'HK 2. Đường Mòn Rêu Xanh (Greenpath)',
    theme: 'hk-greenpath',
    file: 'hk-02-greenpath.json',
    realm: 'Hollow Knight',
    easterEggName: 'Áo Choàng Bướm Đêm Lướt Gió (Mothwing Cloak)'
  },
  {
    id: 'hk-03-crystal-peak',
    name: 'HK 3. Đỉnh Pha Lê Hồng (Crystal Peak)',
    theme: 'hk-crystal',
    file: 'hk-03-crystal-peak.json',
    realm: 'Hollow Knight',
    easterEggName: 'Trái Tim Pha Lê Siêu Tốc (Crystal Heart Core)'
  },
  {
    id: 'hk-04-city-of-tears',
    name: 'HK 4. Thành Phố Nước Mắt (City of Tears)',
    theme: 'hk-tears',
    file: 'hk-04-city-of-tears.json',
    realm: 'Hollow Knight',
    easterEggName: 'Đinh Thuần Khiết Hallownest (Pure Nail Relic)'
  },
  {
    id: 'hk-05-white-palace',
    name: 'HK 5. Cung Điện Trắng (Path of Pain)',
    theme: 'hk-palace',
    file: 'hk-05-white-palace.json',
    realm: 'Hollow Knight',
    easterEggName: 'Linh Hồn Quốc Vương & Trái Tim Hư Không (Kingsoul)'
  },

  // ==================== 6. SUPER MARIO (5 Map Mới) ====================
  {
    id: 'sm-01-mushroom-plains',
    name: 'SM 1. Vương Quốc Nấm & Ống Nước Xanh',
    theme: 'sm-plains',
    file: 'sm-01-mushroom-plains.json',
    realm: 'Super Mario',
    easterEggName: 'Nấm Siêu Cấp 1-UP Hoàng Kim (Golden 1-UP Mushroom)'
  },
  {
    id: 'sm-02-underground-pipes',
    name: 'SM 2. Mê Cung Ống Ngầm (World 1-2 Warp)',
    theme: 'sm-underground',
    file: 'sm-02-underground-pipes.json',
    realm: 'Super Mario',
    easterEggName: 'Ống Nước Dịch Chuyển Bí Mật (Warp Zone Whistle)'
  },
  {
    id: 'sm-03-athletic-sky',
    name: 'SM 3. Cầu Vồng Mây Trắng (Athletic Sky)',
    theme: 'sm-sky',
    file: 'sm-03-athletic-sky.json',
    realm: 'Super Mario',
    easterEggName: 'Lông Vũ Áo Choàng Bay (Super Cape Feather)'
  },
  {
    id: 'sm-04-starlight-galaxy',
    name: 'SM 4. Đài Quan Sát Ngân Hà (Starlight Galaxy)',
    theme: 'sm-galaxy',
    file: 'sm-04-starlight-galaxy.json',
    realm: 'Super Mario',
    easterEggName: 'Đại Tinh Cầu Năng Lượng (Grand Power Star)'
  },
  {
    id: 'sm-05-bowser-keep',
    name: 'SM 5. Lâu Đài Dung Nham Đại Vương (Bowser Keep)',
    theme: 'sm-castle',
    file: 'sm-05-bowser-keep.json',
    realm: 'Super Mario',
    easterEggName: 'Vương Miện Công Chúa & Ngôi Sao Bất Tử (Super Star)'
  },

  // ==================== 7. SONIC ZONES (5 Map Mới) ====================
  {
    id: 'sn-01-green-hill',
    name: 'SN 1. Đồi Xanh Ca-Rô (Green Hill Zone)',
    theme: 'sn-greenhill',
    file: 'sn-01-green-hill.json',
    realm: 'Sonic Zones',
    easterEggName: 'Ngọc Hỗn Mang Lục Bảo (Green Chaos Emerald)'
  },
  {
    id: 'sn-02-chemical-plant',
    name: 'SN 2. Nhà Máy Hóa Chất (Chemical Plant)',
    theme: 'sn-chemical',
    file: 'sn-02-chemical-plant.json',
    realm: 'Sonic Zones',
    easterEggName: 'Ngọc Hỗn Mang Lam Ngọc (Cyan Chaos Emerald)'
  },
  {
    id: 'sn-03-casino-night',
    name: 'SN 3. Đêm Sòng Bạc Neon (Casino Night Pinball)',
    theme: 'sn-casino',
    file: 'sn-03-casino-night.json',
    realm: 'Sonic Zones',
    easterEggName: 'Vòng Nhẫn Jackpot Triệu Điểm (Giant Gold Ring)'
  },
  {
    id: 'sn-04-ice-cap',
    name: 'SN 4. Đỉnh Tuyết Trượt Ván (Ice Cap Zone)',
    theme: 'sn-icecap',
    file: 'sn-04-ice-cap.json',
    realm: 'Sonic Zones',
    easterEggName: 'Khiên Băng Vĩnh Cửu (Hyper Frost Shield)'
  },
  {
    id: 'sn-05-sky-sanctuary',
    name: 'SN 5. Thánh Địa Trên Mây (Sky Sanctuary)',
    theme: 'sn-sanctuary',
    file: 'sn-05-sky-sanctuary.json',
    realm: 'Sonic Zones',
    easterEggName: 'Đại Ngọc Lục Bảo Tối Thượng (The Master Emerald)'
  },

  // ==================== 8. ELDEN RING (5 Map Mới) ====================
  {
    id: 'er-01-limgrave-erdtree',
    name: 'ER 1. Vùng Đất Limgrave & Cây Hoàng Kim',
    theme: 'er-limgrave',
    file: 'er-01-limgrave-erdtree.json',
    realm: 'Elden Ring',
    easterEggName: 'Nhẫn Chiến Mã Torrent (Spectral Steed Whistle)'
  },
  {
    id: 'er-02-liurnia-academy',
    name: 'ER 2. Học Viện Phép Thuật Raya Lucaria',
    theme: 'er-liurnia',
    file: 'er-02-liurnia-academy.json',
    realm: 'Elden Ring',
    easterEggName: 'Đại Kiếm Trăng Khuyết (Dark Moon Greatsword)'
  },
  {
    id: 'er-03-caelid-wilds',
    name: 'ER 3. Hoang Mạc Đỏ Thẫm Caelid (Radahn Dunes)',
    theme: 'er-caelid',
    file: 'er-03-caelid-wilds.json',
    realm: 'Elden Ring',
    easterEggName: 'Đại Cổ Tự Radahn Cầm Sao (Starscourge Great Rune)'
  },
  {
    id: 'er-04-nokron-eternal',
    name: 'ER 4. Thành Phố Vĩnh Hằng Nokron (Eternal City)',
    theme: 'er-nokron',
    file: 'er-04-nokron-eternal.json',
    realm: 'Elden Ring',
    easterEggName: 'Lưỡi Dao Sát Thần & Giọt Lệ Bạc (Fingerslayer Blade)'
  },
  {
    id: 'er-05-crumbling-azula',
    name: 'ER 5. Đền Bão Tố Farum Azula (Dragon Temple)',
    theme: 'er-azula',
    file: 'er-05-crumbling-azula.json',
    realm: 'Elden Ring',
    easterEggName: 'Chiếc Nhẫn Elden Nguyên Bản (The Elden Ring)'
  },

  // ==================== 9. ZELDA: HYRULE (5 Map Thám Hiểm) ====================
  {
    id: 'zd-01-hyrule-meadow',
    name: 'ZD 1. Cánh Đồng Hyrule & Đền Thời Gian',
    theme: 'zd-meadow',
    file: 'zd-01-hyrule-meadow.json',
    realm: 'Zelda: Hyrule',
    easterEggName: 'Đàn Ocarina Thời Gian (Ocarina of Time)'
  },
  {
    id: 'zd-02-lost-woods',
    name: 'ZD 2. Rừng Lạc Lối & Thánh Địa Korok',
    theme: 'zd-lostwoods',
    file: 'zd-02-lost-woods.json',
    realm: 'Zelda: Hyrule',
    easterEggName: 'Thanh Gươm Diệt Quỷ (Master Sword)'
  },
  {
    id: 'zd-03-death-mountain',
    name: 'ZD 3. Đỉnh Núi Lửa Goron (Death Mountain)',
    theme: 'zd-deathmtn',
    file: 'zd-03-death-mountain.json',
    realm: 'Zelda: Hyrule',
    easterEggName: 'Hồng Ngọc Tâm Lửa (Goron Ruby)'
  },
  {
    id: 'zd-04-zora-domain',
    name: 'ZD 4. Thác Nước Vương Quốc Zora',
    theme: 'zd-zora',
    file: 'zd-04-zora-domain.json',
    realm: 'Zelda: Hyrule',
    easterEggName: 'Lam Ngọc Thủy Thần (Zora Sapphire)'
  },
  {
    id: 'zd-05-sky-islands',
    name: 'ZD 5. Quần Đảo Trời Cổ Đại Zonai',
    theme: 'zd-skyisle',
    file: 'zd-05-sky-islands.json',
    realm: 'Zelda: Hyrule',
    easterEggName: 'Tam Bảo Triforce Hoàng Kim (Sacred Triforce)'
  },

  // ==================== 10. TOMB RAIDER (5 Map Thám Hiểm) ====================
  {
    id: 'tb-01-peru-jungle',
    name: 'TB 1. Thung Lũng Mất Tích & Đền Inca',
    theme: 'tb-jungle',
    file: 'tb-01-peru-jungle.json',
    realm: 'Tomb Raider',
    easterEggName: 'Bánh Răng Vàng Cổ Đại (Peruvian Cog)'
  },
  {
    id: 'tb-02-egypt-pyramid',
    name: 'TB 2. Lăng Mộ Kim Tự Tháp Khamoon',
    theme: 'tb-egypt',
    file: 'tb-02-egypt-pyramid.json',
    realm: 'Tomb Raider',
    easterEggName: 'Con Mắt Horus Bằng Vàng (Eye of Horus)'
  },
  {
    id: 'tb-03-himalaya-monastery',
    name: 'TB 3. Tu Viện Tuyết Barkhang (Tây Tạng)',
    theme: 'tb-himalaya',
    file: 'tb-03-himalaya-monastery.json',
    realm: 'Tomb Raider',
    easterEggName: 'Dao Găm Rồng Cổ (Dagger of Xian)'
  },
  {
    id: 'tb-04-atlantis-ruins',
    name: 'TB 4. Phế Tích Lục Địa Đỏ Atlantis',
    theme: 'tb-atlantis',
    file: 'tb-04-atlantis-ruins.json',
    realm: 'Tomb Raider',
    easterEggName: 'Bùa Cổ Scion Ba Mảnh (Atlantean Scion)'
  },
  {
    id: 'tb-05-yamatai-storm',
    name: 'TB 5. Đỉnh Tháp Bão Đảo Yamatai',
    theme: 'tb-yamatai',
    file: 'tb-05-yamatai-storm.json',
    realm: 'Tomb Raider',
    easterEggName: 'Vương Miện Nữ Hoàng Mặt Trời Himiko'
  },

  // ==================== 11. METROID (5 Map Thám Hiểm) ====================
  {
    id: 'mt-01-crateria-rain',
    name: 'MT 1. Bề Mặt Đá Mưa Bão Crateria',
    theme: 'mt-crateria',
    file: 'mt-01-crateria-rain.json',
    realm: 'Metroid',
    easterEggName: 'Quả Cầu Biến Hình Chozo (Morph Ball Relic)'
  },
  {
    id: 'mt-02-brinstar-depths',
    name: 'MT 2. Rừng Ngầm Sinh Học Brinstar',
    theme: 'mt-brinstar',
    file: 'mt-02-brinstar-depths.json',
    realm: 'Metroid',
    easterEggName: 'Bình Năng Lượng Cổ (Chozo Energy Tank)'
  },
  {
    id: 'mt-03-norfair-magma',
    name: 'MT 3. Lò Nhiệt Hạch Sâu Norfair',
    theme: 'mt-norfair',
    file: 'mt-03-norfair-magma.json',
    realm: 'Metroid',
    easterEggName: 'Giáp Chịu Nhiệt Varia (Varia Suit Core)'
  },
  {
    id: 'mt-04-maridia-aquifer',
    name: 'MT 4. Biển Ngầm Kính Vỡ Maridia',
    theme: 'mt-maridia',
    file: 'mt-04-maridia-aquifer.json',
    realm: 'Metroid',
    easterEggName: 'Giáp Trọng Lực Tím (Gravity Suit Core)'
  },
  {
    id: 'mt-05-tourian-core',
    name: 'MT 5. Trung Tâm Chỉ Huy Sinh Cơ Tourian',
    theme: 'mt-tourian',
    file: 'mt-05-tourian-core.json',
    realm: 'Metroid',
    easterEggName: 'Ấu Trùng Metroid Cuối Cùng (The Baby Metroid)'
  },

  // ==================== 12. SUBNAUTICA (5 Map Thám Hiểm) ====================
  {
    id: 'sb-01-safe-shallows',
    name: 'SB 1. Rạn San Hô Cạn (Safe Shallows)',
    theme: 'sb-shallows',
    file: 'sb-01-safe-shallows.json',
    realm: 'Subnautica',
    easterEggName: 'Máy Dò Sóng Biển Seaglide (Seaglide Blueprint)'
  },
  {
    id: 'sb-02-kelp-forest',
    name: 'SB 2. Rừng Tảo Bẹ Phát Sáng (Kelp Forest)',
    theme: 'sb-kelp',
    file: 'sb-02-kelp-forest.json',
    realm: 'Subnautica',
    easterEggName: 'Trứng Cá Dễ Thương (Cuddlefish Egg)'
  },
  {
    id: 'sb-03-jellyshroom-cave',
    name: 'SB 3. Hang Nấm Tím Sâu (Jellyshroom Cave)',
    theme: 'sb-jellyshroom',
    file: 'sb-03-jellyshroom-cave.json',
    realm: 'Subnautica',
    easterEggName: 'Nhật Ký Căn Cứ Degasi (Degasi Data Box)'
  },
  {
    id: 'sb-04-lost-river',
    name: 'SB 4. Dòng Sông Axit Cổ Sinh (Lost River)',
    theme: 'sb-lostriver',
    file: 'sb-04-lost-river.json',
    realm: 'Subnautica',
    easterEggName: 'Viên Tinh Thể Ion Xanh (Precursor Ion Cube)'
  },
  {
    id: 'sb-05-active-lava',
    name: 'SB 5. Pháo Đài Nhiệt Hải Đáy Biển (Lava Zone)',
    theme: 'sb-lava',
    file: 'sb-05-active-lava.json',
    realm: 'Subnautica',
    easterEggName: 'Enzyme 42 Của Hoàng Đế Biển (Sea Emperor Enzyme)'
  },

  // ==================== 13. SPELUNKY (5 Map Thám Hiểm) ====================
  {
    id: 'sp-01-dwelling-mines',
    name: 'SP 1. Hầm Mỏ Khai Khoáng Cổ (The Dwelling)',
    theme: 'sp-mines',
    file: 'sp-01-dwelling-mines.json',
    realm: 'Spelunky',
    easterEggName: 'Tượng Thần Vàng Bẫy Đá (Golden Idol)'
  },
  {
    id: 'sp-02-lush-jungle',
    name: 'SP 2. Rừng Rậm Gai Độc & Chợ Đen',
    theme: 'sp-jungle',
    file: 'sp-02-lush-jungle.json',
    realm: 'Spelunky',
    easterEggName: 'Con Mắt Udjat Huyền Bí (The Udjat Eye)'
  },
  {
    id: 'sp-03-ice-caverns',
    name: 'SP 3. Hang Băng Tuyết & Tượng Moai',
    theme: 'sp-icecaves',
    file: 'sp-03-ice-caverns.json',
    realm: 'Spelunky',
    easterEggName: 'Vương Miện Hedjet Sáng Chói (The Hedjet)'
  },
  {
    id: 'sp-04-anubis-temple',
    name: 'SP 4. Thành Phố Vàng & Đền Anubis',
    theme: 'sp-temple',
    file: 'sp-04-anubis-temple.json',
    realm: 'Spelunky',
    easterEggName: 'Quyền Trượng Anubis & Sách Tử Thần'
  },
  {
    id: 'sp-05-cosmic-ocean',
    name: 'SP 5. Đại Dương Vũ Trụ Vô Tận (Cosmic Ocean)',
    theme: 'sp-cosmic',
    file: 'sp-05-cosmic-ocean.json',
    realm: 'Spelunky',
    easterEggName: 'Chòm Sao Cân Bằng Vũ Trụ (Celestial Jelly)'
  },

  // ==================== 14. ORI SPIRIT (5 Map Thám Hiểm) ====================
  {
    id: 'or-01-nibel-glade',
    name: 'OR 1. Thung Lũng Linh Hồn Nibel (Sunken Glades)',
    theme: 'or-nibel',
    file: 'or-01-nibel-glade.json',
    realm: 'Ori Spirit',
    easterEggName: 'Quả Cầu Ánh Sáng Sein (Spirit Light of Sein)'
  },
  {
    id: 'or-02-ginso-tree',
    name: 'OR 2. Lõi Đại Thụ Nước Dâng (Ginso Tree)',
    theme: 'or-ginso',
    file: 'or-02-ginso-tree.json',
    realm: 'Ori Spirit',
    easterEggName: 'Trái Tim Mạch Nước Thuần Khiết (Water Vein)'
  },
  {
    id: 'or-03-forlorn-ruins',
    name: 'OR 3. Phế Tích Băng Giá Không Trọng Lực (Forlorn)',
    theme: 'or-forlorn',
    file: 'or-03-forlorn-ruins.json',
    realm: 'Ori Spirit',
    easterEggName: 'Ấn Phong Linh Cổ Đại (Gumon Seal)'
  },
  {
    id: 'or-04-mount-horu',
    name: 'OR 4. Đỉnh Hỏa Sơn Nóng Chảy (Mount Horu)',
    theme: 'or-horu',
    file: 'or-04-mount-horu.json',
    realm: 'Ori Spirit',
    easterEggName: 'Đá Mặt Trời Rực Cháy (The Sunstone)'
  },
  {
    id: 'or-05-willow-end',
    name: 'OR 5. Thánh Địa Liễu Thần (Willow\'s End)',
    theme: 'or-willow',
    file: 'or-05-willow-end.json',
    realm: 'Ori Spirit',
    easterEggName: 'Nhánh Cây Linh Hồn Vĩnh Cửu (Ancestral Light)'
  },
  // ==================== 15. THE WEEKND TOUR (5 Maps) ====================
  {
    id: 'wk-01-blinding-lights',
    name: 'WK 1. Đại Lộ Neon Đỏ (Blinding Lights Stage)',
    theme: 'wk-blinding',
    file: 'wk-01-blinding-lights.json',
    realm: 'The Weeknd Tour',
    easterEggName: 'Kính Râm Đỏ After Hours (Red Suit Shades)'
  },
  {
    id: 'wk-02-starboy-arena',
    name: 'WK 2. Thánh Đường Thập Giá Hồng (Starboy Arena)',
    theme: 'wk-starboy',
    file: 'wk-02-starboy-arena.json',
    realm: 'The Weeknd Tour',
    easterEggName: 'Thập Giá Phát Sáng Starboy (Glowing Neon Cross)'
  },
  {
    id: 'wk-03-after-hours-rooftop',
    name: 'WK 3. Sân Thượng Huyết Nguyệt (After Hours Live)',
    theme: 'wk-afterhours',
    file: 'wk-03-after-hours-rooftop.json',
    realm: 'The Weeknd Tour',
    easterEggName: 'Mặt Nạ Vàng Sân Khấu (GoldenXO Mask)'
  },
  {
    id: 'wk-04-dawn-fm-waves',
    name: 'WK 4. Sóng Phát Thanh 103.5 (Dawn FM Synth Stage)',
    theme: 'wk-dawnfm',
    file: 'wk-04-dawn-fm-waves.json',
    realm: 'The Weeknd Tour',
    easterEggName: 'Máy Phát Thanh 103.5 Dawn FM (Vintage Synth Radio)'
  },
  {
    id: 'wk-05-sofi-stadium',
    name: 'WK 5. Siêu Sân Vận Động Ánh Sáng (SoFi Stadium Tour)',
    theme: 'wk-sofi',
    file: 'wk-05-sofi-stadium.json',
    realm: 'The Weeknd Tour',
    easterEggName: 'Cúp Bạch Kim XO World Tour (XO Platinum Mic)'
  },
  // ==================== 16. MARSBUNN LIVE (5 Maps) ====================
  {
    id: 'mb-01-alone-stage',
    name: 'MB 1. Sân Khấu Kẹo Ngọt Phát Sáng (Alone Stage)',
    theme: 'mb-alone',
    file: 'mb-01-alone-stage.json',
    realm: 'Marsbunn Live',
    easterEggName: 'Mũ Mỉm Cười LED Marsbunn (Glowing Mello Helmet)'
  },
  {
    id: 'mb-02-happier-sky',
    name: 'MB 2. Bầu Trời Pháo Hoa Hoàng Hôn (Happier Sunset)',
    theme: 'mb-happier',
    file: 'mb-02-happier-sky.json',
    realm: 'Marsbunn Live',
    easterEggName: 'Vòng Cổ Cún Vàng Hạnh Phúc (Happier Golden Collar)'
  },
  {
    id: 'mb-03-joytime-bounce',
    name: 'MB 3. Vũ Trường Đệm Nhảy Điện Tử (Joytime Bounce)',
    theme: 'mb-joytime',
    file: 'mb-03-joytime-bounce.json',
    realm: 'Marsbunn Live',
    easterEggName: 'Đĩa Nhạc Kim Cương Joytime (Joytime Vinyl Disc)'
  },
  {
    id: 'mb-04-mellodeath-drop',
    name: 'MB 4. Đấu Trường Sóng Trầm Huỷ Diệt (Bass Drop Arena)',
    theme: 'mb-bass',
    file: 'mb-04-mellodeath-drop.json',
    realm: 'Marsbunn Live',
    easterEggName: 'Loa Siêu Trầm Lõi Tử Thần (Subwoofer Core)'
  },
  {
    id: 'mb-05-ultra-mainstage',
    name: 'MB 5. Đại Nhạc Hội Cầu Vồng (Marsbunn Mainstage)',
    theme: 'mb-ultra',
    file: 'mb-05-ultra-mainstage.json',
    realm: 'Marsbunn Live',
    easterEggName: 'Bàn Mixer Vàng Đại Nhạc Hội (Golden DJ Deck)'
  },
  // ==================== 17. SYNTHWAVE LIVE (5 Maps) ====================
  {
    id: 'sw-01-outrun-highway',
    name: 'SW 1. Cao Tốc Mặt Trời Lưới Điện (Outrun Sunset)',
    theme: 'sw-outrun',
    file: 'sw-01-outrun-highway.json',
    realm: 'Synthwave Live',
    easterEggName: 'Băng Cassette Synthwave 1984 (Chrome Tape 84)'
  },
  {
    id: 'sw-02-cyber-pyramid',
    name: 'SW 2. Kim Tự Tháp Tia Laser (Alive Pyramid Tour)',
    theme: 'sw-pyramid',
    file: 'sw-02-cyber-pyramid.json',
    realm: 'Synthwave Live',
    easterEggName: 'Mũ Robot Mạ Vàng Huyền Thoại (Daft Robot Visor)'
  },
  {
    id: 'sw-03-hologram-idol',
    name: 'SW 3. Sân Khấu Thần Tượng Ảo Ảnh (Hologram Concert)',
    theme: 'sw-holo',
    file: 'sw-03-hologram-idol.json',
    realm: 'Synthwave Live',
    easterEggName: 'Gậy Phát Sáng Ngàn Sao (Holo Lightstick)'
  },
  {
    id: 'sw-04-vinyl-skyline',
    name: 'SW 4. Tầng Không Đĩa Than Xoay (Vinyl Turntable)',
    theme: 'sw-vinyl',
    file: 'sw-04-vinyl-skyline.json',
    realm: 'Synthwave Live',
    easterEggName: 'Kim Đĩa Than Hồng Ngọc (Ruby Stylus Needle)'
  },
  {
    id: 'sw-05-laser-cathedral',
    name: 'SW 5. Thánh Đường Đàn Quang Học (Laser Harp Dome)',
    theme: 'sw-cathedral',
    file: 'sw-05-laser-cathedral.json',
    realm: 'Synthwave Live',
    easterEggName: 'Đàn Synthesizer Cổ Điển (Analog Moog Core)'
  },
  // ==================== 18. EDM FESTIVAL (5 Maps) ====================
  {
    id: 'ed-01-book-of-wisdom',
    name: 'ED 1. Thung Lũng Sách Tri Thức (Tomorrow Stage)',
    theme: 'ed-wisdom',
    file: 'ed-01-book-of-wisdom.json',
    realm: 'EDM Festival',
    easterEggName: 'Trang Sách Giai Điệu Vĩnh Hằng (Hymn of Tomorrow)'
  },
  {
    id: 'ed-02-neon-rose-garden',
    name: 'ED 2. Vườn Hồng Pha Lê Điện Tử (Rose Mainstage)',
    theme: 'ed-rose',
    file: 'ed-02-neon-rose-garden.json',
    realm: 'EDM Festival',
    easterEggName: 'Đóa Hồng Pha Lê Phát Nhạc (Crystal Sonic Rose)'
  },
  {
    id: 'ed-03-kinetic-cathedral',
    name: 'ED 3. Đấu Trường Cánh Bướm Tự Do (Freedom Stage)',
    theme: 'ed-freedom',
    file: 'ed-03-kinetic-cathedral.json',
    realm: 'EDM Festival',
    easterEggName: 'Đôi Cánh Ánh Sáng Kinetic (Kinetic Neon Wings)'
  },
  {
    id: 'ed-04-core-forest-rave',
    name: 'ED 4. Rừng Thiêng Rung Động Sóng Nhạc (Core Stage)',
    theme: 'ed-core',
    file: 'ed-04-core-forest-rave.json',
    realm: 'EDM Festival',
    easterEggName: 'Trái Tim Cộng Hưởng Tần Số (Resonance Heart)'
  },
  {
    id: 'ed-05-firework-encore',
    name: 'ED 5. Đỉnh Cao Pháo Hoa Khép Màn (Festival Finale)',
    theme: 'ed-encore',
    file: 'ed-05-firework-encore.json',
    realm: 'EDM Festival',
    easterEggName: 'Chìa Khóa Vàng Đại Nhạc Hội (Mainstage Master Key)'
  },
  // ==================== 19. ROCK & SYMPHONY (5 Maps) ====================
  {
    id: 'rk-01-thunder-amp',
    name: 'RK 1. Bức Tường Loa Sấm Sét (Thunder Amp Wall)',
    theme: 'rk-amp',
    file: 'rk-01-thunder-amp.json',
    realm: 'Rock & Symphony',
    easterEggName: 'Cây Đàn Guitar Điện Sấm Sét (Thunderbolt Guitar)'
  },
  {
    id: 'rk-02-pyro-arena',
    name: 'RK 2. Đấu Trường Cột Lửa Cuồng Nhiệt (Pyro Rock Stage)',
    theme: 'rk-pyro',
    file: 'rk-02-pyro-arena.json',
    realm: 'Rock & Symphony',
    easterEggName: 'Móng Gảy Lửa Bất Diệt (Pick of Destiny)'
  },
  {
    id: 'rk-03-sky-piano-stair',
    name: 'RK 3. Nấc Thang Dương Cầm Trên Mây (Sky Piano Keys)',
    theme: 'rk-piano',
    file: 'rk-03-sky-piano-stair.json',
    realm: 'Rock & Symphony',
    easterEggName: 'Phím Đàn Ngà Tinh Tú (Starlight Ivory Key)'
  },
  {
    id: 'rk-04-astral-symphony',
    name: 'RK 4. Nhà Hát Giao Hưởng Ngân Hà (Astral Orchestra)',
    theme: 'rk-symphony',
    file: 'rk-04-astral-symphony.json',
    realm: 'Rock & Symphony',
    easterEggName: 'Đũa Chỉ Huy Giao Hưởng Vũ Trụ (Cosmic Baton)'
  },
  {
    id: 'rk-05-grand-encore-100',
    name: 'RK 5. MAP 100: Đỉnh Vinh Quang Liveshow Huyền Thoại',
    theme: 'rk-finale',
    file: 'rk-05-grand-encore-100.json',
    realm: 'Rock & Symphony',
    easterEggName: 'Vương Miện Âm Nhạc Tối Thượng (Crown of 100 Realms)'
  }
];

export class StaticLevelRepository implements LevelRepository {
  private static readonly sharedCache = new Map<string, LevelData>();
  private readonly saveService = new LocalStorageSaveService();

  public static clearCache(): void {
    StaticLevelRepository.sharedCache.clear();
  }

  public async listWorlds(): Promise<WorldMeta[]> {
    const runSeed = this.saveService.getRunSeed() ?? undefined;
    return WORLDS_CATALOG.map((w, idx) => ({
      ...w,
      worldNumber: idx + 1,
      defaultSeed: computeCanonicalSeedCode(idx + 1, w.id, runSeed)
    }));
  }

  public async getLevel(id: string): Promise<LevelData> {
    const runSeed = this.saveService.getRunSeed();
    const cacheKey = `${id}::${runSeed ?? 'ORIGIN'}`;
    const cached = StaticLevelRepository.sharedCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const catalogIdx = WORLDS_CATALOG.findIndex((w) => w.id === id);
    const meta = catalogIdx >= 0 ? WORLDS_CATALOG[catalogIdx] : undefined;
    const worldNumber = catalogIdx >= 0 ? catalogIdx + 1 : 1;

    // Khi người chơi đã Reset Seed để chơi lại từ đầu (hoặc tạo hành trình mới),
    // toàn bộ 100 Thế Giới được kiến tạo lại địa hình & chướng ngại vật nhảy theo Seed mới!
    if (runSeed && meta) {
      const seedCode = computeCanonicalSeedCode(worldNumber, meta.id, runSeed);
      const seededLevel = generateProceduralLevel({
        id: meta.id,
        name: meta.name,
        theme: meta.theme,
        seedInput: seedCode,
        worldNumber,
        totalWorlds: WORLDS_CATALOG.length
      });
      StaticLevelRepository.sharedCache.set(cacheKey, seededLevel);
      return seededLevel;
    }

    const fileName = meta ? meta.file : `${id}.json`;
    const url = `${APP_CONFIG.levelsBasePath}/${fileName}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Không thể tải file màn chơi "${url}" (HTTP ${response.status}).`);
    }

    const rawJson: unknown = await response.json();
    const validation = validateLevelData(rawJson, url);
    if (!validation.valid) {
      throw new Error(
        `Dữ liệu màn chơi "${id}" không hợp lệ:\n${validation.errors.join('\n')}`
      );
    }

    const levelData = rawJson as LevelData;
    if (!levelData.seedState) {
      const seedCode = computeCanonicalSeedCode(worldNumber, levelData.id);
      const diffMeta = computeDifficultyMeta(worldNumber);
      levelData.seedState = {
        seedCode,
        numericSeed: hashString(seedCode),
        worldNumber,
        totalWorlds: WORLDS_CATALOG.length,
        difficultyLabel: diffMeta.label,
        difficultyRating: diffMeta.rating,
        archetypeLabel: 'Kiến Trúc Tháp Cổ',
        obstacleLabels: ['Địa Hình Nhảy Chuẩn Xác']
      };
    }
    StaticLevelRepository.sharedCache.set(cacheKey, levelData);
    return levelData;
  }
}
