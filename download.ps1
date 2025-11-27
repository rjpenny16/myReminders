# Ultrawide To-Do App - Automatic Download & Install Script (Windows)
# Detects your platform and downloads the latest release

$ErrorActionPreference = "Stop"

# Colors for output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "╔══════════════════════════════════════════════════════╗" -Color Cyan
Write-ColorOutput "║   Ultrawide To-Do App - Automatic Installer         ║" -Color Cyan
Write-ColorOutput "╚══════════════════════════════════════════════════════╝" -Color Cyan
Write-Host ""

# Detect architecture
$Arch = [System.Environment]::Is64BitOperatingSystem
$ArchString = if ($Arch) { "64-bit" } else { "32-bit" }

Write-ColorOutput "🔍 Detecting your system..." -Color Yellow
Write-ColorOutput "   OS: Windows $ArchString" -Color Green
Write-Host ""

if (-not $Arch) {
    Write-ColorOutput "❌ This application requires 64-bit Windows" -Color Red
    exit 1
}

# GitHub repository
$Repo = "rjpenny16/myReminders"
$ApiUrl = "https://api.github.com/repos/$Repo/releases/latest"

Write-ColorOutput "📡 Fetching latest release information..." -Color Yellow

try {
    # Get latest release info
    $ReleaseData = Invoke-RestMethod -Uri $ApiUrl -UseBasicParsing
    $Version = $ReleaseData.tag_name

    Write-ColorOutput "✓ Latest version: $Version" -Color Green
    Write-Host ""

    # Find the .msi installer
    $MsiAsset = $ReleaseData.assets | Where-Object { $_.name -like "*.msi" } | Select-Object -First 1

    if (-not $MsiAsset) {
        Write-ColorOutput "❌ Could not find Windows installer (.msi) in the latest release" -Color Red
        Write-ColorOutput "Please visit the releases page:" -Color Yellow
        Write-ColorOutput "https://github.com/$Repo/releases" -Color Cyan
        exit 1
    }

    $DownloadUrl = $MsiAsset.browser_download_url
    $Filename = $MsiAsset.name

    Write-ColorOutput "📦 Downloading Windows installer..." -Color Yellow
    Write-ColorOutput "   URL: $DownloadUrl" -Color Cyan
    Write-ColorOutput "   File: $Filename" -Color Green
    Write-Host ""

    # Download to Downloads folder
    $DownloadPath = Join-Path $env:USERPROFILE "Downloads\$Filename"

    Write-ColorOutput "⬇️  Downloading to $DownloadPath..." -Color Yellow

    # Download with progress
    $ProgressPreference = 'Continue'
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $DownloadPath -UseBasicParsing

    Write-Host ""
    Write-ColorOutput "✓ Download complete!" -Color Green
    Write-Host ""

    # Installation instructions
    Write-ColorOutput "📋 Installation options:" -Color Yellow
    Write-Host "   1. Run the installer now (recommended)"
    Write-Host "   2. Open Downloads folder to install later"
    Write-Host ""

    $Response = Read-Host "Choose an option (1/2)"

    switch ($Response) {
        "1" {
            Write-ColorOutput "🚀 Launching installer..." -Color Yellow
            Start-Process -FilePath $DownloadPath -Wait
            Write-ColorOutput "✓ Installation complete!" -Color Green
            Write-ColorOutput "You can now launch Ultrawide To-Do from your Start Menu" -Color Green
        }
        "2" {
            Write-ColorOutput "📂 Opening Downloads folder..." -Color Yellow
            Start-Process (Split-Path $DownloadPath)
            Write-ColorOutput "✓ Installer saved to Downloads folder" -Color Green
        }
        default {
            Write-ColorOutput "📂 Installer saved to:" -Color Yellow
            Write-ColorOutput "   $DownloadPath" -Color Cyan
        }
    }

    Write-Host ""
    Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -Color Green
    Write-ColorOutput "🎉 Ultrawide To-Do App downloaded successfully!" -Color Green
    Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -Color Green

} catch {
    Write-Host ""
    Write-ColorOutput "❌ Error: $($_.Exception.Message)" -Color Red
    Write-ColorOutput "Please try downloading manually:" -Color Yellow
    Write-ColorOutput "https://github.com/$Repo/releases" -Color Cyan
    exit 1
}
