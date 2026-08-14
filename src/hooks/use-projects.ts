import { useEffect, useState } from "react";
import {
  getProjects,
  subscribeProjects,
  type Project,
} from "@/lib/firestore/projects";
import { projects as initialStaticProjects } from "@/data/projects";

export function useProjects(): Project[] {
  const [projects, setProjects] = useState<Project[]>(initialStaticProjects);

  useEffect(() => {
    let active = true;

    // Initial fetch
    void getProjects().then((items) => {
      if (active && items.length > 0) {
        setProjects(items);
      }
    });

    // Real-time Firestore subscription
    const unsubscribe = subscribeProjects((items) => {
      if (active && items.length > 0) {
        setProjects(items);
      }
    });

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return projects;
}
