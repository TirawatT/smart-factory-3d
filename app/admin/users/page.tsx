"use client";

import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { useAuthStore, AuthUser, UserRole } from "@/stores/auth-store";
import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";

// ── Mock extended user list ────────────────────────────────────────────────────

interface UserRecord {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string;
  sites: string[];
}

const INITIAL_USERS: UserRecord[] = [
  { id: "user-001", email: "admin@factory.com",    fullName: "Admin User",      role: "admin",    isActive: true,  lastLogin: "2026-03-13 08:42", sites: ["NMC Chonburi"] },
  { id: "user-002", email: "manager@factory.com",  fullName: "Factory Manager", role: "manager",  isActive: true,  lastLogin: "2026-03-13 07:15", sites: ["NMC Chonburi"] },
  { id: "user-003", email: "operator@factory.com", fullName: "Floor Operator",  role: "operator", isActive: true,  lastLogin: "2026-03-12 22:30", sites: ["NMC Chonburi"] },
  { id: "user-004", email: "somchai@factory.com",  fullName: "Somchai Rattana", role: "operator", isActive: true,  lastLogin: "2026-03-12 14:20", sites: ["NMC Chonburi"] },
  { id: "user-005", email: "wichai@factory.com",   fullName: "Wichai Panya",    role: "operator", isActive: false, lastLogin: "2026-02-28 09:00", sites: ["NMC Chonburi"] },
  { id: "user-006", email: "guest@factory.com",    fullName: "Guest User",      role: "guest",    isActive: true,  lastLogin: "Never",            sites: [] },
];

const ROLE_COLORS: Record<UserRole, { color: string; bg: string }> = {
  admin:    { color: "#ff4560", bg: "rgba(255,69,96,0.12)" },
  manager:  { color: "#00c8ff", bg: "rgba(0,200,255,0.12)" },
  operator: { color: "#00ff9d", bg: "rgba(0,255,157,0.12)" },
  guest:    { color: "#4a6d8a", bg: "rgba(74,109,138,0.12)" },
};

const EMPTY_FORM = { email: "", fullName: "", role: "operator" as UserRole, isActive: true };

