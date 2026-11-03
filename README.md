# Drab
Mobile-first Polytechnic student ride-sharing prototype, built with React and Vite.

## Run
`npm install` then `npm run dev`. Production build: `npm run build`.

Use **Log in → Explore with a demo account**, or register a new student account. The prototype accepts an 8-digit student ID at `@student.polytechnic.bh`, Bahrain mobile numbers beginning with 3 or 6, and passwords of at least 8 characters. This email rule is a configurable prototype assumption, not a verified university policy.

Verification is simulated with code **123456**. No emails or SMS are sent. Data persists in localStorage on the same browser. Passwords are stored locally as prototype data; use invented credentials only. No backend or production authentication is included.

To test booking acceptance: register two accounts in the same browser, publish weekly availability using one, request that ride using the other, then sign back in as the driver to accept or reject. Contact details become visible after acceptance. Seeded demo drivers do not automatically respond. Dashboard statistics are illustrative.
