import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { ensureSeeded, PROFILE_SLUG } from "@/db/seed";
import {
  activities,
  certifications,
  education,
  experiences,
  languages,
  peopleSuggestions,
  profiles,
  skills,
  type Activity,
  type Certification,
  type Education,
  type Experience,
  type Language,
  type PersonSuggestion,
  type Profile,
  type Skill,
} from "@/db/schema";

export type ProfilePageData = {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  languages: Language[];
  activities: Activity[];
  suggestions: PersonSuggestion[];
};

export async function getProfilePageData(): Promise<ProfilePageData> {
  await ensureSeeded();

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.slug, PROFILE_SLUG))
    .limit(1);

  if (!profile) {
    throw new Error("Perfil não encontrado.");
  }

  const [
    experienceRows,
    educationRows,
    certificationRows,
    skillRows,
    languageRows,
    activityRows,
    suggestionRows,
  ] = await Promise.all([
    db
      .select()
      .from(experiences)
      .where(eq(experiences.profileId, profile.id))
      .orderBy(asc(experiences.position)),
    db
      .select()
      .from(education)
      .where(eq(education.profileId, profile.id))
      .orderBy(asc(education.position)),
    db
      .select()
      .from(certifications)
      .where(eq(certifications.profileId, profile.id))
      .orderBy(asc(certifications.position)),
    db
      .select()
      .from(skills)
      .where(eq(skills.profileId, profile.id))
      .orderBy(asc(skills.position)),
    db
      .select()
      .from(languages)
      .where(eq(languages.profileId, profile.id))
      .orderBy(asc(languages.position)),
    db
      .select()
      .from(activities)
      .where(eq(activities.profileId, profile.id))
      .orderBy(asc(activities.position)),
    db.select().from(peopleSuggestions).orderBy(asc(peopleSuggestions.position)),
  ]);

  return {
    profile,
    experiences: experienceRows,
    education: educationRows,
    certifications: certificationRows,
    skills: skillRows,
    languages: languageRows,
    activities: activityRows,
    suggestions: suggestionRows,
  };
}

export async function getPrimaryProfile(): Promise<Profile> {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.slug, PROFILE_SLUG))
    .limit(1);

  if (!profile) throw new Error("Perfil não encontrado.");
  return profile;
}
