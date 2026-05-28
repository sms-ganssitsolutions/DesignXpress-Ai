#!/bin/bash

# ============================================================
# DesignXpress AI - Template Initialization Script (Unix) - Aggressive Mode
# ============================================================

echo "🚀 Welcome to the DesignXpress AI Template Initializer (Aggressive Mode)!"

read -p "Enter your new project name (e.g. MyAwesomeAIStudio): " projectName
projectSlug=$(echo "$projectName" | tr -d ' ' | tr -cd '[:alnum:]')
projectSlugLower=$(echo "$projectSlug" | tr '[:upper:]' '[:lower:]')

read -p "Enter a short description (optional): " description

if [ -z "$description" ]; then
    description="An AI-powered video creation platform"
fi

echo "Initializing project as '$projectName' ($projectSlugLower)..."

replace_in_file() {
    local file=$1
    local search=$2
    local replace=$3
    if [ -f "$file" ]; then
        sed -i "s|$search|$replace|g" "$file" 2>/dev/null || true
        echo "  Updated: $file"
    fi
}

# Update package.json files
replace_in_file "package.json" '"designxpress-ai-story-video-studio"' "\"$projectSlugLower\""
replace_in_file "frontend/package.json" '"designxpress-frontend"' "\"$projectSlugLower-frontend\""
replace_in_file "backend/package.json" '"designxpress-backend"' "\"$projectSlugLower-backend\""

# Update Docker files
replace_in_file "docker-compose.yml" "designxpress" "$projectSlugLower"
replace_in_file "docker-compose.prod.yml" "designxpress" "$projectSlugLower"

# Update environment files
replace_in_file ".env.example" "designxpress" "$projectSlugLower"
replace_in_file ".env.production.example" "designxpress" "$projectSlugLower"
replace_in_file "backend/.env.example" "designxpress" "$projectSlugLower"

# Update documentation
replace_in_file "README.md" "DESIGNXPRESS AI STORY VIDEO STUDIO" "$projectName"
replace_in_file "README.md" "DesignXpress AI" "$projectName"
replace_in_file "TEMPLATE.md" "DesignXpress AI" "$projectName"

# Update all docs
find docs -name "*.md" -type f -exec sed -i "s/DesignXpress AI/$projectName/g" {} + 2>/dev/null || true

echo ""
echo "✅ Aggressive renaming complete!"
echo ""
echo "Next steps:"
echo "1. Review branding (especially frontend/public/designxpress-logo.png)"
echo "2. Add your API keys to .env files"
echo "3. Run your platform's install/setup scripts"
echo ""
echo "Happy building with: $projectName 🎉"
