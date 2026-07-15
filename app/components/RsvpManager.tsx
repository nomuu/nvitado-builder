"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { UserCheck, Clock, Trash2, Plus, Loader2, Link2, Mail, Phone, RefreshCw } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  status: string | null;
  fb_link: string | null;
  email: string | null;
  contact: string | null;
}

const errMsg = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

const MAX_GOING = 100;

export default function RsvpManager({ invitationId }: { invitationId: string }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

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

  const removeGuest = async (guest: Guest) => {
    if (!window.confirm(`Remove "${guest.name}" from your guest list?`)) return;
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

  const addGuest = async () => {
    const name = newName.trim();
    if (!name) return;
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
    if (guests.some((g) => norm(g.name) === norm(name))) {
      setError('That guest is already on the list.');
      return;
    }
    setAdding(true);
    setError('');
    try {
      const data = await post({ name, status: 'going', action: 'owner_add' });
      if (data.guest) {
        setGuests((prev) => [...prev, data.guest as Guest]);
      } else {
        await load();
      }
      setNewName('');
    } catch (e) {
      setError(errMsg(e, 'Could not add guest'));
    } finally {
      setAdding(false);
    }
  };

  const goingCount = guests.filter((g) => g.status === 'going').length;
  const pendingCount = guests.filter((g) => !g.status).length;
  const full = goingCount >= MAX_GOING;

  return (
    <div className="space-y-4">
      {/* HEADER + STATS */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Guest List</label>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-all disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={11} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
        <div className="text-center">
          <p className={`text-[14px] font-black ${full ? 'text-rose-500' : 'text-emerald-600'}`}>{goingCount}<span className="text-[9px] text-slate-400">/{MAX_GOING}</span></p>
          <p className="text-[7px] font-black text-slate-400 uppercase">Going</p>
        </div>
        <div className="text-center">
          <p className="text-[14px] font-black text-amber-600">{pendingCount}</p>
          <p className="text-[7px] font-black text-slate-400 uppercase">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-[14px] font-black text-slate-400">{guests.length}</p>
          <p className="text-[7px] font-black text-slate-400 uppercase">Total</p>
        </div>
      </div>

      {/* FULL BANNER */}
      {full && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <p className="text-[9px] font-black text-rose-600 uppercase tracking-wider">Guest list full</p>
          <p className="text-[8px] font-bold text-rose-500 mt-0.5">{MAX_GOING} guests confirmed. New RSVPs are now closed.</p>
        </div>
      )}

      {/* ADD GUEST */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => { setNewName(e.target.value); setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') addGuest(); }}
          placeholder="Add guest name..."
          className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 uppercase placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
        />
        <button
          onClick={addGuest}
          disabled={adding || !newName.trim() || full}
          className="px-4 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {adding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
        </button>
      </div>

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
      ) : (
        <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar">
          {guests.map((guest) => (
            <div key={guest.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              {/* NAME + STATUS BADGE */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black text-slate-800 uppercase truncate">{guest.name}</span>
                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                  guest.status === 'going' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {guest.status === 'going' ? 'Going' : 'Pending'}
                </span>
              </div>

              {/* CONTACT INFO */}
              {(guest.fb_link || guest.email || guest.contact) && (
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
              )}

              {/* ACTIONS */}
              <div className="flex items-center gap-2 pt-1">
                {guest.status === 'going' ? (
                  <button
                    onClick={() => updateStatus(guest, null)}
                    disabled={busyId === guest.id}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all disabled:opacity-50"
                  >
                    {busyId === guest.id ? <Loader2 size={10} className="animate-spin" /> : <Clock size={10} />} Set Pending
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(guest, 'going')}
                    disabled={busyId === guest.id || full}
                    title={full ? `List full (${MAX_GOING} confirmed)` : undefined}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {busyId === guest.id ? <Loader2 size={10} className="animate-spin" /> : <UserCheck size={10} />} {full ? 'List Full' : 'Confirm Going'}
                  </button>
                )}
                <button
                  onClick={() => removeGuest(guest)}
                  disabled={busyId === guest.id}
                  className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
                  title="Remove guest"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
