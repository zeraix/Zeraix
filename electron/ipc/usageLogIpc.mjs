/**
 * Usage log IPC: renderer window.usageLog.* -> the main-process store.
 *
 * The renderer is the only place that knows *who* made a tool call (main agent vs. which sub-agent),
 * so tool and delegation entries are pushed from there; model entries are written by the LLM proxy
 * itself and never cross this boundary.
 *
 * `usagelog:append` is fire-and-forget (`send`, not `invoke`): the chat loop must never wait on a log
 * write, and a dropped entry is preferable to a stalled turn. Everything a window sends is treated as
 * untrusted -- the store's normalize() enforces the field allowlist and size caps.
 */
import { ipcMain, shell } from "electron";
import {
  appendEntry,
  clearUsageLog,
  ensureUsageLogDir,
  flushUsageLog,
  isUsageLogEnabled,
  listUsageLogDays,
  readUsageLog,
  setUsageLogEnabled,
  usageLogDir,
  usageLogStats,
} from "../store/usageLogStore.mjs";

export function registerUsageLog() {
  ipcMain.handle("usagelog:enabled", () => isUsageLogEnabled());
  ipcMain.handle("usagelog:set-enabled", (_e, on) => setUsageLogEnabled(on));

  // Batched too: a round of parallel read-only tool calls logs several entries at once.
  ipcMain.on("usagelog:append", (_e, entries) => {
    if (!isUsageLogEnabled()) return;
    for (const entry of Array.isArray(entries) ? entries : [entries]) appendEntry(entry);
  });

  ipcMain.handle("usagelog:days", () => listUsageLogDays());
  ipcMain.handle("usagelog:read", (_e, opts) => readUsageLog(opts ?? {}));
  ipcMain.handle("usagelog:stats", (_e, day) => usageLogStats(day));
  ipcMain.handle("usagelog:clear", (_e, day) => clearUsageLog(day));
  ipcMain.handle("usagelog:flush", () => flushUsageLog());
  ipcMain.handle("usagelog:dir", () => usageLogDir());
  // Created on demand: the folder may not exist yet if logging has never been switched on.
  ipcMain.handle("usagelog:open-dir", async () => {
    const dir = ensureUsageLogDir();
    const error = await shell.openPath(dir);
    return { ok: !error, path: dir, error: error || undefined };
  });
}
