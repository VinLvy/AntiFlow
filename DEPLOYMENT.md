# Deployment Guide to Google Cloud Platform (GCP) and Vercel

This document explains the steps to deploy the application (Backend & Frontend). The Backend will be deployed to **Google Cloud Run**, and the Frontend to **Vercel**.

## 1. Preparation & Installation (First Time Only)

Before starting, ensure you have a Google Cloud Platform account with active billing.

### Install Google Cloud SDK (gcloud CLI)
We need the `gcloud` CLI to interact with GCP.

**For Windows (using Winget):**
Open PowerShell as Administrator and run:
```powershell
winget install Google.CloudSDK
```

> **IMPORTANT:** After installation is complete, close all terminal windows (VS Code, PowerShell, CMD) and reopen them so the `gcloud` command is recognized.

### Login & Project Initialization
After reopening the terminal, run:
```bash
gcloud init
```
1. A browser will open, please login with your Google account.
2. Back in the terminal, select the GCP Project you want to use (create a new one if it doesn't exist).
3. (Optional) Select a default region/zone (e.g., `asia-southeast2` for Jakarta).

### Setup Service Account Permissions (IMPORTANT)
Deployment using `--source` requires Google Cloud Build. Often, the *default service account* does not have sufficient permissions by default. If you see a `PERMISSION_DENIED` error during deployment, run these commands in PowerShell:

```powershell
# Setup variables (adjust if your project name is different)
$ProjectId = "antiflow-backend"
$ProjectNumber = gcloud projects describe $ProjectId --format="value(projectNumber)"

# 1. Grant Cloud Build Editor access
gcloud projects add-iam-policy-binding $ProjectId --member="serviceAccount:${ProjectNumber}-compute@developer.gserviceaccount.com" --role="roles/cloudbuild.builds.editor"

# 2. Grant Storage Admin access (for source code access)
gcloud projects add-iam-policy-binding $ProjectId --member="serviceAccount:${ProjectNumber}-compute@developer.gserviceaccount.com" --role="roles/storage.admin"
```

---

## 2. Backend Deployment (FastAPI)

Ensure you are in the root directory of the `prototype-6` project in the terminal.

1. Navigate to the backend folder:
   ```powershell
   cd backend
   ```

2. Run the deploy command:
   ```powershell
   gcloud run deploy antiflow-backend --source . --region asia-southeast2 --allow-unauthenticated
   ```
   
   **Command Explanation:**
   - `antiflow-backend`: Service name in Cloud Run.
   - `--source .`: Uses current source code (Google Cloud will automatically detect the `Dockerfile`).
   - `--region asia-southeast2`: Server location (Jakarta).
   - `--allow-unauthenticated`: Makes the API publicly accessible (without Google IAM login).

3. If successful, the terminal will display the Service URL (example: `https://antiflow-backend-xyz-et.a.run.app`). **Copy this URL** as it will be used in the Frontend.

---

## 3. Frontend Deployment (Vercel)

Vercel is the best platform for deploying Next.js applications. It is highly recommended to use Vercel over Cloud Run for the frontend due to automatic optimization and ease of setup.

### Method 1: Deploy via GitHub (Recommended)
1.  Push your `prototype-6` project code to your GitHub repository (Public/Private).
2.  Open [Vercel Dashboard](https://vercel.com/dashboard) and login.
3.  Click **"Add New..."** > **"Project"**.
4.  Import the `prototype-6` GitHub repository you just pushed.
5.  In the **"Root Directory"** configuration, click **Edit** and select the `frontend` folder (Since this project is a monorepo).
6.  In the **Environment Variables** section:
    - Add key: `NEXT_PUBLIC_API_URL`
    - Enter value: Your Cloud Run Backend URL (from Step 2).
    - Example: `https://antiflow-backend-xyz-et.a.run.app` (without a trailing slash).
7.  Click **Deploy**.

### Method 2: Deploy via Vercel CLI (If not using GitHub)
1.  Install Vercel CLI: `npm i -g vercel`
2.  Navigate to the frontend folder: `cd frontend`
3.  Run command: `vercel`
4.  Follow the instructions in the terminal (Login, Setup Project).
5.  When asked "Do you want to override the settings?", answer `No` unless you know what you are doing.
6.  After the project is created, add the Environment Variable via Vercel dashboard (Settings > Environment Variables) or via CLI:
    ```bash
    vercel env add NEXT_PUBLIC_API_URL
    # Enter Cloud Run Backend URL as value
    ```
7.  Redeploy so the env var is read: `vercel --prod`

Your web application is now live on a Vercel domain (example: `antiflow-frontend.vercel.app`)!

---

## Troubleshooting

- **"gcloud not recognized" Error**: Restart your computer or terminal if you just installed the SDK.
- **Deployment Error**: Open Google Cloud Console -> Cloud Run, click the "Logs" tab to see detailed errors for the failed service.
- **Costs**: Cloud Run has a free tier, but ensure to shut down services if not in use to avoid unexpected charges if traffic is high.
