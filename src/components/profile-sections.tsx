import { Pencil, Plus } from "lucide-react";

import { Monogram } from "@/components/brand";
import { AddSectionButton, EditProfileButton } from "@/components/profile-ui";
import { SectionCard } from "@/components/ui";
import type {
  Certification,
  Education,
  Experience,
  Language,
} from "@/db/schema";
import {
  durationInMonths,
  formatDuration,
  formatPeriod,
  formatYearRange,
} from "@/lib/format";

type ExperienceGroup = {
  company: string;
  initials: string;
  color: string;
  roles: Experience[];
  totalMonths: number;
};

function groupExperiences(experiences: Experience[]): ExperienceGroup[] {
  const groups: ExperienceGroup[] = [];

  for (const experience of experiences) {
    const existing = groups.find((group) => group.company === experience.company);
    if (existing) {
      existing.roles.push(experience);
      existing.totalMonths += durationInMonths(
        experience.startYear,
        experience.startMonth,
        experience.endYear,
        experience.endMonth,
      );
    } else {
      groups.push({
        company: experience.company,
        initials: experience.companyInitials,
        color: experience.companyColor,
        roles: [experience],
        totalMonths: durationInMonths(
          experience.startYear,
          experience.startMonth,
          experience.endYear,
          experience.endMonth,
        ),
      });
    }
  }

  return groups;
}

function RoleDetails({ experience }: { experience: Experience }) {
  const period = formatPeriod(
    experience.startMonth,
    experience.startYear,
    experience.endMonth,
    experience.endYear,
    experience.isCurrent,
  );

  return (
    <div className="min-w-0 flex-1">
      <h3 className="text-base leading-snug font-semibold text-ink">{experience.title}</h3>
      <p className="text-sm text-ink">
        {experience.company}
        <span className="text-ink-muted"> · {experience.employmentType}</span>
      </p>
      <p className="text-sm text-ink-muted">
        {period.range} · {period.duration}
      </p>
      {experience.location ? (
        <p className="text-sm text-ink-muted">
          {experience.location}
          {experience.workMode ? ` · ${experience.workMode}` : ""}
        </p>
      ) : null}

      {experience.description ? (
        <p className="li-body-text mt-2 text-sm whitespace-pre-line">{experience.description}</p>
      ) : null}

      {experience.skills.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {experience.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-semibold text-ink-muted"
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const groups = groupExperiences(experiences);

  return (
    <SectionCard
      id="experiencia"
      title="Experiência"
      actions={
        <>
          <AddSectionButton className="li-icon-btn" label="Adicionar seção">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </AddSectionButton>
          <EditProfileButton className="li-icon-btn" label="Editar seção Experiência">
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </EditProfileButton>
        </>
      }
      bodyClassName="pt-2"
    >
      <div className="divide-y divide-hairline">
        {groups.map((group) => (
          <div key={group.company} className="py-4 first:pt-2">
            <div className="flex gap-3">
              <Monogram initials={group.initials} color={group.color} />

              {group.roles.length === 1 ? (
                <RoleDetails experience={group.roles[0]} />
              ) : (
                <div className="min-w-0 flex-1">
                  <h3 className="text-base leading-snug font-semibold text-ink">{group.company}</h3>
                  <p className="text-sm text-ink-muted">
                    {formatDuration(group.totalMonths)} no total
                  </p>
                </div>
              )}
            </div>

            {group.roles.length > 1 ? (
              <div className="mt-3 space-y-4 border-l border-hairline pl-4 sm:ml-[60px]">
                {group.roles.map((role) => (
                  <div key={role.id}>
                    <RoleDetails experience={role} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function EducationSection({ education }: { education: Education[] }) {
  return (
    <SectionCard
      id="formacao"
      title="Formação acadêmica"
      actions={
        <>
          <AddSectionButton className="li-icon-btn" label="Adicionar seção">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </AddSectionButton>
          <EditProfileButton className="li-icon-btn" label="Editar seção Formação acadêmica">
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </EditProfileButton>
        </>
      }
      bodyClassName="pt-2"
    >
      <div className="divide-y divide-hairline">
        {education.map((item) => (
          <div key={item.id} className="flex gap-3 py-4 first:pt-2">
            <Monogram initials={item.monogram} color={item.color} />
            <div className="min-w-0">
              <h3 className="text-base leading-snug font-semibold text-ink">{item.school}</h3>
              <p className="text-sm text-ink">
                {item.degree}
                {item.field ? <span className="text-ink-muted"> · {item.field}</span> : null}
              </p>
              <p className="text-sm text-ink-muted">{formatYearRange(item.startYear, item.endYear)}</p>
              {item.description ? (
                <p className="li-body-text mt-1.5 text-sm">{item.description}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function CertificationsSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  return (
    <SectionCard
      title="Licenças e certificados"
      actions={
        <>
          <AddSectionButton className="li-icon-btn" label="Adicionar seção">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </AddSectionButton>
          <EditProfileButton className="li-icon-btn" label="Editar licenças e certificados">
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </EditProfileButton>
        </>
      }
      bodyClassName="pt-2"
    >
      <div className="divide-y divide-hairline">
        {certifications.map((item) => (
          <div key={item.id} className="flex gap-3 py-4 first:pt-2">
            <Monogram initials={item.monogram} color={item.color} />
            <div className="min-w-0">
              <h3 className="text-base leading-snug font-semibold text-ink">{item.name}</h3>
              <p className="text-sm text-ink">{item.issuer}</p>
              <p className="text-sm text-ink-muted">Emitido em {item.issuedAt}</p>
              {item.credentialId ? (
                <p className="mt-1 text-sm text-ink-muted">
                  Código da credencial: <span className="font-medium text-ink">{item.credentialId}</span>
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function LanguagesSection({ languages }: { languages: Language[] }) {
  return (
    <SectionCard
      title="Idiomas"
      actions={
        <EditProfileButton className="li-icon-btn" label="Adicionar idioma">
          <Plus className="h-4 w-4" aria-hidden="true" />
        </EditProfileButton>
      }
      bodyClassName="pt-2"
    >
      <ul className="divide-y divide-hairline">
        {languages.map((language) => (
          <li key={language.id} className="py-3 first:pt-1">
            <p className="text-base font-semibold text-ink">{language.name}</p>
            <p className="text-sm text-ink-muted">{language.level}</p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
