// ============================================================
// Smart Factory 3D — Overview Page Data (Factory Hierarchy)
// ============================================================

export interface Machine {
  id: string;
  name: string;
  icon: string;
  status: "running" | "warning" | "fault" | "idle";
  badge: string;
  sensors: MachineSensor[];
}

export interface MachineSensor {
  name: string;
  value: string;
  unit: string;
  percent: number;
  level: "ok" | "warn" | "accent";
}

export interface Room {
  id: string;
  name: string;
  subtitle: string;
  status: "ok" | "warn" | "fault";
  style: { left: string; top: string; width: string; height: string };
  machines: Machine[];
}

export interface Floor {
  id: string;
  num: string;
  name: string;
  meta: string;
  tags: { label: string; color: "danger" | "warn" | "ok" | "accent" }[];
  rooms: Room[];
}

export interface Building {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  status: "ok" | "warn";
  statusLabel: string;
  style: { left: string; top: string; width: string; height: string };
  floors: Floor[];
}

export interface FactorySite {
  name: string;
  location: string;
  buildings: Building[];
}

export interface AlertItem {
  id: string;
  icon: string;
  title: string;
  meta: string;
  severity: "crit" | "warn" | "info";
  badge: string;
  resolved?: boolean;
}

export interface LiveSensor {
  name: string;
  value: string;
  unit: string;
  level: "ok" | "warn" | "danger";
  sparkPoints: string;
}

// ---- Machine Definitions ----

const mk = (
  id: string,
  name: string,
  icon: string,
  status: Machine["status"],
  badge: string,
  sensors: MachineSensor[],
): Machine => ({ id, name, icon, status, badge, sensors });

const s = (
  name: string,
  value: string,
  unit: string,
  percent: number,
  level: MachineSensor["level"],
): MachineSensor => ({ name, value, unit, percent, level });

// --- Production / Clean Room ---
const cnc001 = mk(
  "CNC-001",
  "CNC Machining #001",
  "\u2699\uFE0F",
  "running",
  "\u25C9 RUNNING",
  [
    s("Spindle Speed", "2,400", "RPM", 75, "ok"),
    s("Temperature", "68", "\u00B0C", 60, "accent"),
    s("Vibration", "78", "Hz", 82, "warn"),
    s("Power", "18.4", "kW", 55, "ok"),
    s("OEE", "87", "%", 87, "ok"),
    s("Runtime Today", "6.4", "hr", 70, "accent"),
  ],
);
const robot02 = mk(
  "ROBOT-02",
  "Robot Arm #002",
  "\uD83E\uDDBE",
  "warning",
  "\u26A0 WARNING",
  [
    s("Joint Torque", "12.3", "Nm", 65, "ok"),
    s("Temperature", "72", "\u00B0C", 72, "warn"),
    s("Vibration", "85", "Hz", 88, "warn"),
    s("Power", "8.2", "kW", 45, "ok"),
    s("Cycle Time", "4.2", "sec", 60, "ok"),
    s("Uptime", "98.1", "%", 98, "ok"),
  ],
);
const pump03 = mk(
  "PUMP-03",
  "Coolant Pump #003",
  "\uD83D\uDD27",
  "fault",
  "\uD83D\uDD34 FAULT",
  [
    s("Pressure", "3.2", "Pa", 15, "warn"),
    s("Flow Rate", "0.0", "L/min", 0, "warn"),
    s("Temperature", "45", "\u00B0C", 45, "ok"),
    s("Power", "0.0", "kW", 0, "warn"),
    s("Motor Speed", "0", "RPM", 0, "warn"),
    s("Runtime", "0.0", "hr", 0, "accent"),
  ],
);
const conv04 = mk(
  "CONV-04",
  "Conveyor Belt #004",
  "\uD83C\uDFED",
  "running",
  "\u25C9 RUNNING",
  [
    s("Belt Speed", "1.2", "m/s", 60, "ok"),
    s("Motor Temp", "55", "\u00B0C", 50, "ok"),
    s("Load", "340", "kg", 68, "ok"),
    s("Power", "5.6", "kW", 35, "ok"),
    s("OEE", "92", "%", 92, "ok"),
    s("Runtime", "7.1", "hr", 78, "accent"),
  ],
);
const cam05 = mk(
  "CAM-05",
  "Inspection Camera #005",
  "\uD83D\uDCF7",
  "idle",
  "\u25CB IDLE",
  [
    s("FPS", "0", "fps", 0, "accent"),
    s("Buffer", "0", "%", 0, "ok"),
    s("Defect Rate", "0.0", "%", 0, "ok"),
    s("Power", "0.3", "kW", 5, "ok"),
    s("Uptime", "99.5", "%", 99, "ok"),
    s("Inspected", "0", "pcs", 0, "accent"),
  ],
);

