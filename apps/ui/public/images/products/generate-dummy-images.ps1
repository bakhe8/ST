# سكريبت PowerShell لإنشاء صور dummy محلياً لكل منتج
# يتطلب وجود مكتبة System.Drawing.Common (متوفرة افتراضياً في .NET Framework)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$images = @(
  @{ name = 'laptop.jpg';      text = 'Laptop' },
  @{ name = 'phone.jpg';       text = 'Phone' },
  @{ name = 'headphones.jpg';  text = 'Headphones' },
  @{ name = 'shirt.jpg';       text = 'Shirt' },
  @{ name = 'dress.jpg';       text = 'Dress' },
  @{ name = 'watch.jpg';       text = 'Watch' },
  @{ name = 'bag.jpg';         text = 'Bag' },
  @{ name = 'glasses.jpg';     text = 'Glasses' },
  @{ name = 'placeholder.png'; text = 'Product' }
)

$dest = "${PSScriptRoot}"  # نفس مجلد السكريبت

foreach ($img in $images) {
    $bmp = New-Object System.Drawing.Bitmap 600,600
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::FromArgb(240,240,240))
    $fontFamily = New-Object System.Drawing.FontFamily 'Arial'
    $font = New-Object System.Drawing.Font($fontFamily, 48, [System.Drawing.FontStyle]::Bold)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = 'Center'
    $sf.LineAlignment = 'Center'
    $g.DrawString($img.text, $font, [System.Drawing.Brushes]::Gray, [System.Drawing.RectangleF]::new(0,0,600,600), $sf)
    if ($img.name -like '*.png') {
      $bmp.Save((Join-Path $dest $img.name), [System.Drawing.Imaging.ImageFormat]::Png)
    } else {
      $bmp.Save((Join-Path $dest $img.name), [System.Drawing.Imaging.ImageFormat]::Jpeg)
    }
    $g.Dispose()
    $bmp.Dispose()
}
Write-Host 'تم إنشاء جميع صور المنتجات وصورة placeholder بنجاح!'