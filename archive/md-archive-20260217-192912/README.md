# VTDR - Virtual Theme Development Runtime

VTDR is a specialized runtime environment and dashboard for developing and simulating Salla themes in a decoupled, virtualized environment.

## 🚀 Quick Start

To start the entire environment (UI, API, Mock Platform, and Database), run:

```powershell
npm run dev
```

## 🏗️ Architecture

For detailed information on the system architecture, library connections, and development practices, please refer to the **[ARCHITECTURE.md](file:///C:/Users/Bakheet/Documents/Projects/ST/ARCHITECTURE.md)** file.

## 📁 Project Structure

- `apps/ui`: React Dashboard.
- `apps/api`: Core Engine API and Mock Salla Server.
- `packages/contracts`: Shared types and interfaces.
- `packages/data`: Prisma-based persistence layer.
- `packages/engine`: Simulation and composition logic.
- `packages/themes`: Local Salla theme templates.

## 📜 Technical Reference

- [Architecture Guide](file:///C:/Users/Bakheet/Documents/Projects/ST/ARCHITECTURE.md)
- [Prisma Schema](file:///C:/Users/Bakheet/Documents/Projects/ST/packages/data/prisma/schema.prisma)