// --- Utility Room ---
const ahu01 = mk(
  "AHU-01",
  "Air Handling Unit #001",
  "\uD83C\uDF21\uFE0F",
  "running",
  "\u25C9 RUNNING",
  [
    s("Supply Temp", "18.4", "\u00B0C", 35, "ok"),
    s("Return Temp", "24.2", "\u00B0C", 50, "ok"),
    s("Fan Speed", "1,200", "RPM", 65, "ok"),
    s("Filter DP", "120", "Pa", 40, "ok"),
    s("Power", "12.5", "kW", 52, "ok"),
    s("Runtime", "23.8", "hr", 99, "accent"),
  ],
);
const ups01 = mk(
  "UPS-01",
  "UPS System #001",
  "\uD83D\uDD0B",
  "running",
  "\u25C9 RUNNING",
  [
    s("Input Voltage", "228", "V", 95, "ok"),
    s("Output Load", "62", "%", 62, "ok"),
    s("Battery", "98", "%", 98, "ok"),
    s("Temperature", "32", "\u00B0C", 40, "ok"),
    s("Runtime Left", "45", "min", 75, "ok"),
    s("Efficiency", "96", "%", 96, "ok"),
  ],
);

// --- Storage ---
const agv01 = mk(
  "AGV-01",
  "Auto Guided Vehicle #001",
  "\uD83D\uDE97",
  "running",
  "\u25C9 RUNNING",
  [
    s("Battery", "74", "%", 74, "ok"),
    s("Speed", "0.8", "m/s", 40, "ok"),
    s("Load", "120", "kg", 48, "ok"),
    s("Motor Temp", "42", "\u00B0C", 35, "ok"),
    s("Trips Today", "34", "trips", 68, "accent"),
    s("Distance", "4.2", "km", 55, "accent"),
  ],
);
const rack01 = mk(
  "RACK-01",
  "Smart Rack System #001",
  "\uD83D\uDDC4",
  "running",
  "\u25C9 RUNNING",
  [
    s("Occupancy", "78", "%", 78, "ok"),
    s("Temperature", "22", "\u00B0C", 30, "ok"),
    s("Humidity", "45", "%", 45, "ok"),
    s("Weight", "2,400", "kg", 60, "ok"),
    s("Moves/hr", "12", "ops", 40, "accent"),
    s("Power", "3.2", "kW", 20, "ok"),
  ],
);

// --- QC Room ---
const cmm01 = mk(
  "CMM-01",
  "CMM Probe #001",
  "\uD83D\uDD2C",
  "running",
  "\u25C9 RUNNING",
  [
    s("Accuracy", "0.002", "mm", 98, "ok"),
    s("Probe Temp", "20.1", "\u00B0C", 28, "ok"),
    s("Air Pressure", "4.8", "bar", 80, "ok"),
    s("Parts/hr", "6", "pcs", 50, "accent"),
    s("Pass Rate", "99.2", "%", 99, "ok"),
    s("Runtime", "5.3", "hr", 58, "accent"),
  ],
);
const xray01 = mk(
  "XRAY-01",
  "X-Ray Inspector #001",
  "\u2622",
  "running",
  "\u25C9 RUNNING",
  [
    s("Tube Voltage", "120", "kV", 70, "ok"),
    s("Tube Current", "4.0", "mA", 50, "ok"),
    s("FPS", "30", "fps", 100, "ok"),
    s("Defect Found", "3", "pcs", 6, "warn"),
    s("Inspected", "482", "pcs", 80, "accent"),
    s("Uptime", "99.8", "%", 99, "ok"),
  ],
);

