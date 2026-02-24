# Smart Factory 3D

ระบบ **Smart Factory** สำหรับติดตามและจัดการโรงงานอัจฉริยะแบบ Real-time ผสมผสาน Digital Twin 3D View เข้ากับ IoT Device Monitoring บน Web Application ที่ใช้ธีมสไตล์ Industrial Dark

---

## ✨ Features

### 📊 Dashboard

- แสดงภาพรวมสถานะโรงงานแบบ Real-time
- KPI Cards: อุปกรณ์ออนไลน์, การแจ้งเตือน, ประสิทธิภาพ
- Realtime Line Charts และ Gauge Charts ต่ออัพเดทอัตโนมัติ
- Alerts panel แจ้งเตือนความผิดปกติ พร้อม Acknowledge / Dismiss
- ปุ่มควบคุม Simulation เพื่อจำลองข้อมูล Sensor

### 🧊 Digital Twin

- 3D View โหลดจากไฟล์ท้องถิ่น (`/src_3d/`) หรือ URL ภายนอก (เช่น Matterport)
- **3D ↔ Device Panel Interaction** ผ่าน `postMessage`:
  - คลิก link ใน Popup ของ 3D View → เลือก Device ใน Panel ด้านขวาทันที
  - ใส่ `<a onclick="window.parent.postMessage({deviceId:'dev-001'},'*')">` ใน `en.txt` ของ Virtual Tour
- Device Info Panel แสดง Live Sensor Gauges และ Trend Charts ของ Device ที่เลือก
- **Link Generator**: สร้าง Deep-link URL (`?device=xxx`) และ 3D HTML Snippet ได้จาก Panel
- **URL Deep-link**: เปิด `/digital-twin?device=dev-001` → auto-select Device นั้นทันที
- Fullscreen mode

### 🔒 Security

- แสดง 3D View แบบเต็มจอสำหรับ Scenario ต่างๆ
- เลือก Scenario: **Normal / Fire (ไฟไหม้) / Flood (น้ำท่วม) / Earthquake (แผ่นดินไหว)**
- แต่ละ Scenario กำหนด 3D URL แยกกันได้ผ่านปุ่ม Settings
- Active label strip แสดง Scenario ที่เลือกอยู่
- Fullscreen mode

### 📡 Devices

- รายการ IoT Devices ทั้งหมดในโรงงาน
- กรองตาม Zone, Status, Type
- เพิ่ม / แก้ไข / ลบ Device
- หน้า Device Detail แสดง Sensor readings, Trend Charts และข้อมูลครบถ้วน

---

## 🏗️ Tech Stack

| รายการ                                       | เวอร์ชัน |
| -------------------------------------------- | -------- |
| [Next.js](https://nextjs.org) (App Router)   | 16.1.6   |
| [React](https://react.dev)                   | 19.2.3   |
| [TypeScript](https://www.typescriptlang.org) | ^5       |
| [Tailwind CSS](https://tailwindcss.com)      | ^4       |
| [shadcn/ui](https://ui.shadcn.com)           | —        |
| [Zustand](https://zustand-demo.pmnd.rs)      | ^5.0.11  |
| [Recharts](https://recharts.org)             | ^3.7.0   |
| [Lucide React](https://lucide.dev)           | ^0.570.0 |

---

## 📁 Project Structure

```
app/
├── dashboard/          # หน้า Dashboard Real-time
├── digital-twin/       # หน้า Digital Twin 3D + Device Panel
├── devices/            # หน้า Device List + Device Detail
└── security/           # หน้า Security 3D Scenario Viewer

components/
├── layout/             # AppShell, Sidebar, Header
├── charts/             # GaugeChart, RealtimeLineChart
├── dashboard/          # Dashboard widgets
├── digital-twin/       # MatterportViewer, DeviceInfoPanel
├── devices/            # DeviceList, DeviceForm, DeviceDetail
├── security/           # SecurityViewer
└── ui/                 # shadcn/ui base components

stores/
├── device-store.ts     # Zustand: Devices CRUD
└── realtime-store.ts   # Zustand: Sensor readings, Alerts, selectedDevice

lib/
├── mock-data.ts        # Mock devices & sensor data
└── types.ts            # TypeScript interfaces

public/
└── src_3d/             # 3D Virtual Tour files (local HTML viewer)
```

---

## 🎨 Design Theme

Industrial Dark UI:

| Token           | ค่า       |
| --------------- | --------- |
| Background      | `#070d18` |
| Surface         | `#0b1520` |
| Border          | `#192e48` |
| Cyan (Primary)  | `#00c8ff` |
| Green (OK)      | `#00ff9d` |
| Amber (Warning) | `#ffb800` |
| Red (Critical)  | `#ff4560` |
| Text            | `#e0ecf7` |

Font: **Barlow Condensed** (headings), **IBM Plex Mono** (data/values)

---

## 🚀 Getting Started

```bash
# ติดตั้ง dependencies
npm install

# รัน dev server
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

```bash
# Build production
npm run build
npm start
```

---

## 🔗 3D View Integration

### วิธีเชื่อม link ใน Virtual Tour กับ Device Panel

เพิ่ม `<a>` tag ใน `en.txt` ของ Virtual Tour:

```html
<a
  href="#"
  onclick="window.parent.postMessage({deviceId:'dev-001'},'*');return false;"
  style="color:#0066cc;"
>
  📍 Temperature Sensor A1
</a>
```

| `deviceId` | Device                 |
| ---------- | ---------------------- |
| `dev-001`  | Temperature Sensor A1  |
| `dev-002`  | Humidity Controller B1 |
| `dev-003`  | Vibration Monitor M3   |
| `dev-004`  | Power Meter Line 1     |
| `dev-005`  | Pressure Gauge P2      |
| `dev-006`  | Gas Detector G1        |

### Deep-link URL

```
http://localhost:3000/digital-twin?device=dev-001
```

เปิด URL นี้ → หน้า Digital Twin จะ auto-select Device นั้นทันที

---

## 📝 License

Private project — All rights reserved.
