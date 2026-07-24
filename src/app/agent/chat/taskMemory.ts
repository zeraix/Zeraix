/**
 * Task Memory (CRITICAL tier of the context-memory-tiers design — see docs/context-memory-tiers-design.md).
 *
 * The per-conversation *mission state* the model keeps for itself: the plan, goal, key decisions and hard
 * constraints for the task in flight. It is pinned into the wire on every turn and NEVER summarised, so the
 * agent cannot forget what it is doing after older rounds are compacted. Distinct from ZERAIX.md project
 * memory (durable across sessions); this is this conversation's mission only.
 *
 * INTERNAL and INVISIBLE by design. It is prose-only (`notes`) — a free-form markdown brief the model
 * writes in its own words. It deliberately holds no structured todo list: the user-facing checklist is the
 * separate `update_todos` panel. Task Memory is context the *model* reads, not a surface the *user* sees, so
 * the model's internal planning never leaks onto the To-dos panel.
 *
 * Two ways it is populated:
 *   - applyTaskState(): the model's own set_task_state tool call — REPLACE the brief with what it provides.
 *   - mergeExtracted(): the compaction-time extractor — NON-DESTRUCTIVE fill-if-empty. It rescues the case
 *     where the model described a plan but never recorded it (empty brief), capturing it as the span is
 *     discarded; it never overwrites a brief the model deliberately wrote.
 *
 * Everything here is pure and JSON-serialisable (persisted as-is with the conversation).
 */

export interface TaskMemory {
  /** Free-form markdown task brief: mission, plan, constraints, decisions — in the model's own words. */
  notes: string;
}

/** A model-authored update (set_task_state): replaces the brief. */
export type TaskStatePatch = Partial<TaskMemory>;
/** A compaction-extracted delta: applied non-destructively (fill-if-empty). */
export type ExtractedTaskState = Partial<TaskMemory>;

// The brief rides every turn uncached at the wire tail, so cap it (prose, ~1K tokens).
const MAX_NOTES = 4000; // chars

const clampStr = (s: unknown, max: number): string => {
  const str = typeof s === "string" ? s : s == null ? "" : String(s);
  const t = str.trim();
  return t.length > max ? t.slice(0, max) : t;
};

export function emptyTaskMemory(): TaskMemory {
  return { notes: "" };
}

export function isTaskMemoryEmpty(tm: TaskMemory | null | undefined): boolean {
  return !tm || !tm.notes;
}

/** Normalise any (possibly persisted / partial) object into a well-formed, bounded TaskMemory. */
export function normalizeTaskMemory(raw: unknown): TaskMemory {
  return { notes: clampStr((raw as Partial<TaskMemory> | null)?.notes, MAX_NOTES) };
}

/** Model-authored update (set_task_state): replaces the brief when notes is provided; else unchanged. */
export function applyTaskState(prev: TaskMemory, patch: TaskStatePatch): TaskMemory {
  return patch.notes != null ? { notes: clampStr(patch.notes, MAX_NOTES) } : { ...prev };
}

/**
 * Compaction-extracted delta: applied NON-DESTRUCTIVELY, fill-if-empty only. Rescues a plan the model
 * described but never recorded (empty brief) by capturing it as its span is discarded — without letting a
 * hallucinated extraction overwrite a brief the model deliberately wrote.
 */
export function mergeExtracted(prev: TaskMemory, ex: ExtractedTaskState): TaskMemory {
  if (!prev.notes && ex.notes) return { notes: clampStr(ex.notes, MAX_NOTES) };
  return { ...prev };
}

/** Markers the compaction summariser wraps its structured task-state capture in (see page.tsx summarizeHistory). */
export const TASK_STATE_OPEN = "<<<TASK_STATE>>>";
export const TASK_STATE_CLOSE = "<<<END_TASK_STATE>>>";
const TASK_STATE_RE = /<<<TASK_STATE>>>([\s\S]*?)<<<END_TASK_STATE>>>/;

/**
 * Split a compaction summariser's output into its prose summary and the task-state brief it appended.
 * Best-effort and total: malformed/absent markers or bad JSON yield a null delta and the raw text as the
 * summary, so extraction can never break compaction. The delta is applied via mergeExtracted.
 */
export function parseSummaryWithTaskState(raw: string): {
  summary: string;
  extracted: ExtractedTaskState | null;
} {
  let summary = raw ?? "";
  let extracted: ExtractedTaskState | null = null;
  const m = summary.match(TASK_STATE_RE);
  if (m) {
    summary = summary.slice(0, m.index).trim();
    try {
      const obj = JSON.parse(m[1].trim()) as { notes?: unknown };
      if (typeof obj.notes === "string" && obj.notes.trim()) extracted = { notes: obj.notes };
    } catch {
      /* malformed JSON → no extraction, keep the summary */
    }
  }
  return { summary: summary.trim(), extracted };
}

const TASK_STATE_BANNER =
  "[TASK STATE — your pinned mission brief, preserved verbatim across context compaction so you do not " +
  "forget the task. The conversation above may be summarised, but THIS is the source of truth for what you " +
  "are doing. Update it via set_task_state ONLY when the plan or goal materially changes — not every turn.]";

/**
 * Render Task Memory into the compact text block appended at the wire tail. Empty → "" (nothing injected).
 * The brief is emitted verbatim (it is already prose).
 */
export function renderTaskMemory(tm: TaskMemory | null | undefined): string {
  if (isTaskMemoryEmpty(tm)) return "";
  return `${TASK_STATE_BANNER}\n\n${tm!.notes}`;
}