// --- Packaging Zone ---
const packer01 = mk(
  "PACK-01",
  "Auto Packer #001",
  "\uD83D\uDCE6",
  "running",
  "\u25C9 RUNNING",
  [
    s("Pack Rate", "120", "pcs/hr", 80, "ok"),
    s("Film Usage", "62", "%", 62, "ok"),
    s("Seal Temp", "185", "\u00B0C", 74, "ok"),
    s("Reject", "0.3", "%", 3, "ok"),
    s("Power", "4.8", "kW", 30, "ok"),
    s("Runtime", "6.8", "hr", 75, "accent"),
  ],
);
const labeler01 = mk(
  "LBL-01",
  "Label Printer #001",
  "\uD83D\uDDA8",
  "running",
  "\u25C9 RUNNING",
  [
    s("Print Speed", "200", "mm/s", 66, "ok"),
    s("Ribbon Left", "340", "m", 56, "ok"),
    s("Head Temp", "42", "\u00B0C", 35, "ok"),
    s("Labels/hr", "450", "pcs", 75, "accent"),
    s("Error Rate", "0.1", "%", 1, "ok"),
    s("Uptime", "99.6", "%", 99, "ok"),
  ],
);
const palletizer01 = mk(
  "PAL-01",
  "Palletizer Robot #001",
  "\uD83E\uDDBE",
  "running",
  "\u25C9 RUNNING",
  [
    s("Cycle Time", "8.5", "sec", 56, "ok"),
    s("Layer Count", "4", "layers", 80, "accent"),
    s("Grip Force", "24", "N", 48, "ok"),
    s("Joint Temp", "38", "\u00B0C", 32, "ok"),
    s("Pallets/hr", "15", "pcs", 62, "accent"),
    s("Power", "6.1", "kW", 38, "ok"),
  ],
);

// --- Server Room ---
const server01 = mk(
  "SRV-01",
  "Server Rack #001",
  "\uD83D\uDDA5",
  "running",
  "\u25C9 RUNNING",
  [
    s("CPU Load", "42", "%", 42, "ok"),
    s("Memory", "68", "%", 68, "ok"),
    s("Disk I/O", "340", "MB/s", 34, "ok"),
    s("Network", "2.4", "Gbps", 24, "ok"),
    s("Temperature", "28", "\u00B0C", 35, "ok"),
    s("Power", "3.8", "kW", 38, "ok"),
  ],
);
const server02 = mk(
  "SRV-02",
  "Server Rack #002",
  "\uD83D\uDDA5",
  "running",
  "\u25C9 RUNNING",
  [
    s("CPU Load", "78", "%", 78, "warn"),
    s("Memory", "82", "%", 82, "warn"),
    s("Disk I/O", "680", "MB/s", 68, "ok"),
    s("Network", "4.8", "Gbps", 48, "ok"),
    s("Temperature", "34", "\u00B0C", 42, "ok"),
    s("Power", "5.2", "kW", 52, "ok"),
  ],
);
const crac01 = mk(
  "CRAC-01",
  "CRAC Unit #001",
  "\u2744",
  "running",
  "\u25C9 RUNNING",
  [
    s("Supply Temp", "16.2", "\u00B0C", 22, "ok"),
    s("Return Temp", "28.4", "\u00B0C", 38, "ok"),
    s("Humidity", "48", "%", 48, "ok"),
    s("Fan Speed", "1,800", "RPM", 72, "ok"),
    s("Refrigerant", "92", "%", 92, "ok"),
    s("Power", "8.6", "kW", 43, "ok"),
  ],
);

// --- Engineering ---
const ws01 = mk(
  "WS-01",
  "CAD Workstation #001",
  "\uD83D\uDDA5",
  "running",
  "\u25C9 RUNNING",
  [
    s("CPU", "56", "%", 56, "ok"),
    s("GPU", "72", "%", 72, "ok"),
    s("Memory", "24", "GB", 75, "ok"),
    s("Disk", "1.8", "TB", 45, "ok"),
    s("Temperature", "62", "\u00B0C", 55, "ok"),
    s("Power", "0.6", "kW", 12, "ok"),
  ],
);
const ws02 = mk(
  "WS-02",
  "Simulation Workstation #002",
  "\uD83D\uDDA5",
  "running",
  "\u25C9 RUNNING",
  [
    s("CPU", "88", "%", 88, "warn"),
    s("GPU", "94", "%", 94, "warn"),
    s("Memory", "30", "GB", 93, "warn"),
    s("Disk", "2.4", "TB", 60, "ok"),
    s("Temperature", "71", "\u00B0C", 65, "warn"),
    s("Power", "0.9", "kW", 18, "ok"),
  ],
);

