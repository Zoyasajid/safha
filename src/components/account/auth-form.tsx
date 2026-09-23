"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { useStore } from "@/context/store-context";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "register") {
      register({ name: name || "Safha reader", email });
    } else {
      login({ name: name || email.split("@")[0], email });
    }
    router.push("/account");
  }

  return (
    <Container className="max-w-md py-16">
      <h1 className="font-serif text-4xl">{mode === "login" ? "Sign in" : "Create account"}</h1>
      <p className="mt-2 text-sm text-ink-muted">
        A local account on this device — ready to connect to a real backend later.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {mode === "register" ? (
          <input
            className="select"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        ) : (
          <input
            className="select"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="select"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="select"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" className="btn-primary w-full">
          {mode === "login" ? "Sign in" : "Register"}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink-muted">
        {mode === "login" ? (
          <>
            New to Safha?{" "}
            <Link href="/register" className="text-ink underline decoration-gold">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-ink underline decoration-gold">
              Sign in
            </Link>
          </>
        )}
      </p>
    </Container>
  );
}
