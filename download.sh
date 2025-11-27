#!/bin/bash
# Ultrawide To-Do App - Automatic Download & Install Script
# Detects your platform and downloads the latest release

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Ultrawide To-Do App - Automatic Installer         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect OS and architecture
OS=$(uname -s)
ARCH=$(uname -m)

echo -e "${YELLOW}🔍 Detecting your system...${NC}"
echo -e "   OS: ${GREEN}$OS${NC}"
echo -e "   Architecture: ${GREEN}$ARCH${NC}"
echo ""

# GitHub repository
REPO="rjpenny16/myReminders"
API_URL="https://api.github.com/repos/$REPO/releases/latest"

echo -e "${YELLOW}📡 Fetching latest release information...${NC}"

# Get latest release info
RELEASE_DATA=$(curl -s "$API_URL")
VERSION=$(echo "$RELEASE_DATA" | grep '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$VERSION" ]; then
    echo -e "${RED}❌ Failed to fetch release information${NC}"
    echo -e "${YELLOW}Please check your internet connection or visit:${NC}"
    echo -e "${BLUE}https://github.com/$REPO/releases${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Latest version: $VERSION${NC}"
echo ""

# Determine the correct asset to download
DOWNLOAD_URL=""
FILENAME=""

case "$OS" in
    Linux)
        # Prefer AppImage for Linux
        DOWNLOAD_URL=$(echo "$RELEASE_DATA" | grep "browser_download_url" | grep "\.AppImage" | head -1 | cut -d '"' -f 4)

        if [ -z "$DOWNLOAD_URL" ]; then
            # Fallback to .deb
            DOWNLOAD_URL=$(echo "$RELEASE_DATA" | grep "browser_download_url" | grep "\.deb" | head -1 | cut -d '"' -f 4)
            FILENAME=$(basename "$DOWNLOAD_URL")
            echo -e "${YELLOW}📦 Downloading .deb package...${NC}"
        else
            FILENAME=$(basename "$DOWNLOAD_URL")
            echo -e "${YELLOW}📦 Downloading AppImage...${NC}"
        fi
        ;;

    Darwin)
        # macOS - detect Apple Silicon vs Intel
        if [ "$ARCH" = "arm64" ]; then
            echo -e "${YELLOW}🍎 Detected Apple Silicon Mac${NC}"
            DOWNLOAD_URL=$(echo "$RELEASE_DATA" | grep "browser_download_url" | grep "aarch64.*\.dmg" | head -1 | cut -d '"' -f 4)
        else
            echo -e "${YELLOW}🍎 Detected Intel Mac${NC}"
            DOWNLOAD_URL=$(echo "$RELEASE_DATA" | grep "browser_download_url" | grep "x64.*\.dmg" | head -1 | cut -d '"' -f 4)

            if [ -z "$DOWNLOAD_URL" ]; then
                # Fallback to .app.tar.gz
                DOWNLOAD_URL=$(echo "$RELEASE_DATA" | grep "browser_download_url" | grep "\.app\.tar\.gz" | head -1 | cut -d '"' -f 4)
            fi
        fi
        FILENAME=$(basename "$DOWNLOAD_URL")
        echo -e "${YELLOW}📦 Downloading .dmg installer...${NC}"
        ;;

    *)
        echo -e "${RED}❌ Unsupported operating system: $OS${NC}"
        echo -e "${YELLOW}Please visit the releases page manually:${NC}"
        echo -e "${BLUE}https://github.com/$REPO/releases${NC}"
        exit 1
        ;;
esac

if [ -z "$DOWNLOAD_URL" ]; then
    echo -e "${RED}❌ Could not find a compatible installer for your system${NC}"
    echo -e "${YELLOW}Please visit the releases page:${NC}"
    echo -e "${BLUE}https://github.com/$REPO/releases${NC}"
    exit 1
fi

echo -e "   URL: ${BLUE}$DOWNLOAD_URL${NC}"
echo -e "   File: ${GREEN}$FILENAME${NC}"
echo ""

# Download the file
DOWNLOAD_DIR="$HOME/Downloads"
DOWNLOAD_PATH="$DOWNLOAD_DIR/$FILENAME"

echo -e "${YELLOW}⬇️  Downloading to $DOWNLOAD_PATH...${NC}"

if curl -L -o "$DOWNLOAD_PATH" "$DOWNLOAD_URL" --progress-bar; then
    echo ""
    echo -e "${GREEN}✓ Download complete!${NC}"
    echo ""

    # Platform-specific installation instructions
    case "$OS" in
        Linux)
            if [[ "$FILENAME" == *.AppImage ]]; then
                echo -e "${YELLOW}📋 Installation steps:${NC}"
                echo -e "   1. Make the AppImage executable:"
                echo -e "      ${BLUE}chmod +x \"$DOWNLOAD_PATH\"${NC}"
                echo -e "   2. Run the AppImage:"
                echo -e "      ${BLUE}\"$DOWNLOAD_PATH\"${NC}"
                echo ""
                echo -e "${YELLOW}🚀 Would you like to run it now? (y/n)${NC}"
                read -r response
                if [[ "$response" =~ ^[Yy]$ ]]; then
                    chmod +x "$DOWNLOAD_PATH"
                    "$DOWNLOAD_PATH" &
                    echo -e "${GREEN}✓ App launched!${NC}"
                fi
            elif [[ "$FILENAME" == *.deb ]]; then
                echo -e "${YELLOW}📋 Installation steps:${NC}"
                echo -e "   Run: ${BLUE}sudo dpkg -i \"$DOWNLOAD_PATH\"${NC}"
                echo ""
                echo -e "${YELLOW}🚀 Install now? (requires sudo) (y/n)${NC}"
                read -r response
                if [[ "$response" =~ ^[Yy]$ ]]; then
                    sudo dpkg -i "$DOWNLOAD_PATH"
                    echo -e "${GREEN}✓ Installation complete! Launch from your applications menu.${NC}"
                fi
            fi
            ;;

        Darwin)
            echo -e "${YELLOW}📋 Installation steps:${NC}"
            echo -e "   1. Open the downloaded file:"
            echo -e "      ${BLUE}open \"$DOWNLOAD_PATH\"${NC}"
            echo -e "   2. Drag the app to your Applications folder"
            echo ""
            echo -e "${YELLOW}🚀 Open the installer now? (y/n)${NC}"
            read -r response
            if [[ "$response" =~ ^[Yy]$ ]]; then
                open "$DOWNLOAD_PATH"
                echo -e "${GREEN}✓ Installer opened!${NC}"
            fi
            ;;
    esac

    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 Ultrawide To-Do App downloaded successfully!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

else
    echo ""
    echo -e "${RED}❌ Download failed${NC}"
    echo -e "${YELLOW}Please try downloading manually:${NC}"
    echo -e "${BLUE}$DOWNLOAD_URL${NC}"
    exit 1
fi