// --- R&D ---
const printer3d = mk(
  "3DP-01",
  "3D Printer #001",
  "\uD83D\uDDA8",
  "running",
  "\u25C9 RUNNING",
  [
    s("Nozzle Temp", "215", "\u00B0C", 86, "ok"),
    s("Bed Temp", "60", "\u00B0C", 60, "ok"),
    s("Layer", "142/300", "layer", 47, "accent"),
    s("Filament", "68", "%", 68, "ok"),
    s("Speed", "80", "mm/s", 53, "ok"),
    s("ETA", "2.4", "hr", 30, "accent"),
  ],
);
const testbench = mk(
  "TB-01",
  "Prototype Test Bench #001",
  "\uD83D\uDD27",
  "running",
  "\u25C9 RUNNING",
  [
    s("Load Cell", "450", "N", 56, "ok"),
    s("Displacement", "12.4", "mm", 62, "ok"),
    s("Cycle Count", "1,240", "cycles", 41, "accent"),
    s("Temperature", "28", "\u00B0C", 35, "ok"),
    s("Vibration", "32", "Hz", 32, "ok"),
    s("Runtime", "3.2", "hr", 35, "accent"),
  ],
);
const laser01 = mk(
  "LAS-01",
  "Laser Cutter #001",
  "\uD83D\uDD2C",
  "running",
  "\u25C9 RUNNING",
  [
    s("Laser Power", "1,500", "W", 75, "ok"),
    s("Focus Z", "12.0", "mm", 60, "ok"),
    s("Gas Pressure", "12", "bar", 80, "ok"),
    s("Cut Speed", "3.4", "m/min", 56, "ok"),
    s("Lens Temp", "38", "\u00B0C", 32, "ok"),
    s("Runtime", "4.1", "hr", 45, "accent"),
  ],
);
const chamber01 = mk(
  "ENV-01",
  "Environmental Chamber #001",
  "\uD83C\uDF21\uFE0F",
  "running",
  "\u25C9 RUNNING",
  [
    s("Temperature", "-40", "\u00B0C", 20, "accent"),
    s("Humidity", "85", "%", 85, "ok"),
    s("Ramp Rate", "5", "\u00B0C/min", 50, "ok"),
    s("Cycle", "3/10", "cycle", 30, "accent"),
    s("Compressor", "92", "%", 92, "ok"),
    s("Power", "14.2", "kW", 71, "ok"),
  ],
);
const chamber02 = mk(
  "ENV-02",
  "Salt Spray Chamber #002",
  "\uD83C\uDF21\uFE0F",
  "running",
  "\u25C9 RUNNING",
  [
    s("Temperature", "35", "\u00B0C", 44, "ok"),
    s("Salt Conc.", "5.0", "%", 50, "ok"),
    s("Spray Rate", "1.2", "mL/min", 60, "ok"),
    s("Duration", "120", "hr", 50, "accent"),
    s("pH", "6.8", "pH", 48, "ok"),
    s("Power", "2.8", "kW", 18, "ok"),
  ],
);

// --- Assembly ---
const asmRobot01 = mk(
  "ASM-R01",
  "Assembly Robot #001",
  "\uD83E\uDDBE",
  "running",
  "\u25C9 RUNNING",
  [
    s("Cycle Time", "6.2", "sec", 62, "ok"),
    s("Torque", "8.5", "Nm", 42, "ok"),
    s("Position Err", "0.01", "mm", 5, "ok"),
    s("Temperature", "38", "\u00B0C", 32, "ok"),
    s("Parts/hr", "580", "pcs", 72, "accent"),
    s("Uptime", "99.4", "%", 99, "ok"),
  ],
);
const asmRobot02 = mk(
  "ASM-R02",
  "Assembly Robot #002",
  "\uD83E\uDDBE",
  "running",
  "\u25C9 RUNNING",
  [
    s("Cycle Time", "5.8", "sec", 58, "ok"),
    s("Torque", "9.1", "Nm", 45, "ok"),
    s("Position Err", "0.02", "mm", 8, "ok"),
    s("Temperature", "36", "\u00B0C", 30, "ok"),
    s("Parts/hr", "620", "pcs", 77, "accent"),
    s("Uptime", "99.7", "%", 99, "ok"),
  ],
);
const solder01 = mk(
  "SOL-01",
  "Solder Station #001",
  "\uD83D\uDD25",
  "running",
  "\u25C9 RUNNING",
  [
    s("Tip Temp", "350", "\u00B0C", 87, "ok"),
    s("Flow Rate", "2.1", "g/min", 42, "ok"),
    s("Solder Left", "72", "%", 72, "ok"),
    s("Joints/hr", "1,200", "joints", 80, "accent"),
    s("Defect Rate", "0.08", "%", 2, "ok"),
    s("Power", "0.8", "kW", 16, "ok"),
  ],
);
const conv05 = mk(
  "CONV-05",
  "Assembly Conveyor #005",
  "\uD83C\uDFED",
  "running",
  "\u25C9 RUNNING",
  [
    s("Belt Speed", "0.6", "m/s", 30, "ok"),
    s("Motor Temp", "48", "\u00B0C", 40, "ok"),
    s("Load", "180", "kg", 36, "ok"),
    s("Power", "3.2", "kW", 20, "ok"),
    s("OEE", "95", "%", 95, "ok"),
    s("Runtime", "7.8", "hr", 86, "accent"),
  ],
);

