# Script pour copier les fichiers de police Stardom
# Utilisation: .\copy-stardom-fonts.ps1 "chemin/vers/WEB/font"

param(
    [string]$SourcePath = ""
)

if ([string]::IsNullOrEmpty($SourcePath)) {
    Write-Host "Veuillez spécifier le chemin vers votre dossier WEB/font" -ForegroundColor Yellow
    Write-Host "Exemple: .\copy-stardom-fonts.ps1 'C:\Users\VotreNom\Downloads\Stardom\WEB\font'" -ForegroundColor Yellow
    Write-Host ""
    $SourcePath = Read-Host "Entrez le chemin complet vers le dossier WEB/font"
}

$DestinationPath = "public\fonts"

# Vérifier que le dossier source existe
if (-not (Test-Path $SourcePath)) {
    Write-Host "Erreur: Le dossier source n'existe pas: $SourcePath" -ForegroundColor Red
    exit 1
}

# Créer le dossier de destination s'il n'existe pas
if (-not (Test-Path $DestinationPath)) {
    New-Item -ItemType Directory -Path $DestinationPath | Out-Null
    Write-Host "Dossier créé: $DestinationPath" -ForegroundColor Green
}

# Fichiers à copier
$filesToCopy = @(
    "Stardom-Regular.woff2",
    "Stardom-Regular.woff"
)

$copied = 0
$failed = 0

foreach ($file in $filesToCopy) {
    $sourceFile = Join-Path $SourcePath $file
    $destFile = Join-Path $DestinationPath $file
    
    if (Test-Path $sourceFile) {
        try {
            Copy-Item -Path $sourceFile -Destination $destFile -Force
            Write-Host "✓ Copié: $file" -ForegroundColor Green
            $copied++
        }
        catch {
            Write-Host "✗ Erreur lors de la copie de $file : $_" -ForegroundColor Red
            $failed++
        }
    }
    else {
        Write-Host "✗ Fichier introuvable: $sourceFile" -ForegroundColor Yellow
        $failed++
    }
}

Write-Host ""
if ($copied -gt 0) {
    Write-Host "✓ $copied fichier(s) copié(s) avec succès !" -ForegroundColor Green
}
if ($failed -gt 0) {
    Write-Host "✗ $failed fichier(s) n'a/ont pas pu être copié(s)" -ForegroundColor Red
}

