const db = require("./db/database");

const items = [
  [
    "iPhone 15",
    79999,
    "https://www.apple.com/newsroom/images/2023/09/apple-offers-more-ways-to-order-the-new-lineups/article/Apple-iPhone-15-lineup-pink_inline.jpg.large.jpg",
  ],
  [
    "MacBook Air",
    114999,
    "https://www.apple.com/v/macbook-air/x/images/meta/macbook_air_mx__ez5y0k5yy7au_og.png",
  ],
  [
    "AirPods Pro",
    24999,
    "https://www.apple.com/v/airpods-pro/q/images/overview/welcome/hero__b0eal3mn03ua_large.jpg",
  ],
  [
    "Apple Watch",
    45999,
    "https://www.apple.com/assets-www/en_IN/watch1/og/watch_og_c64ec6c67.png",
  ],
  [
    "iPad",
    49999,
    "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-finish-select-202503-silver-wificell_FMT_WHH?wid=1280&hei=720&fmt=p-jpg&qlt=80&.v=aHYyeWZ6TVBzTWw5WlZ2bFJCZno2aG1NVnhJaVErcFhXcDJFUzZhbVJBcm1HUDgrNVdYQTFZblVSOCsvL3EwcTN0bWR6ME9RYmIrVG9PSXZFalM2aHdBb0pjWml6bllCL0Y5a1RKc2gxZjkrVEE4bmZmSnhGRWk4V2UvdmY1bmFaRlZHeU50WXppNnFDV21pbFVCRkl3&traceId=1",
  ],
];

items.forEach((i) => {
  db.run("INSERT INTO items (name,price,image_url,status) VALUES (?,?,?,?)", [
    ...i,
    "ACTIVE",
  ]);
});

console.log("Seeded 5 items");
