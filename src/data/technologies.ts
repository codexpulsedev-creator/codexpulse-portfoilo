export type TechGroup = {
  group: string;
  items: string[];
};

/** Edit this list as the stack we actually work with changes. */
export const technologies: TechGroup[] = [
  {
    group: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Java", "Spring Boot", "PHP", "Laravel", "REST APIs"],
  },
  {
    group: "Mobile",
    items: ["Flutter", "Kotlin"],
  },
  {
    group: "Data",
    items: ["MongoDB", "MySQL", "PostgreSQL"],
  },
  {
    group: "Tooling",
    items: ["Git", "Docker"],
  },
];
