# Referencia completa de `manifest.json` para mazos `.flashjp`

Este documento describe el comportamiento real del importador actual de
FlashLingo. La fuente de verdad es
`lib/features/importer/importer_service.dart`.

## Alcance

Cubre:

- claves que el importador lee desde `manifest.json`
- ubicacion valida de cada clave
- tipos aceptados por el parser
- defaults y normalizacion
- configuraciones existentes en la app que no se importan desde el manifiesto
- comportamiento al crear mazos y al actualizar mazos existentes

## Estructura Minima Del Paquete

El importador acepta dos layouts:

1. Archivos en la raiz del ZIP.
2. Un unico directorio contenedor con todo el paquete dentro.

Ejemplos validos:

```text
manifest.json
flashcards.db
audio/cat.mp3
images/cover.png
```

```text
starter_pack/
  manifest.json
  flashcards.db
  audio/cat.mp3
  images/cover.png
```

Si hay varios archivos llamados `manifest.json`, el importador usa el que tenga
la ruta mas corta, es decir, el que quede mas cerca de la raiz extraida.

## Regla General De Parseo

- `manifest.json` debe ser un objeto JSON.
- Las claves desconocidas se ignoran.
- Si una clave conocida viene con tipo invalido, se usa el fallback.
- Los `String` obligatorios se leen con `toString().trim()`.
- `language_id` no se valida contra una lista ISO; solo debe quedar no vacio.

## Claves Validas En La Raiz

| Clave | Obligatoria | Tipo esperado | Uso |
| --- | --- | --- | --- |
| `language_id` | Si | `String` | Codigo de idioma del mazo. |
| `pack_name` | Si | `String` | Nombre importado del mazo. |
| `db_filename` | Si | `String` | Nombre o ruta relativa del SQLite. |
| `settings` | No | `Object` | Configuraciones del mazo. |
| `new_card_min_correct_reps` | No | `int`/`num`/`String` entero | Aciertos iniciales para nuevas. |
| `new_card_intra_day_minutes` | No | `int`/`num`/`String` entero | Demora intra-dia para nuevas. |
| `deck_icon` | No | `String` | Referencia a icono del mazo. |
| `deckIcon` | No | `String` | Alias camelCase de icono. |
| `deck_icon_path` | No | `String` | Alias de icono. |
| `deckIconPath` | No | `String` | Alias camelCase de icono. |
| `icon` | No | `String` | Alias corto de icono. |
| `icon_path` | No | `String` | Alias corto de icono. |
| `iconPath` | No | `String` | Alias camelCase de icono. |

## Claves Validas Dentro De `settings`

| Clave | Tipo esperado | Uso |
| --- | --- | --- |
| `new_cards_per_day` | `int`/`num`/`String` entero | Limite diario de nuevas. |
| `max_reviews_per_day` | `int`/`num`/`String` entero | Limite diario de repasos. |
| `hide_new_cards_on_review_overflow` | `bool`/`num`/`String` | Oculta nuevas si el limite de repasos tiene overflow. |
| `new_card_min_correct_reps` | `int`/`num`/`String` entero | Aciertos iniciales para nuevas. |
| `new_card_intra_day_minutes` | `int`/`num`/`String` entero | Demora intra-dia para nuevas. |
| `lapse_tolerance` | `int`/`num`/`String` entero | Fallos consecutivos antes de relearning. |
| `use_fixed_interval_on_lapse` | `bool`/`num`/`String` | Usa intervalo fijo tras fallo en review. |
| `lapse_fixed_interval` | `double`/`num`/`String` numerico | Intervalo fijo tras lapse, en dias. |
| `p_min` | `double`/`num`/`String` numerico | Probabilidad minima para el intervalo. |
| `alpha` | `double`/`num`/`String` numerico | Ajuste tras acierto. |
| `beta` | `double`/`num`/`String` numerico | Ajuste tras fallo. |
| `offset` | `double`/`num`/`String` numerico | Valor restado al intervalo. |
| `initial_nt` | `double`/`num`/`String` numerico | Decaimiento inicial. |
| `learning_steps` | `List` de numeros o strings numericos | Pasos fijos de aprendizaje, en dias. |
| `enable_write_mode` | `bool`/`num`/`String` | Activa escritura en produccion. |
| `write_mode_threshold` | `int`/`num`/`String` entero | Exactitud minima para habilitar "Good". |
| `write_mode_max_reps` | `int`/`num`/`String` entero | Repeticiones maximas antes de apagar escritura. |
| `deck_icon` | `String` | Alias de icono dentro de `settings`. |
| `deck_icon_path` | `String` | Alias de icono dentro de `settings`. |
| `icon` | `String` | Alias de icono dentro de `settings`. |
| `icon_path` | `String` | Alias de icono dentro de `settings`. |

