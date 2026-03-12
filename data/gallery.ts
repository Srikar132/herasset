/**
 * gallery.ts
 * ──────────
 * Single source of truth for all gallery media.
 *
 * RULES:
 *  - Images:  rowSpan 2 (minimum — always visible)
 *  - Videos:  rowSpan 3–4 (prominent & playable)
 *  - Keep total column-weight per row ≤ 3
 *  - Alternate [2+1], [1+2], [1+1+1] patterns for bento rhythm
 *
 * FIXES APPLIED (zero grid holes):
 *  1. mem-9  moved before mem-14  (fills row-10 col-2 hole)
 *  2. mem-16 rowSpan 2 → 3        (fills row-16 col-2 hole)
 *  3. mem-26 moved before mem-20  (fills row-20 col-2 + row-22 col-1 holes)
 *  4. mem-32 moved before mem-30/31, rowSpan 3 → 4  (fills rows 31-33 col-3 holes)
 */

export type MediaType = "image" | "video";

export interface GalleryItem {
  id: string;
  src: string;
  poster?: string;
  type: MediaType;
  caption?: string;
  colSpan: 1 | 2 | 3 | 4;
  rowSpan: 1 | 2 | 3 | 4;
  objectPosition?: string;
}

export const GALLERY: GalleryItem[] = [
  // ── Row 1  [2 + 1] : hero video + portrait ──
  {
    id: "mem-1",
    src: "https://res.cloudinary.com/diyxlznar/video/upload/v1773299713/mahi-vedio-3_pkrc9c.mp4",
    type: "video",
    poster: "https://res.cloudinary.com/diyxlznar/video/upload/so_0/v1773299713/mahi-vedio-3_pkrc9c.jpg",
    caption: "A moment to remember 🌸",
    colSpan: 2,
    rowSpan: 3,
    objectPosition: "center",
  },
  {
    id: "mem-2",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303791/mahi-image-7_scrfol.jpg",
    caption: "Side by side 🤍",
    type: "image",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },

  // ── (col 3 staggers under mem-2) ──
  {
    id: "mem-3",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303793/mahi-image-2_rvh3yk.jpg",
    type: "image",
    caption: "Pure joy ✨",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },

  // ── Row 2  [1 + 1 + 1] : video + two images ──
  {
    id: "mem-4",
    src: "https://res.cloudinary.com/diyxlznar/video/upload/v1773299714/mahi-vedio-2_msgy2e.mp4",
    poster: "https://res.cloudinary.com/diyxlznar/video/upload/so_0/v1773299714/mahi-vedio-2_msgy2e.jpg",
    type: "video",
    caption: "Kora Kora Kopam 🎶",
    colSpan: 1,
    rowSpan: 3,
  },
  {
    id: "mem-5",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303793/mahi-image-3_ra8mdp.jpg",
    type: "image",
    caption: "Golden glow 🌟",
    colSpan: 1,
    rowSpan: 3,
    objectPosition: "center",
  },
  {
    id: "mem-7",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303793/mahi-image-4_ne2qqh.jpg",
    type: "image",
    caption: "Forever in frame 📸",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },

  // ── Row 3  [2 + 1] : wide video + portrait ──
  {
    id: "mem-6",
    src: "https://res.cloudinary.com/diyxlznar/video/upload/v1773299712/mahi-vedio-7_zotvqf.mp4",
    type: "video",
    caption: "The first touch 🌸",
    poster: "https://res.cloudinary.com/diyxlznar/video/upload/so_0/v1773299712/mahi-vedio-7_zotvqf.jpg",
    colSpan: 2,
    rowSpan: 3,
    objectPosition: "50% 60%",
  },
  {
    id: "mem-8",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303792/mahi-image-5_lyjpng.jpg",
    type: "image",
    caption: "Laughter 💛",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "top"
  },

  // ── (col 3 stagger) ──
  {
    id: "mem-13",

    type: "image",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303793/mahi-image-1_hnilgu.jpg",
    caption: "The smile that started it all ✨",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },

  // ── Row 4  [2 + 1] : big video + portrait ──
  // FIX 1: mem-9 moved before mem-14 — fills the row-10 col-2 hole
  {
    id: "mem-9",
    src: "https://res.cloudinary.com/diyxlznar/video/upload/v1773299713/mahi-vedio-1_ytojip.mp4",
    poster: "https://res.cloudinary.com/diyxlznar/video/upload/so_0/v1773299713/mahi-vedio-1_ytojip.jpg",
    type: "video",
    caption: "Unforgettable 🎥",
    colSpan: 2,
    rowSpan: 4,
  },
  {
    id: "mem-14",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303791/mahi-image-9_mlsaaq.jpg",
    type: "image",
    caption: "Eyes that speak 💫",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "top",
  },

  // ── (col 3 stagger) ──
  {
    id: "mem-15",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303798/mahi-image-10_mtjxee.jpg",
    type: "image",
    caption: "Timeless 🕊️",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },

  // ── Row 5  [1 + 1 + 1] : video + two images ──
  {
    id: "mem-10",
    src: "https://res.cloudinary.com/diyxlznar/video/upload/v1773299711/mahi-vedio-8_f0ypnh.mp4",
    type: "video",
    caption: "Funny moments 😂",
    poster: "https://res.cloudinary.com/diyxlznar/video/upload/so_0/v1773299711/mahi-vedio-8_f0ypnh.jpg",
    colSpan: 1,
    rowSpan: 3,
    objectPosition: "top",
  },
  // FIX 2: mem-16 rowSpan 2 → 3 — fills the row-16 col-2 hole
  {
    id: "mem-16",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303792/mahi-image-11_nxfarh.jpg",
    type: "image",
    caption: "Warmth 🧡",
    colSpan: 1,
    rowSpan: 3, // was 2
    objectPosition: "top",
  },
  {
    id: "mem-17",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303789/mahi-image-14_jfnyhp.jpg",
    type: "image",
    caption: "Our little world 🌍",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "top",
  },

  // ── Row 6  [2 + 1] : wide video + portrait ──
  {
    id: "mem-11",
    src: "https://res.cloudinary.com/diyxlznar/video/upload/v1773299712/mahi-dedio-5_fivkqc.mp4",
    type: "video",
    caption: "Cherished moments 💖",
    poster: "https://res.cloudinary.com/diyxlznar/video/upload/so_0/v1773299712/mahi-dedio-5_fivkqc.jpg",
    colSpan: 2,
    rowSpan: 3,
    objectPosition: "top",
  },
  {
    id: "mem-18",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303788/mahi-image-23_mvi5ak.jpg",
    caption: "Holding on ❤️",

    type: "image",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },

  // ── (col 3 stagger) ──
  {
    id: "mem-19",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303789/mahi-image-16_lt2aur.jpg",
    type: "image",
    caption: "",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },

  // ── Row 7  [2 + 1] : wide image + portrait ──
  // FIX 3: mem-26 moved before mem-20 — fills row-20 col-2 + row-22 col-1 holes
  {
    id: "mem-26",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303789/mahi-image-15_liyhb7.jpg",

    type: "image",
    caption: "Candid 📷",

    colSpan: 2,
    rowSpan: 2,
    objectPosition: "top",
  },
  {
    id: "mem-20",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303789/mahi-image-17_agml7k.jpg",
    type: "image",
    caption: "That look 💕",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "top",
  },

  // ── Row 8  [2 + 1] : wide video + portrait ──
  {
    id: "mem-21",
    src: "https://res.cloudinary.com/diyxlznar/video/upload/v1773299712/mahi-vedio-6_ait5rm.mp4",
    type: "video",
    caption: "Our first Beach Moment 🌊",
    poster: "https://res.cloudinary.com/diyxlznar/video/upload/so_0/v1773299712/mahi-vedio-6_ait5rm.jpg",
    colSpan: 2,
    rowSpan: 3,
    objectPosition: "center",
  },
  {
    id: "mem-22",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303789/mahi-image-18_wukult.jpg",
    type: "image",
    caption: "Dreamy 🌙",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },

  // ── (col 3 stagger) ──
  {
    id: "mem-23",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303788/mahi-image-19_ywrjb5.jpg",
    type: "image",
    caption: "",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },

  // ── Row 9  [1 + 1 + 1] : three equal images ──
  {
    id: "mem-24",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303788/mahi-image-20_ancocf.jpg",
    type: "image",
    caption: "Giggles 😄",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "top",
  },
  {
    id: "mem-25",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303788/mahi-image-22_uamuzg.jpg",
    type: "image",
    caption: "Always together 💞",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },
  {
    id: "mem-27",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303787/mahi-image-24_iyxitd.jpg",
    type: "image",
    caption: "",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "top",
  },

  // ── Row 10  [2 + 1] : wide image + portrait ──
  {
    id: "mem-28",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303789/mahi-image-25_hkj8wl.jpg",
    type: "image",
    caption: "Sun-kissed 🌤️",
    colSpan: 2,
    rowSpan: 2,
    objectPosition: "top",
  },
  {
    id: "mem-29",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303787/mahi-image-26_rkonph.jpg",
    type: "image",
    caption: "Both are cute",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "top",
  },

  // ── Row 11  [1 + 2] : portrait + wide video ──
  // FIX 4: mem-32 moved before mem-30/mem-31, rowSpan 3 → 4 — fills rows 31-33 col-3 holes
  {
    id: "mem-30",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303787/mahi-image-27_hthisa.jpg",
    type: "image",
    caption: "My favourite 💜",
    colSpan: 1,
    rowSpan: 2,
    objectPosition: "center",
  },
  {
    id: "mem-32",
    src: "https://res.cloudinary.com/diyxlznar/video/upload/v1773303792/mahi-image-13_tpzt1e.mp4",
    type: "video",
    caption: "Relive the magic 🎬",
    poster: "https://res.cloudinary.com/diyxlznar/video/upload/so_0/v1773303792/mahi-image-13_tpzt1e.jpg",
    colSpan: 1,
    rowSpan: 4, // was 3
    objectPosition: "center",
  },

  // ── (col 1 stagger) ──
  {
    id: "mem-31",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303787/mahi-image-28_mt6sjl.jpg",
    type: "image",
    caption: "Peaceful 🕊️",
    colSpan: 2,
    rowSpan: 2,
    objectPosition: "center",
  },

  // ── Row 12  [2 + 1] : final wide image ──
  {
    id: "mem-33",
    src: "https://res.cloudinary.com/diyxlznar/image/upload/v1773303787/mahi-image-29_qkbqsd.jpg",
    type: "image",
    caption: "Until forever 💗",
    colSpan: 3,
    rowSpan: 4,
    objectPosition: "top",
  },
];