"use server";

import { createServerFn } from "@tanstack/react-start";
import { put, list } from "@vercel/blob";

export const getBlobProjects = createServerFn({ method: "GET" })
  .handler(async () => {
    // If BLOB_READ_WRITE_TOKEN is not configured, we fail gracefully
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("BLOB_READ_WRITE_TOKEN is not configured. Falling back to local projects.");
      return null;
    }

    try {
      const { blobs } = await list();
      const blob = blobs.find((b) => b.pathname === "custom-projects.json");
      if (!blob) {
        return null;
      }
      
      const res = await fetch(blob.url, { cache: "no-store" });
      if (!res.ok) return null;
      
      return await res.json();
    } catch (e) {
      console.error("Error fetching projects from Vercel Blob:", e);
      return null;
    }
  });

export const saveBlobProjects = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!Array.isArray(data)) {
      throw new Error("Invalid projects data, expected array");
    }
    return data;
  })
  .handler(async ({ data: projects }) => {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not configured in Vercel. Cannot publish projects.");
    }

    try {
      const blob = await put("custom-projects.json", JSON.stringify(projects), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return { success: true, url: blob.url };
    } catch (e) {
      console.error("Error saving projects to Vercel Blob:", e);
      return { success: false, error: String(e) };
    }
  });
