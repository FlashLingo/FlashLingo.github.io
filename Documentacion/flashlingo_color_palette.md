# FlashLingo color palette

Este documento resume la identidad visual actual de FlashLingo segun
`lib/theme/app_ui_colors.dart`, `lib/theme/app_theme.dart` y los colores usados
en exportaciones PDF.

## Principios

- Interfaz clara, local-first y centrada en sesiones largas de estudio.
- Marca principal turquesa, con acentos menta, azul, durazno y lavanda.
- Estados funcionales consistentes: verde para acierto, rojo/coral para error,
  naranja para aprendizaje y rojo intenso para atrasadas.
- Modo claro y modo oscuro deben sentirse como la misma marca.
- Los graficos y PDFs reutilizan la misma paleta base.

## Tipografia

La interfaz no define una familia tipografica propia: usa la fuente por defecto
de Material/Flutter (Roboto en Android), con jerarquia basada en peso y tamano
definida en `lib/theme/app_theme.dart`:

- Titulo de AppBar: 18 px, peso 700, centrado.
- Titulo de dialogo: 20 px, peso 700; cuerpo de dialogo: 15 px, interlineado 1.45.
- Boton elevado (accion principal): 16 px, peso 700.
- Boton outlined / texto: 15 px, peso 600.
- Chips y etiquetas: peso 600.

Las fuentes embebidas en `lib/assets/fonts` (`DejaVuSans`, `DejaVuSans-Bold` y
`ArialUnicodeMS`) se usan **solo para los PDF exportados**, no para la interfaz;
estan para garantizar cobertura multilingue (incluido CJK) en los reportes.

## Formas Y Tema (Material 3)

La app usa Material 3 (`useMaterial3: true`) con `ColorScheme.fromSeed` a partir
del turquesa de marca y un estilo plano y redondeado:

- Esquinas redondeadas: tarjetas 20, dialogos 24, botones 18, campos de entrada
  y bordes 14, chips 14, snackbar 16, menus 16.
- Diseno plano: AppBar sin elevacion ni tinte de superficie, `surfaceTint`
  transparente, tarjetas con elevacion baja (2 en claro, 1 en oscuro) y botones
  sin elevacion.
- Snackbars flotantes y redondeados.
- Altura minima de botones: 52 (elevado) y 48 (outlined).
- Realces sutiles: splash con primary al 8 %, highlight transparente, seleccion
  de texto con primary translucido.
- La barra de progreso usa el color primary sobre una pista primary translucida.

## Paleta Principal

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| Primary / Turquesa | `#40C0CC` | `#4BD3E0` | Marca, botones principales, progreso, iconos activos. |
| Menta | `#8EDFD4` | `#6EE4D7` | Estados positivos suaves, apoyo visual. |
| Azul claro | `#8CCBFF` | `#7EB6FF` | Informacion, secundarios, graficos. |
| Durazno | `#FFC19E` | `#FFB68C` | Acciones intermedias, notas, paneles calidos. |
| Lavanda | `#CDB7F0` | `#D1B8FF` | Modo escritura, contenido linguistico, detalles especiales. |

## Estados

| Estado | Light | Dark | Uso |
| --- | --- | --- | --- |
| Success | `#4FB477` | `#4ADE80` | Boton Good, respuestas correctas, review positivo. |
| Danger | `#F66B6B` | `#FF5C5C` | Boton Bad, errores, fallos. |
| Overdue | `#D83A3A` | `#FF6B6B` | Tarjetas atrasadas. |
| Learning | `#FF8A00` | `#FFB020` | Tarjetas en learning/relearning. |

## Neutros

| Token | Light | Dark |
| --- | --- | --- |
| Background | `#F3F4F6` | `#0F172A` |
| Background alt | `#F8FAFC` | `#162235` |
| Surface | `#FFFFFF` | `#1E293B` |
| Border | `#E5E7EB` | `#334155` |
| Text primary | `#374151` | `#E2E8F0` |
| Text secondary | `#6B7280` | `#94A3B8` |

## Area De Estudio

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| Study word | `#6B4DE6` | `#D1B8FF` | Palabra principal y lectura. |
| Study text | `#2E246B` | `#E2E8F0` | Texto de tarjeta. |
| Study line | `#E6DFFF` | `#334155` | Separadores internos. |

## Aplicacion Por Pantalla

### Home

- Fondo: `lightBackground` / `darkBackground`.
- Cards de mazo: `surface`.
- Logo: icono `ICO_2.png` y texto Flash en primary, Lingo en texto principal.
- Nuevas: primary/info.
- Learning: warning.
- Reviews: success.
- Overdue: overdue.
- Precision 7d: texto secundario.

### Importacion

- Dialogos y resumen usan `surface`.
- Barra de progreso usa primary.
- Chips de resumen usan primary, secondary, warning y success.
- Errores de importacion usan danger.

### Estudio

- Barra superior indica progreso y una franja de color por tipo/estado:
  - new: info
  - learning inicial: warning
  - review/resto: success
- Tarjeta HTML usa fondo claro/oscuro propio:
  - light page: `rgb(248, 250, 252)`
  - dark page: `rgb(15, 23, 42)`
- Boton Show answer: primary.
- Boton Show reading: warning.
- Bad: danger.
- Good: success.
- Write mode usa lavanda y muestra diferencias en verde/rojo.

### Settings

- Limites diarios y algoritmo usan primary.
- Day cutoff usa secondary.
- Write mode usa lavender/tertiary.
- Undo usa peach.
- Lapses usan primary y danger segun estado.

### Stats

- Graficos reutilizan primary, success, warning, danger, lavender y blue.
- Heatmap usa intensidad progresiva: surface alt, primary soft, mint, blue,
  brand.
- Problem cards usan tags y acciones con los colores de estado.

### PDF

Los PDF usan `AppPdfColors` con la misma paleta clara:

- brand `#40C0CC`
- mint `#8EDFD4`
- blue `#8CCBFF`
- peach `#FFC19E`
- lavender `#CDB7F0`
- success `#4FB477`
- danger `#F66B6B`
- overdue `#D83A3A`
- learning `#FF8A00`

## Variables De Referencia

```dart
const flLightPrimary = Color(0xFF40C0CC);
const flLightMint = Color(0xFF8EDFD4);
const flLightBlue = Color(0xFF8CCBFF);
const flLightPeach = Color(0xFFFFC19E);
const flLightLavender = Color(0xFFCDB7F0);

const flDarkPrimary = Color(0xFF4BD3E0);
const flDarkMint = Color(0xFF6EE4D7);
const flDarkBlue = Color(0xFF7EB6FF);
const flDarkPeach = Color(0xFFFFB68C);
const flDarkLavender = Color(0xFFD1B8FF);
```

## Reglas Para Material De Marketing

- Usar turquesa como color de marca dominante.
- Mostrar la app como moderna, clara y local-first.
- Evitar fondos muy oscuros si no representan una pantalla real de modo oscuro.
- Para pagina web o screenshots, priorizar:
  - home con mazos y contadores
  - tarjeta de estudio con palabra, audio e imagen
  - panel de estadisticas con graficos
  - import summary o write mode como funciones diferenciadoras