## Ubicacion De Claves

- `new_card_min_correct_reps` y `new_card_intra_day_minutes` funcionan en la
  raiz y tambien dentro de `settings`.
- Si una de esas claves aparece en ambos lugares, el valor dentro de `settings`
  gana porque se aplica despues del valor raiz.
- En la raiz se aceptan alias camelCase de icono.
- Dentro de `settings`, solo se aceptan los alias snake_case listados arriba:
  `deck_icon`, `deck_icon_path`, `icon`, `icon_path`.

## Ejemplo Completo Recomendado

```json
{
  "language_id": "ja",
  "pack_name": "Japones Basico",
  "db_filename": "flashcards.db",
  "new_card_min_correct_reps": 2,
  "new_card_intra_day_minutes": 10,
  "deck_icon": "images/cover.png",
  "settings": {
    "new_cards_per_day": 20,
    "max_reviews_per_day": 200,
    "hide_new_cards_on_review_overflow": false,
    "lapse_tolerance": 0,
    "use_fixed_interval_on_lapse": true,
    "lapse_fixed_interval": 1.0,
    "p_min": 0.9,
    "alpha": 0.1,
    "beta": 0.5,
    "offset": 0.0,
    "initial_nt": 0.015,
    "learning_steps": [1.0, 4.0],
    "enable_write_mode": false,
    "write_mode_threshold": 80,
    "write_mode_max_reps": 0
  }
}
```

## Detalle De Cada Parametro

### `language_id`

- Obligatorio.
- Se convierte a `String` y se aplica `trim()`.
- Si queda vacio, la importacion falla.
- Se usa como `isoCode` del mazo.
- Se usa para construir los tipos de tarjeta:
  - `{language_id}_recog`
  - `{language_id}_prod`

### `pack_name`

- Obligatorio.
- Se convierte a `String` y se aplica `trim()`.
- Si queda vacio, la importacion falla.
- Es el nombre logico importado.
- Si ya existe, la UI ofrece actualizar el mazo existente o crear otro nombre.
- El nombre `FlashLingo` esta reservado para el mazo de inicio guiado; una
  importacion normal con ese nombre requiere elegir otro nombre.

### `db_filename`

- Obligatorio.
- Se convierte a `String` y se aplica `trim()`.
- Puede ser nombre (`flashcards.db`) o ruta relativa (`data/flashcards.db`).
- Se busca en este orden:
  1. ruta exacta relativa a la carpeta del `manifest.json`
  2. coincidencia exacta de ruta relativa al recorrer el paquete
  3. coincidencia por basename

### `settings`

- Opcional.
- Solo se usa si es un objeto JSON.
- Si no existe o no es objeto, se usan defaults.

### `new_card_min_correct_reps`

- Opcional.
- Puede estar en raiz o dentro de `settings`.
- Default del importador: `2`.
- Rango normalizado al importar: `1..20`.
- Define cuantas respuestas correctas necesita una tarjeta nueva antes de
  completar la fase inicial intra-dia.

### `new_card_intra_day_minutes`

- Opcional.
- Puede estar en raiz o dentro de `settings`.
- Default del importador: `10`.
- Rango normalizado al importar: `1..1440`.
- Define los minutos de demora entre repeticiones intra-dia de tarjetas nuevas.

### Icono Del Mazo

Alias validos en raiz, en este orden:

1. `deck_icon`
2. `deckIcon`
3. `deck_icon_path`
4. `deckIconPath`
5. `icon`
6. `icon_path`
7. `iconPath`

Si no hay icono en raiz, se revisan dentro de `settings`:

1. `deck_icon`
2. `deck_icon_path`
3. `icon`
4. `icon_path`

La referencia puede ser ruta relativa, basename o `file://`. El archivo debe
existir dentro del paquete y tener extension.

## Defaults Del Importador

Estos defaults se usan al crear un mazo desde manifiesto. No son identicos a los
defaults del modelo `DeckSettings`.

