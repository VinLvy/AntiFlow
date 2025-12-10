# Deploy Backend to Google Cloud Run
# Usage: .\deploy.ps1 -ProjectId "your-project-id"

param (
    [string]$ProjectId = "your-project-id",
    [string]$Region = "your-region", # Jakarta region
    [string]$ServiceName = "your-service-name"
)

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Google Cloud SDK (gcloud) is not installed or not in the PATH." -ForegroundColor Red
    Write-Host "Please install it to proceed." -ForegroundColor Yellow
    Write-Host "You can likely install it by running: winget install Google.CloudSDK" -ForegroundColor Cyan
    exit 1
}

Write-Host "Deploying $ServiceName to Cloud Run in project $ProjectId..." -ForegroundColor Cyan

# 1. Build the Docker image using Cloud Build (no local Docker required if using Cloud Build)
# OR Build locally and push. Let's use Cloud Build for simplicity if gcloud is installed.
# But simply: gcloud run deploy --source .
# This is the modern "source deploy" way, much easier.

Write-Host "Running: gcloud run deploy $ServiceName --source . --region $Region --project $ProjectId --allow-unauthenticated"
gcloud run deploy $ServiceName --source . --region $Region --project $ProjectId --allow-unauthenticated

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment Successful!" -ForegroundColor Green
} else {
    Write-Host "Deployment Failed. Please check errors above." -ForegroundColor Red
}