export default function AdminUsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.includes(search.toLowerCase())
  );

  const saveEdit = (id: string) => {
    setUsers((prev) => prev.map((u) =>
      u.id === id ? { ...u, email: form.email, fullName: form.fullName, role: form.role, isActive: form.isActive } : u
    ));
    setEditingId(null);
  };

  const startEdit = (u: UserRecord) => {
    setForm({ email: u.email, fullName: u.fullName, role: u.role, isActive: u.isActive });
    setEditingId(u.id);
    setShowAdd(false);
  };

  const addUser = () => {
    if (!form.email || !form.fullName) return;
    const newUser: UserRecord = {
      id: `user-${Date.now()}`, ...form, lastLogin: "Never", sites: ["NMC Chonburi"],
    };
    setUsers((prev) => [...prev, newUser]);
    setShowAdd(false);
    setForm(EMPTY_FORM);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteId(null);
  };

  const FormRow = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <tr style={{ background: "rgba(0,200,255,0.04)" }}>
      <td className="px-4 py-3">
        <input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          placeholder="Full name" className="w-full rounded-md px-2 py-1 text-xs outline-none"
          style={{ background: "#070d18", border: "1px solid #1e3c60", color: "#e0ecf7" }} />
      </td>
      <td className="px-4 py-3">
        <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="email@factory.com" className="w-full rounded-md px-2 py-1 text-xs outline-none"
          style={{ background: "#070d18", border: "1px solid #1e3c60", color: "#e0ecf7" }} />
      </td>
      <td className="px-4 py-3">
        <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
          className="rounded-md px-2 py-1 text-xs outline-none"
          style={{ background: "#070d18", border: "1px solid #1e3c60", color: "#e0ecf7" }}>
          {(["admin","manager","operator","guest"] as UserRole[]).map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </td>
      <td className="px-4 py-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
          <span className="text-xs" style={{ color: "#7fa3c2" }}>Active</span>
        </label>
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: "#4a6d8a" }}>—</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button onClick={onSave} className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: "rgba(0,255,157,0.1)", color: "#00ff9d" }}>
            <Check className="h-3.5 w-3.5" />
          </button>
          <button onClick={onCancel} className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: "rgba(255,69,96,0.1)", color: "#ff4560" }}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#070d18" }}>
      <Header title="USER MANAGEMENT" subtitle={`${users.length} users · ${users.filter((u) => u.isActive).length} active`} />

      <div className="p-4 md:p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "#4a6d8a" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
              className="w-full rounded-lg pl-9 pr-3 py-2 text-xs outline-none"
              style={{ background: "#0a1220", border: "1px solid #192e48", color: "#e0ecf7" }}
              onFocus={(e) => (e.target.style.borderColor = "#00c8ff")}
              onBlur={(e) => (e.target.style.borderColor = "#192e48")} />
          </div>
          <button onClick={() => { setShowAdd(true); setEditingId(null); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all"
            style={{ background: "linear-gradient(135deg, #0090c8, #00c8ff)", color: "#070d18" }}>
            <Plus className="h-3.5 w-3.5" /> Add User
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #192e48" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ background: "#0a1220" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #192e48" }}>
                  {["Name","Email","Role","Status","Last Login","Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider" style={{ color: "#4a6d8a" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#192e48" }}>
                {showAdd && (
                  <FormRow onSave={addUser} onCancel={() => setShowAdd(false)} />
                )}
                {filtered.map((u) => {
                  const rc = ROLE_COLORS[u.role];
                  if (editingId === u.id) {
                    return <FormRow key={u.id} onSave={() => saveEdit(u.id)} onCancel={() => setEditingId(null)} />;
                  }
                  return (
                    <tr key={u.id} className="transition-colors hover:bg-[#0f1d2e]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                            style={{ background: rc.bg, color: rc.color }}>
                            {u.fullName.charAt(0)}
                          </div>
                          <span className="font-medium" style={{ color: "#e0ecf7" }}>{u.fullName}</span>
                          {u.id === currentUser?.id && (
                            <Badge variant="outline" className="text-[9px] border-0 px-1 py-0" style={{ background: "rgba(0,200,255,0.1)", color: "#00c8ff" }}>you</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#7fa3c2" }}>{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="rounded px-2 py-0.5 text-[10px] sf-mono capitalize" style={{ background: rc.bg, color: rc.color }}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] sf-mono" style={{ color: u.isActive ? "#00ff9d" : "#4a6d8a" }}>
                          {u.isActive ? "● Active" : "○ Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs sf-mono" style={{ color: "#4a6d8a" }}>{u.lastLogin}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => startEdit(u)}
                            className="flex h-7 w-7 items-center justify-center rounded-md transition-all hover:bg-[#142338]"
                            style={{ color: "#7fa3c2" }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          {u.id !== currentUser?.id && (
                            <button onClick={() => setDeleteId(u.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-md transition-all hover:bg-[#1a0a0a]"
                              style={{ color: "#4a6d8a" }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete confirm */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="rounded-xl p-6 w-80" style={{ background: "#0f1d2e", border: "1px solid #192e48" }}>
              <p className="text-sm font-semibold mb-2" style={{ color: "#e0ecf7" }}>Delete User?</p>
              <p className="text-xs mb-5" style={{ color: "#7fa3c2" }}>
                This will remove {users.find((u) => u.id === deleteId)?.fullName} from the system.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-lg py-2 text-sm"
                  style={{ background: "#192e48", color: "#7fa3c2" }}>Cancel</button>
                <button onClick={() => deleteUser(deleteId)}
                  className="flex-1 rounded-lg py-2 text-sm font-bold"
                  style={{ background: "rgba(255,69,96,0.2)", border: "1px solid rgba(255,69,96,0.4)", color: "#ff4560" }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
