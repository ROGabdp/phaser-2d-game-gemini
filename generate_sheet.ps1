Add-Type -AssemblyName System.Drawing

$sourceDir = "d:\000-github-repositories\phaser-2d-game-gemini\public\assets\oakwoods\character\mask_boy_01"
$outputFile = "d:\000-github-repositories\phaser-2d-game-gemini\public\assets\oakwoods\character\mask_boy_idle.png"
$targetHeight = 64

# Get all PNG files
$files = Get-ChildItem -Path $sourceDir -Filter "*.png" | Sort-Object Name

if ($files.Count -eq 0) {
    Write-Error "No PNG files found in $sourceDir"
    exit 1
}

# Load first image to calculate aspect ratio and width
$firstImg = [System.Drawing.Image]::FromFile($files[0].FullName)
$aspect = $firstImg.Width / $firstImg.Height
$targetWidth = [int]($targetHeight * $aspect)
$firstImg.Dispose()

$totalWidth = $targetWidth * $files.Count
$height = $targetHeight

# Create bitmap for the spritesheet
$sheet = New-Object System.Drawing.Bitmap($totalWidth, $height)
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$currentX = 0

Write-Output "Processing $($files.Count) frames..."

foreach ($file in $files) {
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    
    # Draw resized image onto sheet
    $rect = New-Object System.Drawing.Rectangle($currentX, 0, $targetWidth, $targetHeight)
    $g.DrawImage($img, $rect)
    
    $img.Dispose()
    $currentX += $targetWidth
}

$g.Dispose()
$sheet.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
$sheet.Dispose()

Write-Output "Created spritesheet: $outputFile"
Write-Output "Dimensions: $($totalWidth)x$($height)"
Write-Output "Frame Size: $($targetWidth)x$($targetHeight)"
Write-Output "Frame Count: $($files.Count)"
