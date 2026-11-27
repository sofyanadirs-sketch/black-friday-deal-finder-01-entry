// DealHound — the hand-in program for black-friday-deal-finder-01.
//
// The entry is this repository: app/ holds the static deal-finder site (plain
// files, no build step, no network requests), screenshots/ holds 4 real
// renders of it, and this program copies both into the output directory and
// writes dossier.json there with the kit's vendored library. vendor/
// makefun-frontend.ts is copied from the kit unchanged, as the scorer
// requires: dossier.json must be byte for byte what that library writes.
//
// Run locally (Node 22+):
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader's container MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's caps: at most 4 screenshots, each at most 256 KiB; app/ at
// most 993 files and 16 MiB. Only text_max_bytes changes the dossier bytes;
// the other caps refuse an entry the scorer would refuse.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
