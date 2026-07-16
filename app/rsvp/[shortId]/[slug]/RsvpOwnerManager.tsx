"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { UserCheck, UserX, Trash2, Loader2, Link2, Mail, Phone, RefreshCw, Undo2, Search, CheckCircle2, ClipboardList, Users, Save } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  status: string | null; // 'going' (accepted) | 'declined' (rejected) | null (pending)
  fb_link: string | null;
  email: string | null;
  contact: string | null;
  attended: boolean;
  remarks: string | null;
  attended_at?: string | null;
}

const errMsg = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

const MAX_GOING = 100;

type Mode = 'manage' | 'attendance';

export default function RsvpOwnerManager({ invitationId }: { invitationId: string }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('manage');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/rsvp/${invitationId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load guests');
      setGuests(data.guests || []);
    } catch (e) {
      setError(errMsg(e, 'Failed to load guests'));
    } finally {
      setLoading(false);
    }
  }, [invitationId]);

  useEffect(() => { load(); }, [load]);

  const post = async (body: Record<string, unknown>) => {
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitation_id: invitationId, ...body }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  const updateStatus = async (guest: Guest, status: string | null) => {
    setBusyId(guest.id);
    setError('');
    try {
      await post({ name: guest.name, status, action: 'set_status' });
      setGuests((prev) => prev.map((g) => (g.id === guest.id ? { ...g, status } : g)));
    } catch (e) {
      setError(errMsg(e, 'Could not update guest'));
    } finally {
      setBusyId(null);
    }
  };

  const setAttendance = async (guest: Guest, attended: boolean, remarks: string) => {
    setBusyId(guest.id);
    setError('');
    try {
      const data = await post({ name: guest.name, action: 'set_attendance', attended, remarks });
      const updated = data.guest as Guest | undefined;
      setGuests((prev) => prev.map((g) => (g.id === guest.id ? { ...g, ...(updated || { attended, remarks: remarks || null }) } : g)));
    } catch (e) {
      setError(errMsg(e, 'Could not update attendance'));
    } finally {
      setBusyId(null);
    }
  };

  const removeGuest = async (guest: Guest) => {
    if (!window.confirm(`Permanently remove "${guest.name}" from your guest list?`)) return;
    setBusyId(guest.id);
    setError('');
    try {
      await post({ name: guest.name, action: 'delete' });
      setGuests((prev) => prev.filter((g) => g.id !== guest.id));
    } catch (e) {
      setError(errMsg(e, 'Could not remove guest'));
    } finally {
      setBusyId(null);
    }
  };

  const goingCount = guests.filter((g) => g.status === 'going').length;
  const pendingCount = guests.filter((g) => !g.status).length;
  const declinedCount = guests.filter((g) => g.status === 'declined').length;
  const presentCount = guests.filter((g) => g.attended).length;
  const full = goingCount >= MAX_GOING;

  const statusBadge = (status: string | null) => {
    if (status === 'going') return <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 bg-emerald-100 text-emerald-700">Accepted</span>;
    if (status === 'declined') return <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 bg-rose-100 text-rose-700">Rejected</span>;
    return <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 bg-amber-100 text-amber-700">Pending</span>;
  };

  const contactBlock = (guest: Guest) => (
    (guest.fb_link || guest.email || guest.contact) ? (
      <div className="space-y-1">
        {guest.fb_link && (
          <a href={guest.fb_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[9px] font-bold text-blue-600 hover:underline break-all">
            <Link2 size={10} className="shrink-0" /> <span className="truncate">{guest.fb_link}</span>
          </a>
        )}
        {guest.email && (
          <a href={`mailto:${guest.email}`} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 hover:underline break-all">
            <Mail size={10} className="shrink-0" /> <span className="truncate">{guest.email}</span>
          </a>
        )}
        {guest.contact && (
          <a href={`tel:${guest.contact}`} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 hover:underline">
            <Phone size={10} className="shrink-0" /> <span className="truncate">{guest.contact}</span>
          </a>
        )}
      </div>
    ) : null
  );

  const attendanceList = (() => {
    const q = search.trim().toLowerCase();
    const list = q ? guests.filter((g) => g.name.toLowerCase().includes(q)) : guests;
    // Not-yet-present first, then present; alphabetical within each group.
    return [...list].sort((a, b) => {
      if (a.attended !== b.attended) return a.attended ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
  })();

  return (
    <div className="space-y-4">
      {/* MODE TOGGLE */}
      <div className="flex w-full bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setMode('manage')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mode === 'manage' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ClipboardList size={12} /> Manage RSVP
        </button>
        <button
          onClick={() => setMode('attendance')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${mode === 'attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Users size={12} /> Attendance
        </button>
      </div>

      {/* HEADER + REFRESH */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {mode === 'manage' ? 'Guest List' : 'Event Check-In'}
        </label>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-all disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={11} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* STATS */}
      {mode === 'manage' ? (
        <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-center">
            <p className={`text-[14px] font-black ${full ? 'text-rose-500' : 'text-emerald-600'}`}>{goingCount}<span className="text-[9px] text-slate-400">/{MAX_GOING}</span></p>
            <p className="text-[7px] font-black text-slate-400 uppercase">Accepted</p>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-black text-amber-600">{pendingCount}</p>
            <p className="text-[7px] font-black text-slate-400 uppercase">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-black text-rose-500">{declinedCount}</p>
            <p className="text-[7px] font-black text-slate-400 uppercase">Rejected</p>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-black text-slate-400">{guests.length}</p>
            <p className="text-[7px] font-black text-slate-400 uppercase">Total</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-center">
            <p className="text-[14px] font-black text-emerald-600">{presentCount}</p>
            <p className="text-[7px] font-black text-slate-400 uppercase">Present</p>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-black text-amber-600">{goingCount}</p>
            <p className="text-[7px] font-black text-slate-400 uppercase">Accepted</p>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-black text-slate-400">{guests.length}</p>
            <p className="text-[7px] font-black text-slate-400 uppercase">Total</p>
          </div>
        </div>
      )}

      {/* FULL BANNER (manage only) */}
      {mode === 'manage' && full && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <p className="text-[9px] font-black text-rose-600 uppercase tracking-wider">Guest list full</p>
          <p className="text-[8px] font-bold text-rose-500 mt-0.5">{MAX_GOING} guests accepted. You can no longer accept new guests.</p>
        </div>
      )}

      {/* SEARCH (attendance only) */}
      {mode === 'attendance' && (
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guest name to check in..."
            className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 placeholder:font-medium placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
          />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">{error}</p>
      )}

      {/* LIST */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-[9px] font-black uppercase tracking-wider">Loading guests...</span>
        </div>
      ) : guests.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No RSVPs yet</p>
          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-wider mt-1">Guests appear here after they submit</p>
        </div>
      ) : mode === 'manage' ? (
        /* ================= MANAGE MODE ================= */
        <div className="space-y-2 max-h-[520px] overflow-y-auto">
          {guests.map((guest) => (
            <div key={guest.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black text-slate-800 uppercase truncate">{guest.name}</span>
                {statusBadge(guest.status)}
              </div>

              {contactBlock(guest)}

              <div className="flex items-center gap-2 pt-1">
                {guest.status !== 'going' && (
                  <button
                    onClick={() => updateStatus(guest, 'going')}
                    disabled={busyId === guest.id || full}
                    title={full ? `List full (${MAX_GOING} accepted)` : undefined}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {busyId === guest.id ? <Loader2 size={10} className="animate-spin" /> : <UserCheck size={10} />} {full ? 'List Full' : 'Accept'}
                  </button>
                )}
                {guest.status !== 'declined' && (
                  <button
                    onClick={() => updateStatus(guest, 'declined')}
                    disabled={busyId === guest.id}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all disabled:opacity-50"
                  >
                    {busyId === guest.id ? <Loader2 size={10} className="animate-spin" /> : <UserX size={10} />} Reject
                  </button>
                )}
                {guest.status && (
                  <button
                    onClick={() => updateStatus(guest, null)}
                    disabled={busyId === guest.id}
                    title="Move back to pending"
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all disabled:opacity-50"
                  >
                    {busyId === guest.id ? <Loader2 size={10} className="animate-spin" /> : <Undo2 size={10} />}
                  </button>
                )}
                <button
                  onClick={() => removeGuest(guest)}
                  disabled={busyId === guest.id}
                  className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
                  title="Remove guest permanently"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= ATTENDANCE MODE ================= */
        attendanceList.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No match found</p>
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-wider mt-1">Try a different name</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {attendanceList.map((guest) => (
              <AttendanceRow
                key={`${guest.id}-${guest.remarks || ''}-${guest.attended}`}
                guest={guest}
                busy={busyId === guest.id}
                statusBadge={statusBadge}
                onSetAttendance={setAttendance}
                onAccept={() => updateStatus(guest, 'going')}
                onReject={() => updateStatus(guest, 'declined')}
                acceptDisabled={full && guest.status !== 'going'}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

/* ---- Per-guest attendance row (local remarks editing) ---- */
function AttendanceRow({
  guest,
  busy,
  statusBadge,
  onSetAttendance,
  onAccept,
  onReject,
  acceptDisabled,
}: {
  guest: Guest;
  busy: boolean;
  statusBadge: (status: string | null) => React.ReactNode;
  onSetAttendance: (guest: Guest, attended: boolean, remarks: string) => void;
  onAccept: () => void;
  onReject: () => void;
  acceptDisabled: boolean;
}) {
  const [remarks, setRemarks] = useState(guest.remarks || '');

  const remarksDirty = remarks !== (guest.remarks || '');

  return (
    <div className={`p-3 rounded-xl border space-y-2 transition-colors ${guest.attended ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
      {/* NAME + BADGES */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-black text-slate-800 uppercase truncate">{guest.name}</span>
        <div className="flex items-center gap-1 shrink-0">
          {statusBadge(guest.status)}
          {guest.attended && (
            <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">Present</span>
          )}
        </div>
      </div>

      {/* REMARKS */}
      <div className="space-y-1">
        <label className="text-[8px] font-black uppercase tracking-wider text-slate-400">Remarks</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. +1 baby, 2 small kids, or proxy for..."
            className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg font-bold text-[11px] text-slate-800 placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
          />
          {remarksDirty && (
            <button
              onClick={() => onSetAttendance(guest, guest.attended, remarks)}
              disabled={busy}
              title="Save remarks"
              className="px-3 rounded-lg bg-slate-900 text-white hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center"
            >
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            </button>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 pt-1">
        {!guest.attended ? (
          <button
            onClick={() => onSetAttendance(guest, true, remarks)}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
          >
            {busy ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle2 size={10} />} Mark Present
          </button>
        ) : (
          <button
            onClick={() => onSetAttendance(guest, false, remarks)}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            {busy ? <Loader2 size={10} className="animate-spin" /> : <Undo2 size={10} />} Undo Present
          </button>
        )}

        {/* Accept / reject still available during the event */}
        {guest.status !== 'going' && (
          <button
            onClick={onAccept}
            disabled={busy || acceptDisabled}
            title={acceptDisabled ? 'Guest list full' : 'Accept'}
            className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserCheck size={10} />
          </button>
        )}
        {guest.status !== 'declined' && (
          <button
            onClick={onReject}
            disabled={busy}
            title="Reject"
            className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg text-[8px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all disabled:opacity-50"
          >
            <UserX size={10} />
          </button>
        )}
      </div>
    </div>
  );
}
