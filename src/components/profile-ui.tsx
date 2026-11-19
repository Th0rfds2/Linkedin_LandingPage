"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Cake, CheckCircle2, Link2, Mail, MapPin, Phone, X } from "lucide-react";

import { cn } from "@/lib/cn";

export type EditableProfile = {
  name: string;
  pronouns: string | null;
  headline: string;
  location: string;
  about: string;
  email: string;
  phone: string;
  website: string | null;
  websiteLabel: string | null;
  birthday: string | null;
  avatarUrl: string;
};

type ProfileUIContextValue = {
  openEdit: () => void;
  openContact: () => void;
  openAddSection: () => void;
  notify: (message: string) => void;
};

const ProfileUIContext = createContext<ProfileUIContextValue | null>(null);

export function useProfileUI(): ProfileUIContextValue {
  const context = useContext(ProfileUIContext);
  if (!context) {
    throw new Error("useProfileUI deve ser usado dentro de ProfileUIProvider.");
  }
  return context;
}

export function ProfileUIProvider({
  profile,
  children,
}: {
  profile: EditableProfile;
  children: ReactNode;
}) {
  const router = useRouter();
  const [modal, setModal] = useState<"edit" | "contact" | "section" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const value = useMemo<ProfileUIContextValue>(
    () => ({
      openEdit: () => setModal("edit"),
      openContact: () => setModal("contact"),
      openAddSection: () => setModal("section"),
      notify,
    }),
    [notify],
  );

  const close = () => setModal(null);

  return (
    <ProfileUIContext.Provider value={value}>
      {children}

      {modal === "contact" ? <ContactInfoModal profile={profile} onClose={close} /> : null}

      {modal === "edit" ? (
        <EditProfileModal
          profile={profile}
          onClose={close}
          onSaved={() => {
            close();
            notify("Perfil atualizado com sucesso.");
            router.refresh();
          }}
        />
      ) : null}

      {modal === "section" ? (
        <AddSectionModal
          onClose={close}
          onSaved={(message) => {
            close();
            notify(message);
            router.refresh();
          }}
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="animate-fade-in fixed bottom-6 left-1/2 z-[130] flex max-w-[92vw] -translate-x-1/2 items-center gap-2 rounded-lg bg-[#1d2226] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.24)]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#7fc15e]" aria-hidden="true" />
          {toast}
        </div>
      ) : null}
    </ProfileUIContext.Provider>
  );
}

