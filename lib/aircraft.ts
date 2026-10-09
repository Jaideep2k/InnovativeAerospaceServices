/**
 * Aircraft manufacturers IAS has worked on, per the client (October 2026).
 * Used on Careers (all), the helicopter page (rotary) and the fixed-wing
 * page (fixed). Names were dictated, so several are interpretations awaiting
 * client confirmation: "Aero Spitale" → Aérospatiale, "Augusta Westland" →
 * AgustaWestland, "Mall" → Maule, "Vans" → Van's. Bell was not in the list
 * but IAS's Bell 212 / 412 rewires are on the site, so it is included.
 */

export type AircraftMaker = {
  name: string;
  type: "rotary" | "fixed";
};

export const aircraftMakers: readonly AircraftMaker[] = [
  { name: "Aérospatiale", type: "rotary" },
  { name: "AgustaWestland", type: "rotary" },
  { name: "Airbus", type: "rotary" },
  { name: "Beechcraft", type: "fixed" },
  { name: "Bell", type: "rotary" },
  { name: "Bombardier", type: "fixed" },
  { name: "Cessna", type: "fixed" },
  { name: "Cirrus", type: "fixed" },
  { name: "De Havilland", type: "fixed" },
  { name: "Diamond", type: "fixed" },
  { name: "Embraer", type: "fixed" },
  { name: "Eurocopter", type: "rotary" },
  { name: "Learjet", type: "fixed" },
  { name: "Maule", type: "fixed" },
  { name: "Murphy", type: "fixed" },
  { name: "Pilatus", type: "fixed" },
  { name: "Piper", type: "fixed" },
  { name: "Robinson", type: "rotary" },
  { name: "Sikorsky", type: "rotary" },
  { name: "Van's", type: "fixed" },
];

export const rotaryMakers = aircraftMakers.filter((m) => m.type === "rotary");
export const fixedMakers = aircraftMakers.filter((m) => m.type === "fixed");
