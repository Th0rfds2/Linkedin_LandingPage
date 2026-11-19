"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  MoreHorizontal,
  Pencil,
  Share2,
  Sparkles,
} from "lucide-react";

import { Monogram } from "@/components/brand";
import {
  AddSectionButton,
  ContactInfoTrigger,
  EditProfileButton,
  useProfileUI,
} from "@/components/profile-ui";
import { formatConnections, formatFollowers } from "@/lib/format";

type CurrentCompany = { company: string; initials: string; color: string } | null;
type CurrentSchool = { school: string; monogram: string; color: string } | null;

export function ProfileCard({
  name,
  pronouns,
  headline,
  location,
  avatarUrl,
  coverUrl,
  followers,
  connections,
  openToWork,
  currentCompany,
  currentSchool,
}: {
  name: string;
  pronouns: string | null;
  headline: string;
  location: string;
  avatarUrl: string;
  coverUrl: string | null;
  followers: number;
  connections: number;
  openToWork: boolean;
  currentCompany: CurrentCompany;
  currentSchool: CurrentSchool;
}) {
  const { openContact, notify } = useProfileUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify("Link do perfil copiado.");
    } catch {
      notify("Não foi possível copiar o link.");
    }
    setMenuOpen(false);
  };

  return (
    <section id="top" aria-label="Apresentação do perfil" className="li-card relative scroll-mt-28">
      <div className="relative h-[110px] overflow-hidden bg-[#9db4c0] sm:h-[200px]">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 792px"
            className="object-cover"
          />
        ) : null}
        {openToWork ? (
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-[#01754f] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            #OpenToWork
          </span>
        ) : null}
      </div>

      <div className="px-4 pb-5 sm:px-6 sm:pb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="relative -mt-[52px] sm:-mt-[96px]">
            <div
              className={`relative h-[104px] w-[104px] overflow-hidden rounded-full bg-white ring-4 sm:h-[152px] sm:w-[152px] ${
                openToWork ? "ring-[#01754f]" : "ring-white"
              }`}
            >
              <Image
                src={avatarUrl}
                alt={`Foto de perfil de ${name}`}
                fill
                priority
                sizes="152px"
                className="object-cover"
              />
            </div>
          </div>

          <div
            ref={menuRef}
            className="relative hidden flex-wrap items-center justify-end gap-2 pt-3 sm:flex sm:pt-4"
          >
            <AddSectionButton className="li-btn li-btn-primary" />
            <EditProfileButton className="li-btn li-btn-outline" label="Editar perfil">
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Editar perfil
            </EditProfileButton>
            <button
              type="button"
              aria-label="Mais ações do perfil"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-muted text-ink-muted transition hover:bg-black/5 hover:text-ink"
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>

            {menuOpen ? (
              <div className="animate-slide-up absolute top-12 right-0 z-40 w-[236px] overflow-hidden rounded-lg border border-hairline bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                <button
                  type="button"
                  onClick={copyProfileLink}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-ink hover:bg-surface-hover"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" /> Compartilhar perfil
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openContact();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-ink hover:bg-surface-hover"
                >
                  <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" /> Informações de contato
                </button>
                <div className="mt-1 border-t border-hairline px-4 py-2 text-xs text-ink-muted">
                  Perfil visualizado publicamente
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-3 sm:mt-4">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h1 className="text-[22px] leading-tight font-semibold text-ink sm:text-2xl">{name}</h1>
            {pronouns ? <span className="text-base text-ink-muted">({pronouns})</span> : null}
          </div>

          <p className="mt-1 max-w-[640px] text-base leading-snug text-ink">{headline}</p>

          <p className="mt-1.5 text-sm text-ink-muted">
            {location}
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
            <ContactInfoTrigger />
          </p>

          <p className="mt-2 text-sm">
            <a href="#pessoas" className="li-link">
              {formatConnections(connections)}
            </a>
            <span className="mx-1.5 text-ink-faint" aria-hidden="true">
              ·
            </span>
            <a href="#atividades" className="li-link">
              {formatFollowers(followers)} seguidores
            </a>
          </p>

          {openToWork ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[#e8f3ec] px-2.5 py-1 text-[13px] font-semibold text-[#01754f]">
              <span className="h-2 w-2 rounded-full bg-[#01754f]" aria-hidden="true" />
              Aberta para novas oportunidades
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col gap-2.5 border-t border-hairline pt-4">
          {currentCompany ? (
            <a
              href="#experiencia"
              className="flex w-fit items-center gap-2 text-sm font-semibold text-ink hover:text-linkedin"
            >
              <Monogram
                initials={currentCompany.initials}
                color={currentCompany.color}
                className="h-6 w-6 rounded-[3px] text-[10px]"
              />
              {currentCompany.company}
            </a>
          ) : null}
          {currentSchool ? (
            <a
              href="#formacao"
              className="flex w-fit items-center gap-2 text-sm font-semibold text-ink hover:text-linkedin"
            >
              <Monogram
                initials={currentSchool.monogram}
                color={currentSchool.color}
                className="h-6 w-6 rounded-[3px] text-[10px]"
              />
              {currentSchool.school}
            </a>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 sm:hidden">
          <AddSectionButton className="li-btn li-btn-primary flex-1" />
          <EditProfileButton className="li-btn li-btn-outline flex-1" label="Editar perfil">
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Editar perfil
          </EditProfileButton>
          <button
            type="button"
            className="li-btn li-btn-outline px-2.5"
            aria-label="Informações de contato"
            onClick={openContact}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
