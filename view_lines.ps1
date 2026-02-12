$lines = Get-Content "c:\Users\mkysi\ReaderApp\app\index.js"
Write-Host "Total lines: $($lines.Count)"
Write-Host "`nLines 1875-1895:"
for ($i = 1874; $i -lt 1895; $i++) {
    Write-Host "$($i+1): $($lines[$i])"
}
