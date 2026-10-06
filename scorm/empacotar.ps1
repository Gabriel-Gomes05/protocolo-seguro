# Gera um pacote SCORM 1.2 (.zip) por módulo em dist/.
# Uso (na raiz do projeto):  powershell -ExecutionPolicy Bypass -File scorm\empacotar.ps1
# Antes de empacotar para um cliente, ajuste config.js (empresa, domínio, cor, canal).

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $raiz 'dist'
New-Item -ItemType Directory -Force $dist | Out-Null

$modulos = @(
  @{ id = 'isca';        pagina = 'modulo-1-isca.html';        script = 'modulos/01-isca.js';        titulo = 'Esquadrão Sentinela 1 - A Isca' },
  @{ id = 'forca-bruta'; pagina = 'modulo-2-forca-bruta.html'; script = 'modulos/02-forca-bruta.js'; titulo = 'Esquadrão Sentinela 2 - A Força Bruta' },
  @{ id = 'vazamento';   pagina = 'modulo-3-vazamento.html';   script = 'modulos/03-vazamento.js';   titulo = 'Esquadrão Sentinela 3 - O Vazamento' },
  @{ id = 'camaleao';    pagina = 'modulo-4-camaleao.html';    script = 'modulos/04-camaleao.js';    titulo = 'Esquadrão Sentinela 4 - O Camaleão' }
)

foreach ($m in $modulos) {
  $tmp = Join-Path ([IO.Path]::GetTempPath()) ("sentinela-" + $m.id)
  if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
  New-Item -ItemType Directory -Force $tmp | Out-Null

  $arquivos = @($m.pagina, 'config.js', 'player/player.js', 'player/player.css', 'player/elenco.js', 'player/scorm.js', $m.script)
  $arquivos += Get-ChildItem (Join-Path $raiz 'assets/personagens') -File | ForEach-Object { 'assets/personagens/' + $_.Name }
  foreach ($pasta in @('assets/fontes', 'assets/cenarios', ('assets/vozes/' + $m.id))) {
    $p = Join-Path $raiz $pasta
    if (Test-Path $p) { $arquivos += Get-ChildItem $p -File -Recurse | ForEach-Object { $_.FullName.Substring($raiz.Length + 1).Replace('\', '/') } }
  }

  foreach ($a in $arquivos) {
    $destino = Join-Path $tmp $a
    New-Item -ItemType Directory -Force (Split-Path -Parent $destino) | Out-Null
    Copy-Item (Join-Path $raiz $a) $destino
  }

  $listaArquivos = ($arquivos | ForEach-Object { "      <file href=`"$_`"/>" }) -join "`n"
  $manifesto = @"
<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="sentinela-$($m.id)" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="org">
    <organization identifier="org">
      <title>$($m.titulo)</title>
      <item identifier="item" identifierref="recurso" isvisible="true">
        <title>$($m.titulo)</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="recurso" type="webcontent" adlcp:scormtype="sco" href="$($m.pagina)">
$listaArquivos
    </resource>
  </resources>
</manifest>
"@
  [IO.File]::WriteAllText((Join-Path $tmp 'imsmanifest.xml'), $manifesto, (New-Object Text.UTF8Encoding $false))

  $zip = Join-Path $dist ("sentinela-" + $m.id + "-scorm12.zip")
  if (Test-Path $zip) { Remove-Item -Force $zip }
  # ZipFile em vez de Compress-Archive: no PowerShell 5.1 ele grava caminhos com "\", que muitos LMS rejeitam.
  Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
  $arquivoZip = [IO.Compression.ZipFile]::Open($zip, 'Create')
  try {
    foreach ($f in Get-ChildItem $tmp -File -Recurse) {
      $nome = $f.FullName.Substring($tmp.Length).TrimStart('\', '/').Replace('\', '/')
      [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($arquivoZip, $f.FullName, $nome) | Out-Null
    }
  } finally { $arquivoZip.Dispose() }
  Remove-Item -Recurse -Force $tmp
  Write-Host "OK  $zip"
}
