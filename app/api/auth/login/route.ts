import { NextRequest, NextResponse } from "next/server";

const MOCK_USERS = [
  {
    id: "user-001", email: "admin@factory.com", password: "Admin@123",
    fullName: "Admin User", role: "admin",
    permissions: ["*"], modules: ["*"],
  },
  {
    id: "user-002", email: "manager@factory.com", password: "Manager@123",
    fullName: "Factory Manager", role: "manager",
    permissions: ["dashboard.view","analytics.view","analytics.export","alerts.view","alerts.manage","devices.view","energy.view","reports.view","simulation.view","emergency.view","security.view","ai.chat"],
    modules: ["dashboard","analytics","alerts","devices","energy","simulation","emergency","security","ai-chat"],
  },
  {
    id: "user-003", email: "operator@factory.com", password: "Operator@123",
    fullName: "Floor Operator", role: "operator",
    permissions: ["dashboard.view","alerts.view","devices.view","iot.control.start","iot.control.stop","iot.control.adjust","energy.view","emergency.view"],
    modules: ["dashboard","alerts","devices","energy","emergency"],
  },
];

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { password: _, ...userWithoutPw } = user;
  const token = `mock-jwt-${user.id}-${Date.now()}`;
  const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

  return NextResponse.json({ token, refreshToken, user: userWithoutPw });
}
