// One transparent source atlas; frames are measured around each isolated sprite.
// Pixel-art rendering clips the source in the browser without resaving or stretching it.
export const PROP_ATLAS={src:'maps/props/props-atlas-v2.png',width:1448,height:1086} as const;
export const PROP_ART_FRAMES={
  "table": [
    22,
    80,
    351,
    259
  ],
  "chair": [
    449,
    35,
    188,
    313
  ],
  "rug": [
    706,
    71,
    401,
    263
  ],
  "plant": [
    1153,
    52,
    265,
    293
  ],
  "barrel": [
    60,
    373,
    246,
    323
  ],
  "crate": [
    403,
    392,
    259,
    291
  ],
  "flowers": [
    700,
    435,
    344,
    235
  ],
  "bench": [
    1076,
    432,
    355,
    238
  ],
  "well": [
    24,
    714,
    322,
    351
  ],
  "stove": [
    440,
    699,
    208,
    357
  ],
  "books": [
    724,
    760,
    308,
    283
  ],
  "potions": [
    1089,
    749,
    340,
    289
  ]
} as const;
export type PropArtName=keyof typeof PROP_ART_FRAMES;
