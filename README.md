# GitGuard AI

## Description
GitGuard AI is a Gemini-powered risk assessment tool for GitHub repositories. Designed to simulate a Chrome Extension workflow, it helps developers evaluate open-source libraries by analyzing their security, code quality, maintenance status, and licensing compliance.

## Needed Files (Project Structure)

### Core Configuration
- `metadata.json`: Application metadata and permissions.
- `index.html`: Main HTML entry point with Tailwind and Import Map.
- `README.md`: Project documentation.
- `.gitignore`: Git configuration for ignored files.

### Application Logic
- `index.tsx`: React DOM entry point.
- `App.tsx`: Main application controller.
- `types.ts`: TypeScript definitions for analysis data structures.

### Services
- `services/githubService.ts`: Fetches raw file content (README, package.json) from GitHub.
- `services/geminiService.ts`: Interacts with Google Gemini 3 Flash API for risk analysis.

### Components
- `components/Dashboard.tsx`: Main report visualization.
- `components/AnalysisCard.tsx`: Reusable card for individual risk metrics.
- `components/ScoreGauge.tsx`: Visual gauge for the overall risk score.