function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 cursor-default bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-slide-up relative flex max-h-[88vh] w-full max-w-[560px] flex-col overflow-hidden rounded-lg bg-white shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-3 sm:px-6">
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <button type="button" className="li-icon-btn" onClick={onClose} aria-label="Fechar">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4 sm:px-6">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-hairline px-4 py-3 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ContactInfoModal({
  profile,
  onClose,
}: {
  profile: EditableProfile;
  onClose: () => void;
}) {
  const rows = [
    { icon: Mail, label: "E-mail", value: profile.email },
    { icon: Phone, label: "Telefone", value: profile.phone },
    { icon: Link2, label: "Site", value: profile.websiteLabel ?? profile.website ?? "—" },
    { icon: MapPin, label: "Local", value: profile.location },
    { icon: Cake, label: "Data de nascimento", value: profile.birthday ?? "—" },
  ];

  return (
    <Modal
      title="Informações de contato"
      onClose={onClose}
      footer={
        <button type="button" className="li-btn li-btn-primary" onClick={onClose}>
          Fechar
        </button>
      }
    >
      <div className="flex items-center gap-3">
        <Image
          src={profile.avatarUrl}
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="text-base font-semibold text-ink">{profile.name}</p>
          <p className="line-clamp-2 text-sm text-ink-muted">{profile.headline}</p>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
        {rows.map(({ icon: Icon, label, value }) => (
          <li key={label} className="flex items-start gap-3 py-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">{label}</p>
              <p className="mt-0.5 truncate text-sm font-medium text-ink">{value}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-ink-muted">
        Somente você pode ver as informações de contato do seu perfil.
      </p>
    </Modal>
  );
}

type EditForm = {
  name: string;
  pronouns: string;
  headline: string;
  location: string;
  about: string;
};

function EditProfileModal({
  profile,
  onClose,
  onSaved,
}: {
  profile: EditableProfile;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<EditForm>({
    name: profile.name,
    pronouns: profile.pronouns ?? "",
    headline: profile.headline,
    location: profile.location,
    about: profile.about,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof EditForm, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Não foi possível salvar o perfil.");
      }

      onSaved();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Editar perfil"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="li-btn li-btn-outline-muted" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            className="li-btn li-btn-primary"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </>
      }
    >
      <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <Field label="Nome" htmlFor="edit-name">
            <input
              id="edit-name"
              required
              maxLength={80}
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Pronomes" htmlFor="edit-pronouns">
            <input
              id="edit-pronouns"
              maxLength={30}
              value={form.pronouns}
              onChange={(event) => update("pronouns", event.target.value)}
              className={inputClass}
              placeholder="ela/dela"
            />
          </Field>
        </div>

        <Field label="Título" htmlFor="edit-headline" hint="Ex.: Product Designer Sênior na Nubank">
          <input
            id="edit-headline"
            required
            maxLength={160}
            value={form.headline}
            onChange={(event) => update("headline", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Local" htmlFor="edit-location">
          <input
            id="edit-location"
            required
            maxLength={80}
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Sobre" htmlFor="edit-about" hint={`${form.about.length}/2000`}>
          <textarea
            id="edit-about"
            required
            rows={7}
            maxLength={2000}
            value={form.about}
            onChange={(event) => update("about", event.target.value)}
            className={cn(inputClass, "resize-y leading-relaxed")}
          />
        </Field>

        {error ? (
          <p role="alert" className="rounded-md bg-[#fdecec] px-3 py-2 text-sm text-[#b24020]">
            {error}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}

function AddSectionModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Não foi possível adicionar a seção.");
      }

      onSaved(`Competência "${name.trim()}" adicionada ao perfil.`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Adicionar seção"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="li-btn li-btn-outline-muted" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            form="add-section-form"
            className="li-btn li-btn-primary"
            disabled={saving || name.trim().length < 2}
          >
            {saving ? "Adicionando..." : "Adicionar"}
          </button>
        </>
      }
    >
      <form id="add-section-form" onSubmit={handleSubmit} className="space-y-4">
        <Field label="Tipo de seção" htmlFor="section-type">
          <select id="section-type" className={cn(inputClass, "bg-white")} defaultValue="skill">
            <option value="skill">Competência</option>
            <option value="experience" disabled>
              Experiência (em breve)
            </option>
            <option value="education" disabled>
              Formação acadêmica (em breve)
            </option>
            <option value="certification" disabled>
              Licença e certificado (em breve)
            </option>
          </select>
        </Field>

        <Field
          label="Nome da competência"
          htmlFor="section-name"
          hint="Ex.: Design de interação, Pesquisa qualitativa, Design Ops"
        >
          <input
            id="section-name"
            required
            maxLength={60}
            minLength={2}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="Digite uma competência"
          />
        </Field>

        <p className="rounded-md bg-[#eef3f8] px-3 py-2 text-xs text-ink-muted">
          A nova competência aparece no fim da seção Competências e é salva no banco de dados.
        </p>

        {error ? (
          <p role="alert" className="rounded-md bg-[#fdecec] px-3 py-2 text-sm text-[#b24020]">
            {error}
          </p>
        ) : null}
      </form>
    </Modal>
  );
}

const inputClass =
  "w-full rounded-[4px] border border-ink/40 bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-linkedin focus:outline-none focus:ring-1 focus:ring-linkedin";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function EditProfileButton({
  className,
  children,
  label,
}: {
  className?: string;
  children: ReactNode;
  label: string;
}) {
  const { openEdit } = useProfileUI();
  return (
    <button type="button" onClick={openEdit} className={className} aria-label={label} title={label}>
      {children}
    </button>
  );
}

export function ContactInfoTrigger({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { openContact } = useProfileUI();
  return (
    <button
      type="button"
      onClick={openContact}
      className={cn("li-link text-left text-sm", className)}
    >
      {children ?? "Informações de contato"}
    </button>
  );
}

export function AddSectionButton({
  className,
  children,
  label = "Adicionar seção",
}: {
  className?: string;
  children?: ReactNode;
  label?: string;
}) {
  const { openAddSection } = useProfileUI();
  return (
    <button
      type="button"
      onClick={openAddSection}
      className={className}
      aria-label={label}
      title={label}
    >
      {children ?? "Adicionar seção"}
    </button>
  );
}
