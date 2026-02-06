param(
  [string]$SourcePath,
  [string[]]$OutDirs
)

Write-Host "SourcePath param: $SourcePath"

function New-ResizedPng {
  param(
    [string]$InputPath,
    [int]$Size,
    [string]$Output
  )
  Add-Type -AssemblyName System.Drawing
  if (-not $InputPath) { throw 'Input path is empty' }
  $resolved = Resolve-Path -LiteralPath $InputPath
  $src = [System.Drawing.Image]::FromFile($resolved.Path)
  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::FromArgb(0,0,0,0))

  # Fit image into square without distortion
  $ratioW = $Size / $src.Width
  $ratioH = $Size / $src.Height
  $ratio = [Math]::Min($ratioW, $ratioH)
  $newW = [int]([Math]::Round($src.Width * $ratio))
  $newH = [int]([Math]::Round($src.Height * $ratio))
  $offsetX = [int](($Size - $newW) / 2)
  $offsetY = [int](($Size - $newH) / 2)
  $g.DrawImage($src, $offsetX, $offsetY, $newW, $newH)

  $bmp.Save($Output, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $src.Dispose()
}

if (-not $SourcePath) {
  $cand1 = Join-Path $PSScriptRoot '..\hm\design.png'
  $cand2 = Join-Path $PSScriptRoot '..\design.png'
  if (Test-Path $cand1) { $SourcePath = (Resolve-Path $cand1).Path }
  elseif (Test-Path $cand2) { $SourcePath = (Resolve-Path $cand2).Path }
}

Write-Host "Resolved Source: $SourcePath"

if (-not (Test-Path $SourcePath)) { Write-Error "design.png not found: $SourcePath"; exit 1 }

if (-not $OutDirs -or $OutDirs.Count -eq 0) {
  $OutDirs = @(
    (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
    (Resolve-Path (Join-Path $PSScriptRoot '..\hm')).Path
  )
}

foreach ($dir in $OutDirs) {
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  New-ResizedPng -InputPath $SourcePath -Size 16 -Output (Join-Path $dir 'favicon-16x16.png')
  New-ResizedPng -InputPath $SourcePath -Size 32 -Output (Join-Path $dir 'favicon-32x32.png')
  New-ResizedPng -InputPath $SourcePath -Size 48 -Output (Join-Path $dir 'favicon-48x48.png')
  New-ResizedPng -InputPath $SourcePath -Size 180 -Output (Join-Path $dir 'apple-touch-icon.png')

  # Write favicon.ico (32x32) using Windows icon handle
  Add-Type -Namespace Win32 -Name Gdi32 -MemberDefinition @"
  [System.Runtime.InteropServices.DllImport("user32.dll", SetLastError=true)]
  public static extern bool DestroyIcon(System.IntPtr hIcon);
"@
  Add-Type -AssemblyName System.Drawing
  $tmpPng = Join-Path $dir 'favicon-32x32.png'
  $bmp32 = [System.Drawing.Bitmap]::FromFile($tmpPng)
  $hIcon = $bmp32.GetHicon()
  $ico = [System.Drawing.Icon]::FromHandle($hIcon)
  $icoPath = Join-Path $dir 'favicon.ico'
  $fs = [System.IO.File]::Open($icoPath, [System.IO.FileMode]::Create)
  $ico.Save($fs)
  $fs.Close()
  [Win32.Gdi32]::DestroyIcon($hIcon) | Out-Null
  $bmp32.Dispose(); $ico.Dispose()
}

Write-Host 'Favicons generated in:'
$OutDirs | ForEach-Object { Write-Host ' -' $_ }
