import { AboutCard } from "@/components/about-card";
import { ActivitySection } from "@/components/activity-section";
import { AdCard } from "@/components/ad-card";
import { AnalyticsCard } from "@/components/analytics-card";
import { ProfileCard } from "@/components/profile-card";
import { ProfileFooter } from "@/components/profile-footer";
import { ProfileHeader, type SearchItem } from "@/components/profile-header";
import { ProfileSubnav } from "@/components/profile-subnav";
import { ProfileUIProvider } from "@/components/profile-ui";
import {
  CertificationsSection,
  EducationSection,
  ExperienceSection,
  LanguagesSection,
} from "@/components/profile-sections";
import { SkillsCard } from "@/components/skills-card";
import { SuggestionsCard } from "@/components/suggestions-card";
import { getProfilePageData } from "@/lib/profile-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const {
    profile,
    experiences,
    education,
    certifications,
    skills,
    languages,
    activities,
    suggestions,
  } = await getProfilePageData();

  const currentCompany = experiences.find((item) => item.isCurrent) ?? experiences[0] ?? null;
  const currentSchool = education[0] ?? null;

  const searchItems: SearchItem[] = [
    {
      id: "profile",
      label: profile.name,
      detail: profile.headline,
      group: "Perfil",
      href: "#top",
    },
    ...experiences.map((item) => ({
      id: `exp-${item.id}`,
      label: `${item.title} · ${item.company}`,
      detail: "Experiência profissional",
      group: "Experiência",
      href: "#experiencia",
    })),
    ...skills.map((item) => ({
      id: `skill-${item.id}`,
      label: item.name,
      detail: "Competência",
      group: "Competência",
      href: "#competencias",
    })),
    ...education.map((item) => ({
      id: `edu-${item.id}`,
      label: item.school,
      detail: item.degree,
      group: "Formação",
      href: "#formacao",
    })),
    ...certifications.map((item) => ({
      id: `cert-${item.id}`,
      label: item.name,
      detail: item.issuer,
      group: "Certificado",
      href: "#formacao",
    })),
    ...suggestions.map((item) => ({
      id: `person-${item.id}`,
      label: item.name,
      detail: item.headline,
      group: "Pessoas",
      href: "#pessoas",
    })),
  ];

  return (
    <ProfileUIProvider
      profile={{
        name: profile.name,
        pronouns: profile.pronouns,
        headline: profile.headline,
        location: profile.location,
        about: profile.about,
        email: profile.email,
        phone: profile.phone,
        website: profile.website,
        websiteLabel: profile.websiteLabel,
        birthday: profile.birthday,
        avatarUrl: profile.avatarUrl,
      }}
    >
      <div className="min-h-screen pb-2">
        <ProfileHeader
          profile={{
            name: profile.name,
            headline: profile.headline,
            avatarUrl: profile.avatarUrl,
          }}
          searchItems={searchItems}
        />

        <ProfileSubnav
          name={profile.name}
          avatarUrl={profile.avatarUrl}
          headline={profile.headline}
        />

        <main className="mx-auto max-w-[1128px] px-3 pt-3 sm:px-6 sm:pt-6">
          <div className="grid items-start gap-2.5 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
            <div className="min-w-0 space-y-2.5 sm:space-y-3">
              <ProfileCard
                name={profile.name}
                pronouns={profile.pronouns}
                headline={profile.headline}
                location={profile.location}
                avatarUrl={profile.avatarUrl}
                coverUrl={profile.coverUrl}
                followers={profile.followers}
                connections={profile.connections}
                openToWork={profile.openToWork}
                currentCompany={
                  currentCompany
                    ? {
                        company: currentCompany.company,
                        initials: currentCompany.companyInitials,
                        color: currentCompany.companyColor,
                      }
                    : null
                }
                currentSchool={
                  currentSchool
                    ? {
                        school: currentSchool.school,
                        monogram: currentSchool.monogram,
                        color: currentSchool.color,
                      }
                    : null
                }
              />

              <AnalyticsCard
                profileViews={profile.profileViews}
                postImpressions={profile.postImpressions}
                searchAppearances={profile.searchAppearances}
              />

              <AboutCard about={profile.about} />

              <ActivitySection
                profile={{
                  name: profile.name,
                  headline: profile.headline,
                  avatarUrl: profile.avatarUrl,
                }}
                followers={profile.followers}
                activities={activities.map((activity) => ({
                  id: activity.id,
                  kind: activity.kind,
                  body: activity.body,
                  hashtags: activity.hashtags,
                  postedAgo: activity.postedAgo,
                  visibility: activity.visibility,
                  likes: activity.likes,
                  comments: activity.comments,
                  reposts: activity.reposts,
                  likedByMe: activity.likedByMe,
                }))}
              />

              <ExperienceSection experiences={experiences} />

              <EducationSection education={education} />

              <CertificationsSection certifications={certifications} />

              <SkillsCard key={skills.map((skill) => skill.id).join("-")} skills={skills} />

              <LanguagesSection languages={languages} />
            </div>

            <aside className="min-w-0 space-y-2.5 sm:space-y-3 lg:sticky lg:top-[116px]">
              <SuggestionsCard people={suggestions} />
              <AdCard />
            </aside>
          </div>

          <ProfileFooter />
        </main>
      </div>
    </ProfileUIProvider>
  );
}
