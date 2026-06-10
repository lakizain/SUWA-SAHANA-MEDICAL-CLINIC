import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const seedDir = path.join(root, "database", "seed");
const outFile = path.join(root, "database", "import_test_seed_data.sql");

const seedFiles = [
  { file: "tests_rows.sql", label: "tests" },
  { file: "test_subcategories_rows.sql", label: "test_subcategories" },
  { file: "reference_ranges_rows.sql", label: "reference_ranges" },
  { file: "subcategory_suggestions_rows.sql", label: "subcategory_suggestions" },
];

function addOnConflict(insertSql) {
  return insertSql.replace(
    /^INSERT INTO /i,
    "INSERT INTO "
  ).replace(
    /;\s*$/s,
    " ON CONFLICT (id) DO NOTHING;"
  );
}

const migration = fs.readFileSync(
  path.join(root, "database", "migration_reference_ranges_baby_gender.sql"),
  "utf8"
);

const header = `-- SUWA SAHANA MEDICAL CLINIC - Test master data import
-- Generated: ${new Date().toISOString()}
--
-- Run this entire script in Supabase Dashboard -> SQL Editor.
-- Import order: tests -> subcategories -> reference_ranges -> suggestions
--
-- Notes:
-- - Uses ON CONFLICT (id) DO NOTHING (safe to re-run; existing rows are kept).
-- - To replace all test data first, uncomment the TRUNCATE block below.
-- - Requires migration_add_missing_columns.sql if not applied yet.

-- BEGIN OPTIONAL FULL REPLACE (uncomment only if you want to wipe existing test data)
-- TRUNCATE TABLE
--   public.subcategory_suggestions,
--   public.reference_ranges,
--   public.test_subcategories,
--   public.package_tests,
--   public.tests
-- RESTART IDENTITY CASCADE;
-- END OPTIONAL FULL REPLACE

`;

let body = migration + "\n\n";

for (const { file, label } of seedFiles) {
  const sql = fs.readFileSync(path.join(seedDir, file), "utf8").trim();
  body += `-- ========== ${label} ==========\n`;
  body += addOnConflict(sql) + "\n\n";
}

fs.writeFileSync(outFile, header + body, "utf8");
console.log("Wrote", outFile);