// --- QC Station (Building B) ---
const aoi01 = mk(
  "AOI-01",
  "AOI Inspection #001",
  "\uD83D\uDCF7",
  "running",
  "\u25C9 RUNNING",
  [
    s("Scan Rate", "240", "pcs/hr", 80, "ok"),
    s("Defect Found", "5", "pcs", 10, "ok"),
    s("False Alarm", "0.2", "%", 2, "ok"),
    s("Camera Temp", "34", "\u00B0C", 28, "ok"),
    s("Light Level", "850", "lux", 85, "ok"),
    s("Uptime", "99.9", "%", 99, "ok"),
  ],
);
const leaktest01 = mk(
  "LEAK-01",
  "Leak Tester #001",
  "\uD83D\uDCA7",
  "running",
  "\u25C9 RUNNING",
  [
    s("Test Pressure", "5.0", "bar", 83, "ok"),
    s("Leak Rate", "0.001", "mL/min", 2, "ok"),
    s("Cycle Time", "12", "sec", 40, "ok"),
    s("Pass Rate", "99.8", "%", 99, "ok"),
    s("Parts Tested", "368", "pcs", 61, "accent"),
    s("Air Supply", "6.2", "bar", 88, "ok"),
  ],
);

// --- Warehouse ---
const agv02 = mk(
  "AGV-02",
  "Auto Guided Vehicle #002",
  "\uD83D\uDE97",
  "running",
  "\u25C9 RUNNING",
  [
    s("Battery", "58", "%", 58, "ok"),
    s("Speed", "1.0", "m/s", 50, "ok"),
    s("Load", "200", "kg", 80, "ok"),
    s("Motor Temp", "44", "\u00B0C", 37, "ok"),
    s("Trips Today", "28", "trips", 56, "accent"),
    s("Distance", "3.6", "km", 45, "accent"),
  ],
);
const rack02 = mk(
  "RACK-02",
  "Smart Rack System #002",
  "\uD83D\uDDC4",
  "running",
  "\u25C9 RUNNING",
  [
    s("Occupancy", "65", "%", 65, "ok"),
    s("Temperature", "21", "\u00B0C", 28, "ok"),
    s("Humidity", "42", "%", 42, "ok"),
    s("Weight", "1,800", "kg", 45, "ok"),
    s("Moves/hr", "8", "ops", 26, "accent"),
    s("Power", "2.8", "kW", 18, "ok"),
  ],
);
const conv06 = mk(
  "CONV-06",
  "Warehouse Conveyor #006",
  "\uD83C\uDFED",
  "running",
  "\u25C9 RUNNING",
  [
    s("Belt Speed", "0.9", "m/s", 45, "ok"),
    s("Motor Temp", "46", "\u00B0C", 38, "ok"),
    s("Load", "280", "kg", 56, "ok"),
    s("Power", "4.2", "kW", 26, "ok"),
    s("OEE", "90", "%", 90, "ok"),
    s("Runtime", "6.5", "hr", 72, "accent"),
  ],
);

