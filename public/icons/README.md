# PWA Icons

Source : `icon.svg`

## Fichiers requis

| Fichier | Taille | Usage |
|---|---|---|
| `icon-192.png` | 192×192 | Android home screen |
| `icon-512.png` | 512×512 | Android splash / Play Store |
| `icon-512-maskable.png` | 512×512 | Android adaptive icon |
| `apple-touch-icon.png` | 180×180 | iOS home screen |

## Générer les PNGs depuis l'SVG

### Avec Inkscape (CLI) :
```bash
inkscape icon.svg -w 192 -h 192 -o icon-192.png
inkscape icon.svg -w 512 -h 512 -o icon-512.png
cp icon-512.png icon-512-maskable.png
inkscape icon.svg -w 180 -h 180 -o apple-touch-icon.png
```

### Avec sharp (Node) :
```bash
npx sharp-cli -i icon.svg -o icon-192.png resize 192 192
npx sharp-cli -i icon.svg -o icon-512.png resize 512 512
```

### Online :
https://maskable.app — pour vérifier le rendu maskable
https://realfavicongenerator.net — pour générer tous les formats

## Note maskable
Pour icon-512-maskable.png, le logo doit être dans la "safe zone" (zone centrale 80%).
Le fond `#050508` plein jusqu'aux bords est parfait pour le maskable.
