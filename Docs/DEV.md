# VTDR Development Guide (Code-First)

Last updated: 2026-02-18

## 1) Prerequisites
- Node.js 20+ (npm 10+ recommended)
- Windows/macOS/Linux

## 2) Environment
Root `.env` (current baseline):
```env
DATABASE_URL="file:C:/Users/Bakheet/Documents/Projects/ST/packages/data/prisma/dev.db"
PORT=3001
```

## 3) Start the System
From repository root:
```powershell
npm install
npm run dev
```

Expected services:
- UI: `http://localhost:3000`
- API: `http://localhost:3001`
- Health: `http://localhost:3001/api/health`

## 4) Operational Checks
- API sanity:
```powershell
curl http://localhost:3001/api/health
curl http://localhost:3001/api/system/status
```
- Preview sanity (replace `<storeId>` with a real store id):
```text
http://localhost:3001/preview/<storeId>/theme-raed-master/1.0.0?page=index
```

## 5) Database Utilities
Open Prisma Studio:
```powershell
npx prisma studio --schema packages/data/prisma/schema.prisma --port 5555
```

## 6) Validation and Quality Gates
- Full validation:
```powershell
npm run validate
```

Current `validate` chain:
1. `npm run docs:drift`
2. `npm run build`
3. `npm run lint`
4. `npm run test`

CI runs the same pipeline through `.github/workflows/ci.yml`.

## 7) Documentation Drift Workflow
When API routes or Prisma schema changes:
1. Sync snapshots:
```powershell
npm run docs:sync
```
2. Update linked docs:
- `Docs/Specifications/API_SPEC.md`
- `Docs/Specifications/DATA_SCHEMA_SPEC.md`
- `ARCHITECTURE.md` (if boundaries/flows changed)
3. Re-run:
```powershell
npm run docs:drift
```

## 8) Source of Truth Rule
- Runtime code is authoritative.
- Docs must describe current behavior, not intended behavior.
- If docs conflict with code, fix docs in the same change.