// --- Power Station ---
const trafo01 = mk(
  "TRAFO-01",
  "Transformer #001",
  "\u26A1",
  "running",
  "\u25C9 RUNNING",
  [
    s("Input Voltage", "22,000", "V", 91, "ok"),
    s("Output Voltage", "400", "V", 95, "ok"),
    s("Load", "680", "kVA", 68, "ok"),
    s("Oil Temp", "56", "\u00B0C", 47, "ok"),
    s("Power Factor", "0.95", "PF", 95, "ok"),
    s("Efficiency", "98.2", "%", 98, "ok"),
  ],
);
const genset01 = mk(
  "GEN-01",
  "Diesel Generator #001",
  "\uD83D\uDD27",
  "idle",
  "\u25CB STANDBY",
  [
    s("Fuel Level", "82", "%", 82, "ok"),
    s("Battery", "12.6", "V", 90, "ok"),
    s("Coolant Temp", "28", "\u00B0C", 23, "ok"),
    s("Oil Pressure", "0", "bar", 0, "accent"),
    s("Runtime Total", "342", "hr", 34, "accent"),
    s("Last Test", "48", "hr ago", 50, "ok"),
  ],
);
const pdb01 = mk(
  "PDB-01",
  "Power Dist. Board #001",
  "\u26A1",
  "running",
  "\u25C9 RUNNING",
  [
    s("Main Breaker", "80", "%", 80, "ok"),
    s("Phase A", "230", "V", 95, "ok"),
    s("Phase B", "228", "V", 94, "ok"),
    s("Phase C", "231", "V", 96, "ok"),
    s("Total Load", "420", "A", 70, "ok"),
    s("Power", "168", "kW", 56, "ok"),
  ],
);

// --- Cooling Plant ---
const chiller01 = mk(
  "CHL-01",
  "Chiller #001",
  "\u2744",
  "running",
  "\u25C9 RUNNING",
  [
    s("Supply Temp", "7.2", "\u00B0C", 12, "ok"),
    s("Return Temp", "12.8", "\u00B0C", 21, "ok"),
    s("Flow Rate", "180", "m\u00B3/hr", 72, "ok"),
    s("Compressor", "86", "%", 86, "ok"),
    s("Refrigerant", "94", "%", 94, "ok"),
    s("Power", "45", "kW", 56, "ok"),
  ],
);
const chiller02 = mk(
  "CHL-02",
  "Chiller #002",
  "\u2744",
  "running",
  "\u25C9 RUNNING",
  [
    s("Supply Temp", "7.5", "\u00B0C", 12, "ok"),
    s("Return Temp", "13.1", "\u00B0C", 22, "ok"),
    s("Flow Rate", "175", "m\u00B3/hr", 70, "ok"),
    s("Compressor", "82", "%", 82, "ok"),
    s("Refrigerant", "91", "%", 91, "ok"),
    s("Power", "42", "kW", 52, "ok"),
  ],
);
const ctower01 = mk(
  "CT-01",
  "Cooling Tower #001",
  "\uD83D\uDCA7",
  "running",
  "\u25C9 RUNNING",
  [
    s("Water Temp", "28", "\u00B0C", 35, "ok"),
    s("Fan Speed", "900", "RPM", 60, "ok"),
    s("Water Level", "88", "%", 88, "ok"),
    s("pH", "7.2", "pH", 51, "ok"),
    s("TDS", "280", "ppm", 28, "ok"),
    s("Power", "8.5", "kW", 28, "ok"),
  ],
);

