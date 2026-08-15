import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  CalendarClock,
  ExternalLink,
  LockKeyhole,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

const sourceChannels = [
  "inbound",
  "referral",
  "organic",
  "linkedin",
  "public_business_channel",
  "partner",
  "other",
] as const;
const offerHypotheses = ["undecided", "swell_geo_growth", "swell_geo_scale", "arm_mandate_pro"] as const;
const qualificationStates = [
  "research",
  "qualified",
  "awaiting_reply",
  "fit_review_requested",
  "fit_review_booked",
  "fit_review_completed",
  "nurture",
  "closed_no_fit",
] as const;
const scopeStates = ["not_started", "drafting", "sent", "accepted", "declined"] as const;
const collectionStates = [
  "not_requested",
  "private_instructions_ready",
  "requested",
  "collected",
  "failed",
] as const;
const onboardingStates = ["not_ready", "ready", "active", "blocked"] as const;

type SourceChannel = (typeof sourceChannels)[number];
type OfferHypothesis = (typeof offerHypotheses)[number];
type QualificationState = (typeof qualificationStates)[number];
type ScopeState = (typeof scopeStates)[number];
type CollectionState = (typeof collectionStates)[number];
type OnboardingState = (typeof onboardingStates)[number];

type OpportunityRecord = {
  id: number;
  accountName: string;
  sourceChannel: SourceChannel;
  sourceReference: string | null;
  evidenceRoute: string | null;
  evidenceSummary: string | null;
  offerHypothesis: OfferHypothesis;
  qualificationState: QualificationState;
  scopeState: ScopeState;
  collectionState: CollectionState;
  onboardingState: OnboardingState;
  nextAction: string | null;
  nextActionAt: Date | null;
  updatedAt: Date;
};

type OpportunityForm = Omit<OpportunityRecord, "id" | "updatedAt" | "nextActionAt"> & {
  nextActionAt: string;
};

function emptyForm(): OpportunityForm {
  return {
    accountName: "",
    sourceChannel: "other",
    sourceReference: null,
    evidenceRoute: null,
    evidenceSummary: null,
    offerHypothesis: "undecided",
    qualificationState: "research",
    scopeState: "not_started",
    collectionState: "not_requested",
    onboardingState: "not_ready",
    nextAction: null,
    nextActionAt: "",
  };
}

function toDatetimeLocal(value: Date | null) {
  if (!value) return "";
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function toEditableForm(opportunity: OpportunityRecord): OpportunityForm {
  return {
    accountName: opportunity.accountName,
    sourceChannel: opportunity.sourceChannel,
    sourceReference: opportunity.sourceReference,
    evidenceRoute: opportunity.evidenceRoute,
    evidenceSummary: opportunity.evidenceSummary,
    offerHypothesis: opportunity.offerHypothesis,
    qualificationState: opportunity.qualificationState,
    scopeState: opportunity.scopeState,
    collectionState: opportunity.collectionState,
    onboardingState: opportunity.onboardingState,
    nextAction: opportunity.nextAction,
    nextActionAt: toDatetimeLocal(opportunity.nextActionAt),
  };
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, character => character.toUpperCase());
}

function toNullable(value: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

function stateClass(state: string) {
  if (["qualified", "fit_review_booked", "fit_review_completed", "accepted", "collected", "active", "ready"].includes(state)) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }
  if (["failed", "declined", "closed_no_fit", "blocked"].includes(state)) {
    return "border-rose-500/30 bg-rose-500/10 text-rose-300";
  }
  if (["awaiting_reply", "fit_review_requested", "sent", "requested", "private_instructions_ready", "drafting"].includes(state)) {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }
  return "border-white/10 bg-white/5 text-slate-300";
}

function StateBadge({ state }: { state: string }) {
  return <Badge className={`border font-medium ${stateClass(state)}`}>{formatLabel(state)}</Badge>;
}

