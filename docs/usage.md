# Usage & UI Guide

## Running the app
- pnpm dev (or npm run dev / yarn dev)
- pnpm build && pnpm preview for a production preview

## Reading the views
- Before/After per machine are displayed side-by-side within each machine card.
- Appointments are color-coded by cluster. The same color indicates the same cluster grouping.
- In the After view, appointments moved by the optimizer show a subtle white left accent and a light white ring.
- Each appointment tile shows technique, time, and duration in minutes.

## Filters & interactions
- A global summary module shows per‑machine moved counts and the total.
- The "Show only moved" checkbox is in the summary (top‑right). When enabled, only moved appointments are shown; the Before column is hidden for clarity.
- Use the "See by machine" button on a machine card to focus on that machine (SingleMachine view). The header layout remains consistent.
- Time labels are shown on the first calendar column to reduce clutter.

## Legend
- Cluster color: the base fill color of each appointment.
- Moved (after): a subtle white left accent and light ring appears only in the After view.

## Accessibility & readability
- Text color automatically switches between dark and white for readability based on the appointment background color.
- Highlights are intentionally subtle to avoid visual noise.