// ============================================================
// Factory Hierarchy
// ============================================================
export const factoryData: FactorySite = {
  name: "NMC Chonburi",
  location: "NMC Factory \u2014 Chonburi",
  buildings: [
    {
      id: "bldg-a",
      code: "A",
      name: "\u0E2D\u0E32\u0E04\u0E32\u0E23 A \u2014 Production",
      subtitle: "Production",
      status: "warn",
      statusLabel: "\u26A0 1 Warning",
      style: { left: "4%", top: "7%", width: "24%", height: "60%" },
      floors: [
        {
          id: "f1",
          num: "1F",
          name: "\u0E0A\u0E31\u0E49\u0E19 1 \u2014 Production Floor",
          meta: "6 Rooms \u00B7 24 Machines",
          tags: [
            { label: "\uD83D\uDD34 1 Fault", color: "danger" },
            { label: "\u26A0 1 Warning", color: "warn" },
            { label: "Clean Room", color: "ok" },
          ],
          rooms: [
            {
              id: "cr01",
              name: "Clean Room CR-01",
              subtitle: "Production Zone A",
              status: "warn",
              style: { left: "4%", top: "8%", width: "40%", height: "34%" },
              machines: [cnc001, robot02, pump03],
            },
            {
              id: "mfg02",
              name: "MFG Zone 02",
              subtitle: "Heavy Machining",
              status: "fault",
              style: { left: "52%", top: "8%", width: "26%", height: "34%" },
              machines: [conv04, cam05],
            },
            {
              id: "util-a",
              name: "Utility Room A",
              subtitle: "Power & HVAC",
              status: "ok",
              style: { left: "82%", top: "8%", width: "14%", height: "34%" },
              machines: [ahu01, ups01],
            },
            {
              id: "store01",
              name: "Storage 01",
              subtitle: "Material Storage",
              status: "ok",
              style: { left: "4%", top: "56%", width: "20%", height: "36%" },
              machines: [agv01, rack01],
            },
            {
              id: "qc",
              name: "QC Room",
              subtitle: "Inspection",
              status: "ok",
              style: { left: "28%", top: "56%", width: "24%", height: "36%" },
              machines: [cmm01, xray01],
            },
            {
              id: "pack",
              name: "Packaging Zone",
              subtitle: "Pack \u00B7 Label \u00B7 Ship",
              status: "ok",
              style: { left: "56%", top: "56%", width: "40%", height: "36%" },
              machines: [packer01, labeler01, palletizer01],
            },
          ],
        },
        {
          id: "f2",
          num: "2F",
          name: "\u0E0A\u0E31\u0E49\u0E19 2 \u2014 Engineering & Office",
          meta: "3 Rooms \u00B7 Control Station",
          tags: [{ label: "\u25C9 All Normal", color: "ok" }],
          rooms: [
            {
              id: "eng01",
              name: "Engineering Office",
              subtitle: "Control Station",
              status: "ok",
              style: { left: "4%", top: "8%", width: "45%", height: "40%" },
              machines: [ws01, ws02],
            },
            {
              id: "server",
              name: "Server Room",
              subtitle: "IT Infrastructure",
              status: "ok",
              style: { left: "55%", top: "8%", width: "40%", height: "40%" },
              machines: [server01, server02, crac01],
            },
            {
              id: "meeting",
              name: "Meeting Room",
              subtitle: "Conference",
              status: "ok",
              style: { left: "4%", top: "55%", width: "30%", height: "38%" },
              machines: [],
            },
          ],
        },
        {
          id: "f3",
          num: "3F",
          name: "\u0E0A\u0E31\u0E49\u0E19 3 \u2014 R&D Lab",
          meta: "2 Rooms \u00B7 Prototype Zone",
          tags: [{ label: "Restricted", color: "accent" }],
          rooms: [
            {
              id: "lab01",
              name: "R&D Lab 01",
              subtitle: "Prototype Development",
              status: "ok",
              style: { left: "4%", top: "10%", width: "55%", height: "80%" },
              machines: [printer3d, testbench, laser01],
            },
            {
              id: "lab02",
              name: "Test Chamber",
              subtitle: "Environmental Testing",
              status: "ok",
              style: { left: "65%", top: "10%", width: "30%", height: "80%" },
              machines: [chamber01, chamber02],
            },
          ],
        },
      ],
    },
    {
      id: "bldg-b",
      code: "B",
      name: "\u0E2D\u0E32\u0E04\u0E32\u0E23 B \u2014 Assembly & QC",
      subtitle: "Assembly & QC",
      status: "ok",
      statusLabel: "\u25C9 All Normal",
      style: { left: "36%", top: "7%", width: "36%", height: "60%" },
      floors: [
        {
          id: "bf1",
          num: "1F",
          name: "\u0E0A\u0E31\u0E49\u0E19 1 \u2014 Assembly Line",
          meta: "2 Rooms \u00B7 12 Stations",
          tags: [{ label: "\u25C9 All Normal", color: "ok" }],
          rooms: [
            {
              id: "asm01",
              name: "Assembly Line 01",
              subtitle: "Main Assembly",
              status: "ok",
              style: { left: "4%", top: "8%", width: "55%", height: "84%" },
              machines: [asmRobot01, asmRobot02, solder01, conv05],
            },
            {
              id: "qcb",
              name: "QC Station",
              subtitle: "Quality Inspection",
              status: "ok",
              style: { left: "65%", top: "8%", width: "30%", height: "84%" },
              machines: [aoi01, leaktest01],
            },
          ],
        },
      ],
    },
    {
      id: "bldg-c",
      code: "C",
      name: "\u0E2D\u0E32\u0E04\u0E32\u0E23 C \u2014 Warehouse",
      subtitle: "Warehouse",
      status: "ok",
      statusLabel: "\u25C9 All Normal",
      style: { left: "79%", top: "7%", width: "17%", height: "60%" },
      floors: [
        {
          id: "cf1",
          num: "1F",
          name: "\u0E0A\u0E31\u0E49\u0E19 1 \u2014 Storage Area",
          meta: "2 Zones \u00B7 Rack System",
          tags: [{ label: "\u25C9 All Normal", color: "ok" }],
          rooms: [
            {
              id: "wh01",
              name: "Warehouse Zone A",
              subtitle: "Raw Material",
              status: "ok",
              style: { left: "4%", top: "8%", width: "44%", height: "84%" },
              machines: [agv02, rack02],
            },
            {
              id: "wh02",
              name: "Warehouse Zone B",
              subtitle: "Finished Goods",
              status: "ok",
              style: { left: "52%", top: "8%", width: "44%", height: "84%" },
              machines: [conv06],
            },
          ],
        },
      ],
    },
    {
      id: "bldg-d",
      code: "D",
      name: "\u0E2D\u0E32\u0E04\u0E32\u0E23 D \u2014 Utility",
      subtitle: "Power \u00B7 Cooling \u00B7 Air Supply",
      status: "ok",
      statusLabel: "\u25C9 Normal",
      style: { left: "4%", top: "76%", width: "91%", height: "19%" },
      floors: [
        {
          id: "df1",
          num: "1F",
          name: "\u0E0A\u0E31\u0E49\u0E19 1 \u2014 Utility Plant",
          meta: "Power \u00B7 Cooling \u00B7 Compressed Air",
          tags: [{ label: "\u25C9 All Normal", color: "ok" }],
          rooms: [
            {
              id: "pwr",
              name: "Power Station",
              subtitle: "Electrical Distribution",
              status: "ok",
              style: { left: "4%", top: "10%", width: "30%", height: "80%" },
              machines: [trafo01, genset01, pdb01],
            },
            {
              id: "cool",
              name: "Cooling Plant",
              subtitle: "Chiller System",
              status: "ok",
              style: { left: "38%", top: "10%", width: "58%", height: "80%" },
              machines: [chiller01, chiller02, ctower01],
            },
          ],
        },
      ],
    },
  ],
};

