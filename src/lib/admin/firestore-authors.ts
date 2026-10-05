import {
  getFirebaseAdminDb,
  isFirebaseAdminConfigured,
} from "@/lib/firebase-admin";
import type { AdminAuthor } from "@/lib/admin/types";

function normalizeDate(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value) {
    const toDate = (value as { toDate?: () => Date }).toDate;
    if (typeof toDate === "function") return toDate.call(value).toISOString();
  }
  return new Date(0).toISOString();
}

function normalizeAuthor(
  id: string,
  raw: Record<string, unknown>,
): AdminAuthor {
  return {
    id: typeof raw.id === "string" ? raw.id : id,
    slug: typeof raw.slug === "string" ? raw.slug : "",
    name: typeof raw.name === "string" ? raw.name : "",
    nameUrdu: typeof raw.nameUrdu === "string" ? raw.nameUrdu : undefined,
    bio: typeof raw.bio === "string" ? raw.bio : "",
    location: typeof raw.location === "string" ? raw.location : "Pakistan",
    image: typeof raw.image === "string" ? raw.image : undefined,
    coverTone: typeof raw.coverTone === "string" ? raw.coverTone : "#315264",
    status: raw.status === "inactive" ? "inactive" : "active",
    createdAt: normalizeDate(raw.createdAt),
  };
}

function withoutUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, field]) => field !== undefined),
  );
}

export async function readFirestoreAuthors(): Promise<AdminAuthor[]> {
  if (!isFirebaseAdminConfigured()) return [];
  const snapshot = await getFirebaseAdminDb().collection("authors").get();
  return snapshot.docs
    .map((doc) => normalizeAuthor(doc.id, doc.data()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function readFirestoreAuthorBySlug(
  slug: string,
): Promise<AdminAuthor | null> {
  if (!isFirebaseAdminConfigured()) return null;
  const snapshot = await getFirebaseAdminDb()
    .collection("authors")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const doc = snapshot.docs[0];
  return doc ? normalizeAuthor(doc.id, doc.data()) : null;
}

export async function readFirestoreAuthorById(
  id: string,
): Promise<AdminAuthor | null> {
  if (!isFirebaseAdminConfigured()) return null;
  const doc = await getFirebaseAdminDb().collection("authors").doc(id).get();
  return doc.exists ? normalizeAuthor(doc.id, doc.data() ?? {}) : null;
}

export async function createFirestoreAuthor(
  author: Omit<AdminAuthor, "id">,
): Promise<AdminAuthor> {
  const collection = getFirebaseAdminDb().collection("authors");
  const ref = collection.doc(author.slug);
  const item = { ...author, id: ref.id };
  await ref.create(withoutUndefined(item));
  return item;
}

export async function updateFirestoreAuthor(
  id: string,
  update: Omit<AdminAuthor, "id" | "createdAt">,
): Promise<AdminAuthor | null> {
  const ref = getFirebaseAdminDb().collection("authors").doc(id);
  const snapshot = await ref.get();
  if (!snapshot.exists) return null;
  const item = normalizeAuthor(snapshot.id, snapshot.data() ?? {});
  const updated = { ...item, ...update, id: snapshot.id };
  await ref.set(withoutUndefined(updated));
  return updated;
}

export async function deleteFirestoreAuthor(id: string): Promise<boolean> {
  const ref = getFirebaseAdminDb().collection("authors").doc(id);
  const snapshot = await ref.get();
  if (!snapshot.exists) return false;
  await ref.delete();
  return true;
}
