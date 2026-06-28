# Referencia de `manifest.json` para mazos `.flashjp`

Este documento describe las claves que acepta el importador de FlashLingo para
crear o actualizar un mazo oficial desde `manifest.json`. Los backups de usuario
`.flashjp` generados por la app usan `backup_manifest.json` y el formato
`flashlingo_user_backup_v1`; ese perfil se documenta en
[flashjp-format.md](flashjp-format.md).

Fuente de verdad tecnica:

- `lib/features/importer/importer_service.dart`
- `lib/data/models/deck_settings.dart`

## Estructura minima del paquete

El paquete `.flashjp` oficial aceptado por la app ya no es un ZIP plano. Es un
contenedor cifrado y firmado que contiene un ZIP interno. El formato generado
actual es `flashlingo_encrypted_v3`; `flashlingo_encrypted_v2` se acepta solo
por compatibilidad con mazos antiguos. Ese ZIP interno debe tener uno de estos
layouts:

```text
manifest.json
flashcards.db
audio/word_001.mp3
images/cover.png
```

```text
starter_pack/
  manifest.json
  flashcards.db
  audio/word_001.mp3
  images/cover.png
```

Si hay mas de un `manifest.json`, se usa el que este mas cerca de la raiz
extraida.

## Reglas generales

- `manifest.json` debe ser un objeto JSON.
- Las claves desconocidas se ignoran.
- Si una clave conocida viene con un tipo invalido, se usa su valor por defecto.
- Los numeros pueden venir como numero JSON o como string parseable.
- Los decimales escritos como string aceptan coma o punto decimal.
- Las claves de configuracion del mazo van dentro de `settings`.
- `new_card_min_correct_reps` y `new_card_intra_day_minutes` tambien se aceptan
  en la raiz por compatibilidad. Si aparecen tambien en `settings`, gana el
  valor de `settings`.

## Claves de raiz

| Clave | Obligatoria | Tipo | Descripcion |
| --- | --- | --- | --- |
| `language_id` | Si | `String` | Codigo de idioma usado como `isoCode` y para construir los tipos `{language_id}_recog` y `{language_id}_prod`. |
| `pack_name` | Si | `String` | Nombre importado del mazo. |
| `db_filename` | Si | `String` | Nombre o ruta relativa del SQLite dentro del paquete. |
| `settings` | No | `Object` | Configuracion del mazo. |
| `new_card_min_correct_reps` | No | entero | Alias raiz para la misma clave de `settings`. |
| `new_card_intra_day_minutes` | No | entero | Alias raiz para la misma clave de `settings`. |
| `deck_icon` | No | `String` | Referencia a un icono incluido en el paquete. |
| `deckIcon` | No | `String` | Alias de `deck_icon`. |
| `deck_icon_path` | No | `String` | Alias de `deck_icon`. |
| `deckIconPath` | No | `String` | Alias de `deck_icon`. |
| `icon` | No | `String` | Alias de `deck_icon`. |
| `icon_path` | No | `String` | Alias de `deck_icon`. |
| `iconPath` | No | `String` | Alias de `deck_icon`. |

## Claves dentro de `settings`

