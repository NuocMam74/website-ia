import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import type { Lang } from '~/lib/i18n';

interface Props {
  lang: Lang;
  endpoint: string;
  /** Type pré-sélectionné depuis l'URL (ex. `?type=demo`). */
  initialType?: 'projet' | 'demo' | 'template' | 'autre';
  /** Référence pré-remplie (ex. `?solution=aspice-navigator`). */
  reference?: string;
}

/**
 * Formulaire contact/démo conforme au brief §14 :
 * - champs nom, société, email, téléphone (opt), type, message
 * - consentement RGPD obligatoire (non pré-coché)
 * - honeypot (champ caché « company_url ») contre les bots
 * - validation côté client minimale ; le serveur revalide via Zod
 */
export default function ContactForm({
  lang,
  endpoint,
  initialType = 'projet',
  reference,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messages = {
    fr: {
      name: 'Votre nom',
      company: 'Société',
      email: 'Email professionnel',
      phone: 'Téléphone (optionnel)',
      type: 'Type de demande',
      typeProjet: 'Projet / devis',
      typeDemo: 'Démo',
      typeTemplate: 'Question sur un template',
      typeAutre: 'Autre',
      message: 'Votre message',
      consent:
        'J’accepte que mes données soient traitées pour répondre à ma demande, conformément à la politique de confidentialité.',
      submit: 'Envoyer',
      sending: 'Envoi…',
      success:
        'Merci, votre message est bien reçu. Nous revenons vers vous sous 48h ouvrées.',
      genericError:
        'Une erreur est survenue. Veuillez réessayer ou nous écrire directement.',
      ref: 'Référence',
    },
    en: {
      name: 'Your name',
      company: 'Company',
      email: 'Business email',
      phone: 'Phone (optional)',
      type: 'Request type',
      typeProjet: 'Project / quote',
      typeDemo: 'Demo',
      typeTemplate: 'Template question',
      typeAutre: 'Other',
      message: 'Your message',
      consent:
        'I agree that my data is processed to handle my request, in accordance with the privacy policy.',
      submit: 'Send',
      sending: 'Sending…',
      success:
        'Thank you, your message has been received. We get back to you within 48 business hours.',
      genericError:
        'Something went wrong. Please retry or email us directly.',
      ref: 'Reference',
    },
  };
  const m = messages[lang];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage((err as Error).message);
    }
  };

  if (status === 'success') {
    return (
      <div className="border border-teal-700 bg-teal-500/10 rounded-lg p-6">
        <p className="text-base text-teal-200 font-medium">{m.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot — invisible pour les humains, rempli par les bots */}
      <input
        type="text"
        name="company_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[10000px] w-1 h-1 opacity-0"
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label={m.name} name="name" required />
        <Field label={m.company} name="company" required />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label={m.email} name="email" type="email" required />
        <Field label={m.phone} name="phone" type="tel" />
      </div>

      <div>
        <label htmlFor="type" className="block text-small font-medium text-ink-50 mb-1.5">
          {m.type}
        </label>
        <select
          id="type"
          name="type"
          defaultValue={initialType}
          required
          className="w-full px-3 py-2 text-small border border-ink-700 rounded-md bg-ink-900 focus:border-teal-400 focus:outline-none"
        >
          <option value="projet">{m.typeProjet}</option>
          <option value="demo">{m.typeDemo}</option>
          <option value="template">{m.typeTemplate}</option>
          <option value="autre">{m.typeAutre}</option>
        </select>
      </div>

      {reference && (
        <input type="hidden" name="reference" value={reference} />
      )}

      <div>
        <label htmlFor="message" className="block text-small font-medium text-ink-50 mb-1.5">
          {m.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={20}
          className="w-full px-3 py-2 text-small border border-ink-700 rounded-md bg-ink-900 focus:border-teal-400 focus:outline-none resize-vertical"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 w-4 h-4 accent-teal-400"
        />
        <span className="text-small text-ink-200 leading-relaxed">{m.consent}</span>
      </label>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium text-ink-950 bg-ink-50 hover:bg-ink-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
      >
        {status === 'sending' ? (
          m.sending
        ) : (
          <>
            <Send size={16} strokeWidth={1.75} aria-hidden="true" />
            {m.submit}
          </>
        )}
      </button>

      {status === 'error' && (
        <p role="alert" className="text-small text-coral-300">
          {errorMessage ?? m.genericError}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-small font-medium text-ink-50 mb-1.5">
        {label}
        {required && <span className="text-coral-600 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full px-3 py-2 text-small border border-ink-700 rounded-md bg-ink-900 focus:border-teal-400 focus:outline-none"
      />
    </div>
  );
}