export default function RevenueControlBoard() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<OpportunityRecord | null>(null);
  const [form, setForm] = useState<OpportunityForm>(emptyForm);
  const isAdmin = user?.role === "admin";

  const opportunitiesQuery = trpc.opportunities.list.useQuery(undefined, {
    enabled: isAdmin,
    retry: false,
  });

  const closeEditor = () => {
    setEditorOpen(false);
    setEditing(null);
    setForm(emptyForm());
  };

  const refreshBoard = async () => {
    await utils.opportunities.list.invalidate();
  };

  const createMutation = trpc.opportunities.create.useMutation({
    onSuccess: async () => {
      await refreshBoard();
      toast.success("Opportunity added to the private board.");
      closeEditor();
    },
    onError: error => toast.error(error.message),
  });

  const updateMutation = trpc.opportunities.update.useMutation({
    onSuccess: async () => {
      await refreshBoard();
      toast.success("Opportunity control state updated.");
      closeEditor();
    },
    onError: error => toast.error(error.message),
  });

  const opportunities = (opportunitiesQuery.data ?? []) as OpportunityRecord[];
  const summary = useMemo(
    () => ({
      total: opportunities.length,
      fitReview: opportunities.filter(item => ["fit_review_requested", "fit_review_booked"].includes(item.qualificationState)).length,
      scoped: opportunities.filter(item => item.scopeState === "accepted").length,
      collected: opportunities.filter(item => item.collectionState === "collected").length,
    }),
    [opportunities],
  );

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setEditorOpen(true);
  };

  const openEdit = (opportunity: OpportunityRecord) => {
    setEditing(opportunity);
    setForm(toEditableForm(opportunity));
    setEditorOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextActionAt = form.nextActionAt ? new Date(form.nextActionAt) : null;
    if (nextActionAt && Number.isNaN(nextActionAt.getTime())) {
      toast.error("Enter a valid next-action date and time.");
      return;
    }

    const payload = {
      accountName: form.accountName.trim(),
      sourceChannel: form.sourceChannel,
      sourceReference: toNullable(form.sourceReference),
      evidenceRoute: toNullable(form.evidenceRoute),
      evidenceSummary: toNullable(form.evidenceSummary),
      offerHypothesis: form.offerHypothesis,
      qualificationState: form.qualificationState,
      scopeState: form.scopeState,
      collectionState: form.collectionState,
      onboardingState: form.onboardingState,
      nextAction: toNullable(form.nextAction),
      nextActionAt,
    };

    if (!payload.accountName) {
      toast.error("Account name is required.");
      return;
    }

    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const setValue = <Key extends keyof OpportunityForm>(key: Key, value: OpportunityForm[Key]) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-12">
        <section className="relative overflow-hidden rounded-3xl border border-lime-300/15 bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950/60 p-6 shadow-2xl shadow-black/25 md:p-8">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-lime-200/10 bg-lime-300/5 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-lime-300">
                <LockKeyhole className="h-4 w-4" /> Owner-only commercial controls
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Revenue control board</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Track the evidence-governed path from opportunity research through written scope, private collection, and onboarding readiness. This board stores operational state only; do not enter payment instruments or confidential client materials.
              </p>
            </div>
            {isAdmin && (
              <Button onClick={openNew} className="bg-lime-300 text-slate-950 hover:bg-lime-200">
                <Plus className="mr-2 h-4 w-4" /> Add opportunity
              </Button>
            )}
          </div>
        </section>

        {loading ? (
          <Card className="border-white/10 bg-slate-950/75 text-white"><CardContent className="p-6 text-sm text-slate-300">Checking access controls…</CardContent></Card>
        ) : !isAdmin ? (
          <Card className="border-rose-500/20 bg-slate-950/75 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-rose-300" /> Restricted workspace</CardTitle>
              <CardDescription className="text-slate-300">Revenue-control records are available only to the designated administrator. Server procedures enforce the same rule.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Active records", value: summary.total, detail: "Private opportunity records" },
                { label: "Fit-review activity", value: summary.fitReview, detail: "Requested or booked" },
                { label: "Accepted scope", value: summary.scoped, detail: "Written acceptance recorded" },
                { label: "Collected", value: summary.collected, detail: "Status only; no payment data" },
              ].map(item => (
                <Card key={item.label} className="border-white/10 bg-slate-950/75 text-white shadow-lg shadow-black/10">
                  <CardHeader className="space-y-1 pb-3">
                    <CardDescription className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.label}</CardDescription>
                    <CardTitle className="text-3xl text-lime-200">{item.value}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-slate-400">{item.detail}</CardContent>
                </Card>
              ))}
            </section>

            <Card className="border-white/10 bg-slate-950/75 text-white shadow-xl shadow-black/15">
              <CardHeader className="gap-4 border-b border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Opportunity controls</CardTitle>
                  <CardDescription className="mt-1 text-slate-400">Update qualification, offer hypothesis, evidence provenance, scope, collection, and onboarding states without storing client payment data.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => opportunitiesQuery.refetch()} disabled={opportunitiesQuery.isFetching} className="border-white/15 text-slate-200 hover:bg-white/10 hover:text-white">
                  <RefreshCw className={`mr-2 h-4 w-4 ${opportunitiesQuery.isFetching ? "animate-spin" : ""}`} /> Refresh
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {opportunitiesQuery.isLoading ? (
                  <div className="p-8 text-sm text-slate-300">Loading controlled opportunities…</div>
                ) : opportunitiesQuery.isError ? (
                  <div className="p-8 text-sm text-rose-200">The board could not load: {opportunitiesQuery.error.message}</div>
                ) : opportunities.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 p-10 text-center">
                    <ShieldCheck className="h-8 w-8 text-lime-300" />
                    <div>
                      <p className="font-medium text-white">No opportunity records yet</p>
                      <p className="mt-1 max-w-lg text-sm leading-6 text-slate-400">Create a source-governed record when a legitimate opportunity has an evidence route and an accountable next action. Do not add scraped contact data or financial details.</p>
                    </div>
                    <Button onClick={openNew} variant="outline" className="border-lime-300/30 text-lime-200 hover:bg-lime-300/10 hover:text-lime-100">Add the first controlled record</Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="min-w-52 text-slate-400">Account / next action</TableHead>
                          <TableHead className="text-slate-400">Qualification</TableHead>
                          <TableHead className="text-slate-400">Offer</TableHead>
                          <TableHead className="text-slate-400">Scope</TableHead>
                          <TableHead className="text-slate-400">Collection</TableHead>
                          <TableHead className="text-slate-400">Onboarding</TableHead>
                          <TableHead className="text-right text-slate-400">Control</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {opportunities.map(opportunity => (
                          <TableRow key={opportunity.id} className="border-white/10 hover:bg-white/[0.035]">
                            <TableCell>
                              <div className="font-medium text-white">{opportunity.accountName}</div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                <span>{formatLabel(opportunity.sourceChannel)}</span>
                                {opportunity.evidenceRoute && (
                                  <a href={opportunity.evidenceRoute} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-lime-300 hover:text-lime-200 hover:underline">Evidence <ExternalLink className="h-3 w-3" /></a>
                                )}
                              </div>
                              {opportunity.nextAction && <p className="mt-2 max-w-72 text-xs leading-5 text-slate-300">{opportunity.nextAction}</p>}
                              {opportunity.nextActionAt && <p className="mt-2 flex items-center gap-1 text-xs text-amber-200"><CalendarClock className="h-3.5 w-3.5" /> {new Date(opportunity.nextActionAt).toLocaleString()}</p>}
                            </TableCell>
                            <TableCell><StateBadge state={opportunity.qualificationState} /></TableCell>
                            <TableCell className="text-sm text-slate-200">{formatLabel(opportunity.offerHypothesis)}</TableCell>
                            <TableCell><StateBadge state={opportunity.scopeState} /></TableCell>
                            <TableCell><StateBadge state={opportunity.collectionState} /></TableCell>
                            <TableCell><StateBadge state={opportunity.onboardingState} /></TableCell>
                            <TableCell className="text-right"><Button size="icon" variant="ghost" onClick={() => openEdit(opportunity)} className="text-slate-300 hover:bg-white/10 hover:text-white" aria-label={`Edit ${opportunity.accountName}`}><Pencil className="h-4 w-4" /></Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Dialog open={editorOpen} onOpenChange={open => (open ? setEditorOpen(true) : closeEditor())}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-950 text-white sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Update opportunity controls" : "Add controlled opportunity"}</DialogTitle>
            <DialogDescription className="text-slate-400">Capture only business-level commercial state and a legitimate evidence route. Never store payment instrument details, private credentials, or confidential client files here.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Account name" required><Input value={form.accountName} onChange={event => setValue("accountName", event.target.value)} placeholder="Organization or account" required className="border-white/15 bg-white/5 text-white placeholder:text-slate-500" /></Field>
              <SelectField label="Source channel" value={form.sourceChannel} onValueChange={value => setValue("sourceChannel", value as SourceChannel)} options={sourceChannels} />
              <SelectField label="Offer hypothesis" value={form.offerHypothesis} onValueChange={value => setValue("offerHypothesis", value as OfferHypothesis)} options={offerHypotheses} />
              <SelectField label="Qualification state" value={form.qualificationState} onValueChange={value => setValue("qualificationState", value as QualificationState)} options={qualificationStates} />
              <SelectField label="Scope state" value={form.scopeState} onValueChange={value => setValue("scopeState", value as ScopeState)} options={scopeStates} />
              <SelectField label="Collection state" value={form.collectionState} onValueChange={value => setValue("collectionState", value as CollectionState)} options={collectionStates} />
              <SelectField label="Onboarding state" value={form.onboardingState} onValueChange={value => setValue("onboardingState", value as OnboardingState)} options={onboardingStates} />
              <Field label="Next-action time"><Input type="datetime-local" value={form.nextActionAt} onChange={event => setValue("nextActionAt", event.target.value)} className="border-white/15 bg-white/5 text-white [color-scheme:dark]" /></Field>
              <Field label="Public source or referral route URL"><Input type="url" value={form.sourceReference ?? ""} onChange={event => setValue("sourceReference", event.target.value)} placeholder="https://…" className="border-white/15 bg-white/5 text-white placeholder:text-slate-500" /></Field>
              <Field label="Evidence route URL"><Input type="url" value={form.evidenceRoute ?? ""} onChange={event => setValue("evidenceRoute", event.target.value)} placeholder="https://…" className="border-white/15 bg-white/5 text-white placeholder:text-slate-500" /></Field>
            </div>
            <Field label="Evidence summary"><Textarea value={form.evidenceSummary ?? ""} onChange={event => setValue("evidenceSummary", event.target.value)} placeholder="Public source, confirmed relationship context, or approved evidence boundary." className="min-h-24 border-white/15 bg-white/5 text-white placeholder:text-slate-500" /></Field>
            <Field label="Next action"><Textarea value={form.nextAction ?? ""} onChange={event => setValue("nextAction", event.target.value)} placeholder="One accountable, policy-compliant next step." className="min-h-20 border-white/15 bg-white/5 text-white placeholder:text-slate-500" /></Field>
            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={closeEditor} className="border-white/15 text-slate-200 hover:bg-white/10 hover:text-white">Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-lime-300 text-slate-950 hover:bg-lime-200">{saving ? "Saving…" : editing ? "Save control state" : "Add opportunity"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function Field({ children, label, required = false }: { children: React.ReactNode; label: string; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-medium text-slate-200"><span>{label}{required && <span className="ml-1 text-lime-300">*</span>}</span>{children}</label>;
}

function SelectField({ label, value, onValueChange, options }: { label: string; value: string; onValueChange: (value: string) => void; options: readonly string[] }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-200">
      <span>{label}</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="border-white/15 bg-white/5 text-white"><SelectValue /></SelectTrigger>
        <SelectContent className="border-white/15 bg-slate-900 text-white">{options.map(option => <SelectItem key={option} value={option} className="focus:bg-white/10 focus:text-white">{formatLabel(option)}</SelectItem>)}</SelectContent>
      </Select>
    </label>
  );
}
