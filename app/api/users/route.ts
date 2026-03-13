import { NextRequest, NextResponse } from "next/server";

const MOCK_USERS = [
  { id: "user-001", email: "admin@factory.com",    fullName: "Admin User",      role: "admin",    isActive: true,  lastLogin: "2026-03-13 08:42", sites: ["NMC Chonburi"] },
  { id: "user-002", email: "manager@factory.com",  fullName: "Factory Manager", role: "manager",  isActive: true,  lastLogin: "2026-03-13 07:15", sites: ["NMC Chonburi"] },
  { id: "user-003", email: "operator@factory.com", fullName: "Floor Operator",  role: "operator", isActive: true,  lastLogin: "2026-03-12 22:30", sites: ["NMC Chonburi"] },
  { id: "user-004", email: "somchai@factory.com",  fullName: "Somchai Rattana", role: "operator", isActive: true,  lastLogin: "2026-03-12 14:20", sites: ["NMC Chonburi"] },
  { id: "user-005", email: "wichai@factory.com",   fullName: "Wichai Panya",    role: "operator", isActive: false, lastLogin: "2026-02-28 09:00", sites: ["NMC Chonburi"] },
  { id: "user-006", email: "guest@factory.com",    fullName: "Guest User",      role: "guest",    isActive: true,  lastLogin: "Never",            sites: [] },
];

export async function GET() {
  return NextResponse.json(MOCK_USERS);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newUser = {
    id: `user-${Date.now()}`,
    ...body,
    lastLogin: "Never",
    sites: ["NMC Chonburi"],
  };
  return NextResponse.json(newUser, { status: 201 });
}
