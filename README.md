# Drab
Mobile-first Polytechnic student ride-sharing prototype, built with React and Vite.

## Run
`npm install` then `npm run dev`. Production build: `npm run build`.

Use **Log in → Explore with a demo account**, or register a new student account. The prototype accepts an 8-digit student ID at `@student.polytechnic.bh`, Bahrain mobile numbers beginning with 3 or 6, and passwords of at least 8 characters. This email rule is a configurable prototype assumption, not a verified university policy.

Verification is simulated with code **123456**. No emails or SMS are sent. Data persists in localStorage on the same browser. Passwords are stored locally as prototype data; use invented credentials only. No backend or production authentication is included.

To test booking acceptance: register two accounts in the same browser, publish weekly availability using one, request that ride using the other, then sign back in as the driver to accept or reject. Contact details become visible after acceptance. Seeded demo drivers do not automatically respond. Dashboard statistics are illustrative.

## Scheduling and reservations
- A driver cannot publish two weekly offers for the same weekday and time, regardless of journey type. Existing pending/accepted bookings prevent edits and deletion of the underlying offer.
- Multiple students may request the same dated slot while it is pending. Acceptance reserves the entire slot for one student and rejects competing requests, regardless of the legacy seat count.
- Booked and departed slots are disabled in ride search; each card shows the date it represents. Without a date filter, it shows the next occurrence. The confirmation form checks the selected date again.
- Pending requests expire at the scheduled time in Asia/Bahrain (UTC+03:00). Expiry checks run every second while open, on focus, and on reopening. With no backend, a closed browser cannot execute a timer; overdue requests are reconciled on reopening.
- Rule tests: `node --test tests/rules.test.js`.

## Populated sample account
Use the **View demo account** banner or **Explore with a demo account** at login to view Sara Ahmed's sample account. It includes six weekly offers across all three journey types, eight incoming/outgoing bookings spanning Pending, Accepted, Completed, Rejected, and Cancelled, and seven notifications. Two incoming Sunday requests demonstrate exclusive acceptance. Dates are generated relative to the first load. A one-time additive seed preserves existing browser data and does not duplicate samples on reload. New personal accounts retain their own account-specific pages.
