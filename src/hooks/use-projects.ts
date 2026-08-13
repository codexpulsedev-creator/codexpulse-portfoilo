import { useEffect, useState } from "react";
import {
  fetchPublishedCustomProjects,
  getAllProjectsSync,
  mergeProjects,
  readLocalCustomProjects,
  staticProjects,
  type Project,
} from "@/lib/custom-projects";

function readLocalCustomProjectsSafe(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    return readLocalCustomProjects();
  } catch {
    return [];
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() =>
    typeof window === "undefined" ? staticProjects : getAllProjectsSync(),
  );

  useEffect(() => {
    let active = true;

    async function load() {
      const published = await fetchPublishedCustomProjects();
      if (!active) return;
      setProjects(mergeProjects(published, readLocalCustomProjectsSafe()));
    }

    void load();

    const onStorage = (event: StorageEvent) => {
      if (event.key === "codexpulse-custom-projects") {
        void load();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return projects;
}
