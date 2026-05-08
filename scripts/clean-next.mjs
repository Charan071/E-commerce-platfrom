import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), ".next");
try {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("Removed .next");
} catch (err) {
  console.warn(
    "Could not remove .next (stop `next dev` and close programs using it, then retry):",
    err instanceof Error ? err.message : err
  );
  process.exitCode = 0;
}
