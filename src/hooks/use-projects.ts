import { projects, type Project } from "@/data/projects";

export function useProjects(): Project[] {
  return projects;
}
