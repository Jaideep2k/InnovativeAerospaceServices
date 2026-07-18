/**
 * Wire catalogue transcribed verbatim from the supplied
 * IAS-WWW-LASER-WIRE-MARKING-ORDER-TEMPLATE.xlsx (sheet "IAS LASER WIRE ORDER FORM").
 * Order-entry columns in the original: WIRE CODE · LENGTH (") · WIRE TYPE · QTY.
 * Do not edit terminology without client confirmation.
 */

export type WireEntry = {
  code: string;
  description: string;
  milSpec?: string;
};

export type WireCategory = {
  category: string;
  note?: string;
  wires: WireEntry[];
};

export const HEAVY_GAUGE_NOTE =
  "CABLE TYES BELOW ARE HEATSHRINK TYPE LABELLED WITH CLEAR PROTECTIVE LAYER (MAX 6 FT + ENDS)";

export const wireCatalog: WireCategory[] = [
  {
    category: "SINGLE CONDUCTOR WIRE",
    wires: [
      { code: "6", description: "6 AWG", milSpec: "M22759/41-6-9" },
      { code: "8", description: "8 AWG", milSpec: "M22759/41-8-9" },
      { code: "10", description: "10 AWG", milSpec: "M22759/41-10-9" },
      { code: "12", description: "12 AWG", milSpec: "M22759/41-12-9" },
      { code: "14", description: "14 AWG", milSpec: "M22759/41-14-9" },
      { code: "16", description: "16 AWG", milSpec: "M22759/41-16-9" },
      { code: "18", description: "18 AWG", milSpec: "M22759/41-18-9" },
      { code: "20", description: "20 AWG", milSpec: "M22759/41-20-9" },
      { code: "22", description: "22 AWG", milSpec: "M22759/41-22-9" },
      { code: "24", description: "24 AWG", milSpec: "M22759/41-24-9" },
    ],
  },
  {
    category: "16 AWG - SHIELDED WIRE",
    wires: [
      { code: "1SH16", description: "1 CONDUCTOR SHIELDED / 16 AWG", milSpec: "M27500-16SP1S23" },
      { code: "2SH16", description: "2 CONDUCTOR SHIELDED / 16 AWG", milSpec: "M27500-16SP2S23" },
      { code: "3SH16", description: "3 CONDUCTOR SHIELDED / 16 AWG", milSpec: "M27500-16SP3S23" },
      { code: "4SH16", description: "4 CONDUCTOR SHIELDED / 16 AWG", milSpec: "M27500-16SP4S23" },
      { code: "5SH16", description: "5 CONDUCTOR SHIELDED / 16 AWG", milSpec: "M27500-16SP5S23" },
    ],
  },
  {
    category: "18 AWG - SHIELDED WIRE",
    wires: [
      { code: "1SH18", description: "1 CONDUCTOR SHIELDED / 18 AWG", milSpec: "M27500-18SP1S23" },
      { code: "2SH18", description: "2 CONDUCTOR SHIELDED / 18 AWG", milSpec: "M27500-18SP2S23" },
      { code: "3SH18", description: "3 CONDUCTOR SHIELDED / 18 AWG", milSpec: "M27500-18SP3S23" },
      { code: "4SH18", description: "4 CONDUCTOR SHIELDED / 18 AWG", milSpec: "M27500-18SP4S23" },
      { code: "5SH18", description: "5 CONDUCTOR SHIELDED / 18 AWG", milSpec: "M27500-18SP5S23" },
    ],
  },
  {
    category: "20 AWG - SHIELDED WIRE",
    wires: [
      { code: "1SH20", description: "1 CONDUCTOR SHIELDED / 20 AWG", milSpec: "M27500-20SP1S23" },
      { code: "2SH20", description: "2 CONDUCTOR SHIELDED / 20 AWG", milSpec: "M27500-20SP2S23" },
      { code: "3SH20", description: "3 CONDUCTOR SHIELDED / 20 AWG", milSpec: "M27500-20SP3S23" },
      { code: "4SH20", description: "4 CONDUCTOR SHIELDED / 20 AWG", milSpec: "M27500-20SP4S23" },
      { code: "5SH20", description: "5 CONDUCTOR SHIELDED / 20 AWG", milSpec: "M27500-20SP5S23" },
    ],
  },
  {
    category: "22 AWG - SHIELDED WIRE",
    wires: [
      { code: "1SH22", description: "1 CONDUCTOR SHIELDED / 22 AWG", milSpec: "M27500-22SP1S23" },
      { code: "2SH22", description: "2 CONDUCTOR SHIELDED / 22 AWG", milSpec: "M27500-22SP2S23" },
      { code: "3SH22", description: "3 CONDUCTOR SHIELDED / 22 AWG", milSpec: "M27500-22SP3S23" },
      { code: "4SH22", description: "4 CONDUCTOR SHIELDED / 22 AWG", milSpec: "M27500-22SP4S23" },
      { code: "5SH22", description: "5 CONDUCTOR SHIELDED / 22 AWG", milSpec: "M27500-22SP5S23" },
    ],
  },
  {
    category: "24 AWG - SHIELDED WIRE",
    wires: [
      { code: "1SH24", description: "1 CONDUCTOR SHIELDED / 24 AWG", milSpec: "M27500-24SP1S23" },
      { code: "2SH24", description: "2 CONDUCTOR SHIELDED / 24 AWG", milSpec: "M27500-24SP2S23" },
      { code: "3SH24", description: "3 CONDUCTOR SHIELDED / 24 AWG", milSpec: "M27500-24SP3S23" },
      { code: "4SH24", description: "4 CONDUCTOR SHIELDED / 24 AWG", milSpec: "M27500-24SP4S23" },
      { code: "5SH24", description: "5 CONDUCTOR SHIELDED / 24 AWG", milSpec: "M27500-24SP5S23" },
    ],
  },
  {
    category: "SPECIALITY CABLE",
    wires: [
      { code: "AL / CH (20)", description: "ALUMEL CHROMEL WHT / GRN", milSpec: "HIGH TEMP THERMOCOUPLE" },
    ],
  },
  {
    category: "HEAVY GAUGE (NORMAL TEMPERATURE RATED)",
    note: HEAVY_GAUGE_NOTE,
    wires: [
      { code: "2/0", description: "HEAVY GAUGE / 2 OTT (AWG)", milSpec: "M22759/34 (STOCK DEP)" },
      { code: "1/0", description: "HEAVY GAUGE / 1 OTT (AWG)", milSpec: "M22759/34 (STOCK DEP)" },
      { code: "1", description: "HEAVY GAUGE / 1 AWG", milSpec: "M22759/34 (STOCK DEP)" },
      { code: "2", description: "HEAVY GAUGE / 2 AWG", milSpec: "M22759/34 (STOCK DEP)" },
      { code: "4", description: "HEAVY GAUGE / 4 AWG", milSpec: "M22759/34 (STOCK DEP)" },
    ],
  },
  {
    category: "HEAVY GAUGE (HIGH TEMPERATURE RATED - 260 DEG CELCIUS)",
    note: HEAVY_GAUGE_NOTE,
    wires: [
      { code: "2/0 H", description: "HEAVY GAUGE / 2 OTT (AWG)", milSpec: "M22759/2" },
      { code: "1/0 H", description: "HEAVY GAUGE / 1 OTT (AWG)", milSpec: "M22759/2" },
      { code: "1 H", description: "HEAVY GAUGE / 1 AWG", milSpec: "M22759/2" },
      { code: "2 H", description: "HEAVY GAUGE / 2 AWG", milSpec: "M22759/2" },
      { code: "4 H", description: "HEAVY GAUGE / 4 AWG", milSpec: "M22759/2" },
    ],
  },
  {
    category: "COAXIAL CABLE",
    wires: [
      { code: "RG316", description: "COAXIAL CABLE 50 OHM" },
      { code: "RG400", description: "COAXIAL CABLE 50 OHM" },
      { code: "PIC S33141", description: "LOW LOSS COAXIAL CABLE 50 OHM" },
    ],
  },
];

export function findWire(code: string): WireEntry | undefined {
  for (const cat of wireCatalog) {
    const hit = cat.wires.find((w) => w.code === code);
    if (hit) return hit;
  }
  return undefined;
}