| Clave | Tipo | Default importador | Valor aceptado al importar | Descripcion |
| --- | --- | --- | --- | --- |
| `new_cards_per_day` | entero | `20` | `0..10000` | Maximo de tarjetas nuevas disponibles por dia de estudio. |
| `max_reviews_per_day` | entero | `200` | `0..100000` | Maximo de reviews no nuevas por dia de estudio. |
| `hide_new_cards_on_review_overflow` | booleano | `false` | booleano parseable | Si es `true`, oculta nuevas cuando los reviews del dia tienen overflow. |
| `study_reminders_enabled` | booleano | `true` | booleano parseable | Activa o desactiva recordatorios de estudio para el mazo. |
| `study_reminder_interval_hours` | entero | `3` | `1..168` | Intervalo minimo entre recordatorios, en horas. |
| `day_cutoff_hour` | entero | `4` | `0..23` | Hora en la que empieza el dia de estudio. |
| `day_cutoff_minute` | entero | `0` | `0..59` | Minuto en el que empieza el dia de estudio. |
| `new_card_min_correct_reps` | entero | `2` | `1..20` | Aciertos necesarios en fase inicial de una tarjeta nueva. |
| `new_card_intra_day_minutes` | entero | `10` | `1..1440` | Minutos entre repeticiones intra-dia de tarjetas nuevas. |
| `learning_steps` | lista de decimales | `[1.0, 4.0]` | valores finitos `> 0`, clamp `1/1440..3650`, maximo 50 pasos | Pasos fijos de aprendizaje en dias. Admite fracciones. |
| `p_min` | decimal | `0.9` | `0.000001..0.999999` | Probabilidad minima usada por la formula SRS. |
| `alpha` | decimal | `0.1` | `0..10` | Reduccion de `nt` despues de un acierto en review. |
| `beta` | decimal | `0.5` | `0..10` | Aumento de `nt` despues de un fallo en review. |
| `offset` | decimal | `0.0` | `-3650..3650` | Dias restados al intervalo calculado. |
| `initial_nt` | decimal | `0.015` | `0.000001..3650` | Tasa inicial de olvido usada al crear tarjetas nuevas. |
| `lapse_tolerance` | entero | `0` | `0..1000` | Fallos consecutivos antes de mandar una tarjeta a relearning. `0` desactiva ese castigo duro. |
| `use_fixed_interval_on_lapse` | booleano | `true` | booleano parseable | Si es `true`, un fallo en review usa `lapse_fixed_interval`. |
| `lapse_fixed_interval` | decimal | `1.0` | `1/1440..3650` | Intervalo fijo tras lapse, en dias. `0.5` equivale a 12 horas. |
| `enable_write_mode` | booleano | `false` | booleano parseable | Activa modo escritura para tarjetas de produccion. |
| `write_mode_threshold` | entero | `80` | `0..100` | Porcentaje minimo para permitir `Good` en modo escritura. |
| `write_mode_max_reps` | entero | `0` | `0..1000000` | Repeticiones maximas antes de dejar de pedir escritura. `0` significa sin limite. |
| `enable_undo` | booleano | `true` | booleano parseable | Activa el boton de deshacer en sesiones de estudio. |
| `study_mix_mode` | string | `reviews_first` | ver valores abajo | Orden base de mezcla entre reviews y nuevas. |
| `interleave_reviews_count` | entero | `2` | `1..9999` | Tamano del bloque de reviews cuando `study_mix_mode` intercala. |
| `interleave_new_cards_count` | entero | `1` | `1..9999` | Tamano del bloque de nuevas cuando `study_mix_mode` intercala. |
| `deck_icon` | `String` | ninguno | referencia de media | Alias de icono dentro de `settings`. |
| `deckIcon` | `String` | ninguno | referencia de media | Alias de icono dentro de `settings`. |
| `deck_icon_path` | `String` | ninguno | referencia de media | Alias de icono dentro de `settings`. |
| `deckIconPath` | `String` | ninguno | referencia de media | Alias de icono dentro de `settings`. |
| `icon` | `String` | ninguno | referencia de media | Alias de icono dentro de `settings`. |
| `icon_path` | `String` | ninguno | referencia de media | Alias de icono dentro de `settings`. |
| `iconPath` | `String` | ninguno | referencia de media | Alias de icono dentro de `settings`. |

## Valores de `study_mix_mode`

`study_mix_mode` acepta exactamente estos strings:

| Valor | Comportamiento |
| --- | --- |
| `new_first` | Muestra nuevas antes que reviews. |
| `reviews_first` | Muestra reviews antes que nuevas. |
| `interleave_reviews_then_new` | Intercala bloque de reviews y luego bloque de nuevas. |
| `interleave_new_then_reviews` | Intercala bloque de nuevas y luego bloque de reviews. |

Si el valor no coincide, se usa `reviews_first`.

## Conversion de tipos

### Enteros

- `int`: se usa tal cual.
- `num`: se convierte con `toInt()`.
- `String`: se parsea con `int.tryParse(trim())`.
- Si falla, se usa el default o el valor previo de fallback.

### Decimales

- `double`: se usa tal cual.
- `num`: se convierte con `toDouble()`.
- `String`: se hace `trim()` y se reemplaza `,` por `.` antes de parsear.
- Si falla, se usa el default o el valor previo de fallback.

### Booleanos

Valores aceptados:

- `true` / `false`
- numeros: `0` es `false`, cualquier otro numero es `true`
- strings: `true`, `false`, `1`, `0`, `yes`, `no`, `si` y `sí`

### Listas de decimales

`learning_steps` debe ser un array JSON:

```json
"learning_steps": [0.25, 1.0, 4.0]
```

Tambien acepta strings numericos dentro del array:

