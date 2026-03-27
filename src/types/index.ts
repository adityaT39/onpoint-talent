export type Job = {
  id: string;
  employerId: string | null;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  requiredSkills?: string[];
  applyUrl?: string;
  postedAt: string;
};

export type WorkExperience = {
  role: string;
  company: string;
  duration: string;      // free text e.g. "2021 – 2023"
  description: string;
};

export type Education = {
  degree: string;
  institution: string;
  year: string;
};

export type SeekerProfile = {
  userId: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  resumeName: string;
  resumeUrl: string;     // Supabase Storage path (replaces base64 resumeData)
  updatedAt: string;
};

export type SavedJob = {
  id: string;
  seekerId: string;
  jobId: string;
  savedAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  employerId: string | null;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  // structured profile
  phone: string;
  location: string;          // city / region
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];          // parsed from comma-separated input
  // existing fields
  coverLetter: string;
  resumeName?: string;
  resumeUrl?: string;        // Supabase Storage path (replaces base64 resumeData)
  appliedAt: string;         // ISO
  status: "pending" | "interview" | "rejected";
};
