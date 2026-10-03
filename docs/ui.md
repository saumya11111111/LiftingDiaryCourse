# UI Standards

## Rule: shadcn/ui Components Only

ALL UI in this project MUST be built exclusively from shadcn/ui components.

- **Never** create custom UI components
- **Never** write raw HTML elements styled with Tailwind as standalone components (e.g. a custom `<Button>`, `<Card>`, `<Badge>`)
- **Never** install or use any other component library (MUI, Radix primitives directly, Ant Design, etc.)
- If a shadcn/ui component does not yet exist in the project, add it with the CLI: `npx shadcn@latest add <component>`

```tsx
// ✅ Correct
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ❌ Wrong — custom component
export function MyButton({ children }: { children: React.ReactNode }) {
  return <button className="rounded bg-zinc-900 px-4 py-2 text-white">{children}</button>;
}
```

## Rule: Date Formatting with date-fns

All date formatting MUST use [date-fns](https://date-fns.org/). Raw `Date.toLocaleDateString`, `Intl.DateTimeFormat`, or manual string manipulation are forbidden.

Dates must be formatted with an ordinal day, abbreviated month, and full year:

| Output | Example |
|---|---|
| 1st Sep 2025 | `format(date, "do MMM yyyy")` |
| 2nd Aug 2025 | `format(date, "do MMM yyyy")` |
| 3rd Jan 2026 | `format(date, "do MMM yyyy")` |
| 4th Jun 2024 | `format(date, "do MMM yyyy")` |

```ts
// ✅ Correct
import { format } from "date-fns";

format(new Date("2025-09-01"), "do MMM yyyy"); // "1st Sep 2025"
format(new Date("2025-08-02"), "do MMM yyyy"); // "2nd Aug 2025"
format(new Date("2026-01-03"), "do MMM yyyy"); // "3rd Jan 2026"

// ❌ Wrong
new Date("2025-09-01").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
```

Install date-fns if not already present:

```bash
npm install date-fns
```

## Summary

| Concern | Rule |
|---|---|
| UI components | shadcn/ui only — no custom components |
| Adding new components | `npx shadcn@latest add <component>` |
| Date formatting | date-fns `format(date, "do MMM yyyy")` |
| Other date libraries | Forbidden |
