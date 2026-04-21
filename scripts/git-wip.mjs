#!/usr/bin/env node
/**
 * Manage local WIP: stash (incl. untracked), pop, restore tracked files, clean untracked.
 * Usage: node scripts/git-wip.mjs <command> [args]
 *
 * Commands:
 *   status              Short status + counts
 *   stash [message]     git stash push -u (include untracked)
 *   pop                 git stash pop
 *   list                git stash list
 *   restore-tracked     Discard changes to tracked files (matches HEAD)
 *   clean-untracked     Remove untracked files/dirs (needs --yes)
 */

import { spawnSync } from "node:child_process";
import process from "node:process";

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: "utf8",
    stdio: "inherit",
    ...opts,
  });
  return r.status ?? 1;
}

function git(args) {
  return run("git", args);
}

function usage() {
  console.log(`
git-wip — stash or clear local work-in-progress

  node scripts/git-wip.mjs status
      Show branch and short status.

  node scripts/git-wip.mjs stash [message]
      Stash tracked + untracked changes (git stash push -u).
      Default message: wip-<ISO date>

  node scripts/git-wip.mjs pop
      Apply latest stash and remove it from the stack.

  node scripts/git-wip.mjs list
      Show git stash list.

  node scripts/git-wip.mjs restore-tracked
      Discard all local changes to files Git already tracks (git restore .).
      Untracked files are left alone.

  node scripts/git-wip.mjs clean-untracked --yes
      Delete untracked files and directories (git clean -fd).
      Must pass --yes to confirm.

Examples:
  node scripts/git-wip.mjs stash "billing WIP"
  node scripts/git-wip.mjs restore-tracked
`);
}

const argv = process.argv.slice(2);
const cmd = argv[0];

if (!cmd || cmd === "-h" || cmd === "--help") {
  usage();
  process.exit(0);
}

if (cmd === "status") {
  git(["status", "-sb"]);
  git(["diff", "--stat", "HEAD"]);
  process.exit(0);
}

if (cmd === "stash") {
  const msg = argv.slice(1).join(" ").trim() || `wip-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}`;
  const code = git(["stash", "push", "-u", "-m", msg]);
  process.exit(code);
}

if (cmd === "pop") {
  process.exit(git(["stash", "pop"]));
}

if (cmd === "list") {
  process.exit(git(["stash", "list"]));
}

if (cmd === "restore-tracked") {
  console.error("Restoring tracked files to HEAD (untracked files unchanged)…");
  process.exit(git(["restore", "."]));
}

if (cmd === "clean-untracked") {
  if (!argv.includes("--yes")) {
    console.error("Refusing to delete untracked files without --yes");
    console.error("Run: node scripts/git-wip.mjs clean-untracked --yes");
    process.exit(1);
  }
  console.error("Removing untracked files and directories (git clean -fd)…");
  process.exit(git(["clean", "-fd"]));
}

console.error(`Unknown command: ${cmd}`);
usage();
process.exit(1);
