export type Job = {
  id: string;
  employerId: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  requiredSkills?: string[];
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
  resumeName: string;
  resumeData: string;   // base64 data URI
  updatedAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  employerId: string;
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
  resumeData?: string;       // "data:application/pdf;base64,..."
  appliedAt: string;         // ISO
  status: "pending" | "interview" | "rejected";
};
