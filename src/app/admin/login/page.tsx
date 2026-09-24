"use client";

import { FormEvent, useState } from "react";
import { BookOpen, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Unable to sign in.");
    else {
      router.push(params.get("next") || "/admin");
      router.refresh();
    }
    setBusy(false);
  }
  return (
    <main className="grid min-h-screen bg-[#102a43] lg:grid-cols-[1.1fr_.9fr]">
      <section className="hidden flex-col justify-between bg-[#163b59] p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#d7a94b] text-[#102a43]">
            <BookOpen size={22} />
          </span>
          <strong className="text-xl">Safha Admin</strong>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[.2em] text-[#d7a94b]">
            Quietly powerful tools
          </p>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.05] tracking-tight">
            Run the bookshop with clarity.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
            Manage your catalogue, fulfilment, customers, and store settings
            from one focused workspace.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[.16em] text-slate-500">
          Karachi · Pakistan
        </p>
      </section>
      <section className="flex items-center justify-center bg-[#f4f6f8] p-6 sm:p-12">
        <form onSubmit={submit} className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <BookOpen className="text-[#d09830]" size={28} />
            <h1 className="mt-4 text-3xl font-semibold text-[#102a43]">
              Safha Admin
            </h1>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#d09830]">
            Secure workspace
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#102a43]">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with your administrator account.
          </p>
          <label className="mt-8 block text-sm font-medium text-slate-700">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="username"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#d09830] focus:ring-2 focus:ring-[#d7a94b]/20"
            />
          </label>
          <label className="mt-5 block text-sm font-medium text-slate-700">
            Password
            <div className="relative mt-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 outline-none focus:border-[#d09830] focus:ring-2 focus:ring-[#d7a94b]/20"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#102a43] px-4 py-3.5 font-semibold text-white transition hover:bg-[#163b59] disabled:opacity-60"
          >
            {busy && <Loader2 size={17} className="animate-spin" />}
            <LockKeyhole size={17} /> Sign in to admin
          </button>
          <p className="mt-5 text-center text-xs text-slate-400">
            Access is restricted to existing administrators.
          </p>
        </form>
      </section>
    </main>
  );
}
