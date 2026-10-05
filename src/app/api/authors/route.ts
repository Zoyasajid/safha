import { NextResponse } from "next/server";
import { readFirestoreAuthors } from "@/lib/admin/firestore-authors";

export async function GET() {
  try {
    const authors = (await readFirestoreAuthors()).filter(
      (author) => author.status === "active",
    );
    return NextResponse.json({ authors });
  } catch (error) {
    console.error("Failed to read authors from Firebase:", error);
    return NextResponse.json(
      { error: "Unable to load authors." },
      { status: 500 },
    );
  }
}