// ---- Live Sensor Summary ----
export const liveSensors: LiveSensor[] = [
  {
    name: "TEMPERATURE AVG",
    value: "23.1",
    unit: "\u00B0C",
    level: "ok",
    sparkPoints: "0,16 11,14 22,13 33,14 44,12 55,11",
  },
  {
    name: "PARTICLE COUNT",
    value: "8,420",
    unit: "p/m\u00B3",
    level: "warn",
    sparkPoints: "0,18 11,16 22,13 33,10 44,8 55,5",
  },
  {
    name: "DIFF. PRESSURE",
    value: "3.2",
    unit: "Pa",
    level: "danger",
    sparkPoints: "0,8 11,9 22,12 33,15 44,17 55,20",
  },
  {
    name: "POWER TOTAL",
    value: "142",
    unit: "kW",
    level: "ok",
    sparkPoints: "0,13 11,12 22,13 33,11 44,12 55,12",
  },
];

// ---- Alert Data ----
export const mockAlerts: AlertItem[] = [
  {
    id: "a1",
    icon: "\uD83D\uDD34",
    title: "Coolant Pump Pressure Drop",
    meta: "PUMP-03 \u00B7 3.2 Pa \u00B7 2 min ago",
    severity: "crit",
    badge: "CRIT",
  },
  {
    id: "a2",
    icon: "\u26A0\uFE0F",
    title: "Robot Arm Vibration High",
    meta: "ROBOT-02 \u00B7 78 Hz \u00B7 15 min ago",
    severity: "warn",
    badge: "WARN",
  },
  {
    id: "a3",
    icon: "\u2139\uFE0F",
    title: "Temperature Spike",
    meta: "CR-01 \u00B7 normalized \u00B7 1h ago",
    severity: "info",
    badge: "OK",
    resolved: true,
  },
];