```json
"learning_steps": ["0.25", "1", "4"]
```

Los valores no positivos o no parseables se descartan. Si no queda ningun paso
valido, se usa `[1.0, 4.0]`.

## Icono del mazo

El icono debe ser un archivo incluido en el paquete. Puede indicarse en raiz o
dentro de `settings` con cualquiera de los alias documentados.

Resolucion de media:

1. ruta exacta relativa al paquete
2. ruta exacta dentro del ZIP interno
3. nombre de archivo, solo cuando la referencia tambien es un nombre simple
4. variantes decodificadas y lowercase de las reglas anteriores
5. stem sin extension dentro del mismo tipo de media

La regla de stem permite, por ejemplo, que `AUDIO_PALABRA` apunte a
`de-DE00001_PALABRA.wav` mientras el ZIP contiene
`media/de-DE00001_PALABRA.mp3`. Esa coincidencia solo se aplica entre audios.
Una imagen con el mismo stem no se copiara para una referencia de audio, ni un
audio se copiara para una referencia de imagen. Los archivos sin extension se
omiten como media.

## Ejemplo completo de `manifest.json`

```json
{
  "language_id": "ja",
  "pack_name": "Japones Basico",
  "db_filename": "flashcards.db",
  "deck_icon": "images/cover.png",
  "settings": {
    "new_cards_per_day": 20,
    "max_reviews_per_day": 200,
    "hide_new_cards_on_review_overflow": false,
    "study_reminders_enabled": true,
    "study_reminder_interval_hours": 3,
    "day_cutoff_hour": 4,
    "day_cutoff_minute": 0,
    "new_card_min_correct_reps": 2,
    "new_card_intra_day_minutes": 10,
    "learning_steps": [1.0, 4.0],
    "p_min": 0.9,
    "alpha": 0.1,
    "beta": 0.5,
    "offset": 0.0,
    "initial_nt": 0.015,
    "lapse_tolerance": 0,
    "use_fixed_interval_on_lapse": true,
    "lapse_fixed_interval": 1.0,
    "enable_write_mode": false,
    "write_mode_threshold": 80,
    "write_mode_max_reps": 0,
    "enable_undo": true,
    "study_mix_mode": "reviews_first",
    "interleave_reviews_count": 2,
    "interleave_new_cards_count": 1
  }
}
```

## Campos que no debe configurar el manifest

Estos campos existen en la base local, pero son estado interno o rutas
persistidas por la app:

- `id`
- `deckIconUri`
- `newCardsSeenToday`
- `lastNewCardStudyDate`

No los escribas en `manifest.json`. Para icono usa los alias de icono y una ruta
a un archivo incluido en el paquete.

## Crear un mazo nuevo

Cuando se crea un mazo nuevo:

- se crea `DeckSettings` desde `settings`
- se normalizan todos los rangos anteriores
- si hay icono resoluble, se guarda como `deckIconUri`
- cada fila SQLite genera dos tarjetas:
  - `{language_id}_recog`
  - `{language_id}_prod`
- `initial_nt` se copia como `decayRate` inicial de ambas tarjetas

## Actualizar un mazo existente

La UI normal de FlashLingo actualiza mazos con:

```text
updateDeckSettingsFromManifest: false
```

Eso preserva las configuraciones editadas por el usuario y solo refresca el
contenido importado de las tarjetas. El icono puede actualizarse si el paquete
nuevo trae uno valido.

Si una ruta interna ejecuta la importacion con:

```text
updateDeckSettingsFromManifest: true
```

entonces `settings` del manifest reemplaza la configuracion del mazo. Aun asi se
preservan los contadores de progreso diario:

- `newCardsSeenToday`
- `lastNewCardStudyDate`

Tambien se conserva el icono previo si el paquete nuevo no trae un icono valido.

## Recomendaciones para creadores de mazos

- Usa siempre `settings` para configuracion de mazo.
- Mantener `new_card_min_correct_reps` y `new_card_intra_day_minutes` en raiz es
  opcional y solo se recomienda por compatibilidad con paquetes antiguos.
- Escribe `study_mix_mode` exactamente como uno de los valores permitidos.
- Mantén los valores dentro de los rangos aceptados para evitar clamps
  silenciosos.
- Usa rutas relativas exactas para `db_filename`, audio, imagenes e icono.
- Si cambias la extension real de audio o imagen, conserva el mismo nombre sin
  extension; el fallback por stem solo se aplica dentro del mismo tipo de media.
