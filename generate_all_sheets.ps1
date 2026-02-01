Add-Type -AssemblyName System.Drawing

$baseDir = "d:\000-github-repositories\phaser-2d-game-gemini\public\assets\oakwoods\character\mask_boy_01"
$outputBaseDir = "d:\000-github-repositories\phaser-2d-game-gemini\public\assets\oakwoods\character"
$targetHeight = 64

# Define animations to process: SourceFolderName -> OutputFileName
$animMap = @{
    "attack" = "mask_boy_attack.png";
    "walk_cycle" = "mask_boy_walk.png"
}

foreach ($key in $animMap.Keys) {
    $sourceDir = Join-Path $baseDir $key
    $outputFile = Join-Path $outputBaseDir $animMap[$key]
    
    Write-Output "Processing $key..."

    # Get all PNG files
    $files = Get-ChildItem -Path $sourceDir -Filter "*.png" | Sort-Object Name
    
    if ($files.Count -eq 0) {
        Write-Warning "No PNG files found in $sourceDir"
        continue
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
    Write-Output "Frames: $($files.Count), Size: $($totalWidth)x$($height)"
    Write-Output "--------------------------------"
}