```json
{
  "new_card_min_correct_reps": 2,
  "new_card_intra_day_minutes": 10,
  "settings": {
    "new_cards_per_day": 20,
    "max_reviews_per_day": 200,
    "hide_new_cards_on_review_overflow": false,
    "lapse_tolerance": 0,
    "use_fixed_interval_on_lapse": true,
    "lapse_fixed_interval": 1.0,
    "p_min": 0.9,
    "alpha": 0.1,
    "beta": 0.5,
    "offset": 0.0,
    "initial_nt": 0.015,
    "learning_steps": [1.0, 4.0],
    "enable_write_mode": false,
    "write_mode_threshold": 80,
    "write_mode_max_reps": 0
  }
}
```

## Normalizacion Del Importador

Despues de parsear, el importador limita valores a rangos seguros:

| Campo | Rango importado |
| --- | --- |
| `new_cards_per_day` | `0..10000` |
| `max_reviews_per_day` | `0..100000` |
| `new_card_min_correct_reps` | `1..20` |
| `new_card_intra_day_minutes` | `1..1440` |
| `lapse_tolerance` | `0..100` |
| `lapse_fixed_interval` | `1/1440..3650` dias |
| `p_min` | `0.000001..0.999999` |
| `alpha` | `0..10` |
| `beta` | `0..10` |
| `offset` | `-3650..3650` |
| `initial_nt` | `0.000001..3650` |
| `write_mode_threshold` | `0..100` |
| `write_mode_max_reps` | `0..10000` |
| `learning_steps` | valores finitos `> 0`, clamp `1/1440..3650`, maximo 50 pasos |

La UI puede tener validaciones mas amplias en algunos campos, pero al importar
mandan los rangos anteriores.

## Conversion De Tipos

### Enteros

- `int`: se usa tal cual.
- `num`: se convierte con `toInt()`.
- `String`: se usa `int.tryParse(trim())`.
- Si falla, se usa fallback.

### Decimales

- `double`: se usa tal cual.
- `num`: se convierte con `toDouble()`.
- `String`: se hace `trim()` y se reemplaza `,` por `.` antes de parsear.
- Si falla, se usa fallback.

### Booleanos

Acepta:

- `true` / `false`
- numeros: `0` es false, cualquier otro numero es true
- strings: `true`, `false`, `1`, `0`, `yes`, `no`, `si`, `si` con tilde

## Configuraciones Que Existen Pero No Se Importan

El modelo `DeckSettings` contiene mas campos que el manifiesto no lee:

- `dayCutoffHour`
- `dayCutoffMinute`
- `enableUndo`
- `studyMixMode`
- `interleaveReviewsCount`
- `interleaveNewCardsCount`
- `newCardsSeenToday`
- `lastNewCardStudyDate`
- `deckIconUri` como URI persistida directa

Si esas claves aparecen en `manifest.json`, hoy se ignoran, salvo el icono por
los alias documentados.

## Al Crear Un Mazo Nuevo

- Se crea `DeckSettings` usando el manifiesto y los defaults del importador.
- Si hay icono valido, se guarda como `deckIconUri`.
- Cada fila SQLite genera:
  - reconocimiento: `{language_id}_recog`
  - produccion: `{language_id}_prod`
- `initial_nt` se usa como `decayRate` inicial de ambas tarjetas.

## Al Actualizar Un Mazo Existente

La UI actual llama la importacion con:

```text
updateDeckSettingsFromManifest: false
```

Eso implica:

- se preservan las configuraciones del usuario
- se preservan progreso, review logs, sesiones y estadisticas diarias
- se actualiza contenido importado de las tarjetas existentes
- se agregan tarjetas nuevas que no existian
- no se eliminan tarjetas existentes ausentes del nuevo paquete
- el icono puede actualizarse si el paquete nuevo trae uno valido

Si una importacion se ejecuta internamente con
`updateDeckSettingsFromManifest: true`, el manifiesto sobreescribe settings,
pero se preservan:

- `newCardsSeenToday`
- `lastNewCardStudyDate`
- el icono previo si el paquete nuevo no resuelve un icono valido

## Recomendaciones Practicas

- Usa rutas relativas exactas para `db_filename` y media.
- Evita depender de colisiones por basename o stem.
- Da extension real a todos los assets multimedia.
- Mantén los valores dentro de los rangos normalizados.
- Usa `settings` solo para las claves soportadas.
- No asumas que cualquier campo de `DeckSettings` puede venir del manifiesto.
