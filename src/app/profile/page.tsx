import type { Metadata } from "next";
import ProfileEditor from "@/components/seeker/ProfileEditor";

export const metadata: Metadata = {
  title: "My Profile — OnPoint Talent",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileEditor />;
}
