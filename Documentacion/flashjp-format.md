# FlashLingo `.flashjp` package format

This document summarizes the package contract consumed by
`lib/features/importer/importer_service.dart`. For the full `manifest.json`
reference, see [manifest-json-mazos.md](manifest-json-mazos.md).

## Accepted Extensions

FlashLingo accepts packages selected by the user with either extension:

- `.flashjp`
- `.zip`

Both are ZIP archives internally.

## Accepted Archive Layouts

The importer accepts both layouts:

1. Flat archive contents.
2. A single wrapper directory containing the package contents.

Examples:

```text
manifest.json
flashcards.db
audio/word_001.mp3
images/card_001.png
```

```text
starter_pack/
  manifest.json
  flashcards.db
  audio/word_001.mp3
  images/card_001.png
```

If more than one `manifest.json` exists, the importer uses the one whose path is
closest to the archive root.

## Required Files

- `manifest.json`
- SQLite database file referenced by `manifest.json.db_filename`

## `manifest.json`

Required root keys:

- `language_id`
- `pack_name`
- `db_filename`

Optional root keys:

- `settings`
- `new_card_min_correct_reps`
- `new_card_intra_day_minutes`
- `deck_icon`
- `deckIcon`
- `deck_icon_path`
- `deckIconPath`
- `icon`
- `icon_path`
- `iconPath`

Example:

```json
{
  "language_id": "ja",
  "pack_name": "FlashLingo Starter",
  "db_filename": "flashcards.db",
  "new_card_min_correct_reps": 2,
  "new_card_intra_day_minutes": 10,
  "deck_icon": "images/cover.png",
  "settings": {
    "new_cards_per_day": 20,
    "max_reviews_per_day": 200,
    "hide_new_cards_on_review_overflow": false,
    "learning_steps": [1.0, 4.0],
    "enable_write_mode": false
  }
}
```

## Supported Settings Keys

Supported deck setting keys inside `manifest.json.settings`:

- `new_cards_per_day`
- `max_reviews_per_day`
- `hide_new_cards_on_review_overflow`
- `new_card_min_correct_reps`
- `new_card_intra_day_minutes`
- `lapse_tolerance`
- `use_fixed_interval_on_lapse`
- `lapse_fixed_interval`
- `p_min`
- `alpha`
- `beta`
- `offset`
- `initial_nt`
- `learning_steps`
- `enable_write_mode`
- `write_mode_threshold`
- `write_mode_max_reps`
- `deck_icon`
- `deck_icon_path`
- `icon`
- `icon_path`

`new_card_min_correct_reps` and `new_card_intra_day_minutes` may be placed at
root or inside `settings`. If both are present, the value inside `settings`
overrides the root value.

Boolean parsing accepts:

- `true` / `false`
- `1` / `0`
- `yes` / `no`
- `si` / `si` with accent

## SQLite Contract

The importer reads a table named `flashcards`.

Columns currently consumed:

- `ID`
- `PALABRA`
- `SIGNIFICADO`
- `AUDIO_PALABRA`
- `AUDIO_ORACION`
- `IMAGEN`
- `ORACION`
- `TRADUCCION`
- `LECTURA_PALABRA`
- `LECTURA_ORACION`
- `FORMAS`

Each SQLite row produces two FlashLingo cards:

- recognition card: `{language_id}_recog`
- production card: `{language_id}_prod`

The logical identity used during import/update is:

```text
originalId + cardType
```

In code this is stored as:

```text
{originalId}::{cardType}
```

## Card Mapping

Recognition card:

- question: `PALABRA`
- answer: `SIGNIFICADO`
- sentence: `ORACION`
- translation: `TRADUCCION`
- extra data: `LECTURA_PALABRA`, `LECTURA_ORACION`, `FORMAS`, type
  `recognition`

Production card:

- question: `SIGNIFICADO`
- answer: `PALABRA`
- sentence: `TRADUCCION`
- translation: `ORACION`
- extra data: target reading, sentence reading, `FORMAS`, type `production`

Both card types reuse word audio, sentence audio, image, and initial SRS decay
rate from the imported package/settings.

## Media Resolution

Media files are copied into the app-local `media_assets` directory using UUID
file names. The importer skips `.db` files and `manifest.json`.

Lookup is attempted by:

1. exact filename/path
2. decoded filename/path
3. lowercase filename/path
4. decoded lowercase filename/path
5. stem without extension
6. basename stem when the reference includes a path

Files without an extension are skipped as media.

## Update Existing Contract

When importing with `updateExisting`, the current UI preserves deck settings
from the existing deck and only refreshes imported content and deck icon when a
new icon is provided.

Fields preserved on existing cards:

- `state`
- `nextReview`
- `reviewPriorityAnchor`
- `manualReviewOverrideDay`
- `lastReview`
- `decayRate`
- `fixedPhaseQueue`
- `learningStep`
- `consecutiveLapses`
- `repetitionCount`
- `lifetimeReviewCount`
- `lifetimeCorrectCount`
- `lifetimeWrongCount`
- `totalStudyTimeMs`
- review logs
- study sessions
- session history
- daily stats

Fields refreshed from the package:

- `question`
- `answer`
- `sentence`
- `translation`
- `audioPath`
- `sentenceAudioPath`
- `imagePath`
- `extraDataJson`
- `deckIconUri` when available

## Importer Safety Limits

The importer streams extraction from file and rejects suspicious ZIP paths. It
also applies size limits:

- max real file entries: `12000`
- max single extracted file: `128 MiB`
- max total extracted bytes: `1024 MiB`
- max single media file: `64 MiB`
- max total media bytes: `768 MiB`

SQLite rows are read in batches of `250`; Isar card writes are flushed in
batches of `400`.

## Current Importer Guarantees

- ZIP contents are extracted from file, not from a full in-memory archive blob.
- SQLite rows are read in batches.
- Isar writes are flushed in batches.
- Orphaned media is cleaned after import/update/delete.
- Duplicate logical cards inside the same import are ignored after the first
  matching row.

## Things The Importer Does Not Do

- It does not delete existing cards that are missing from the new package.
- It does not support remote downloads.
- It does not edit cards manually inside the app.
- It does not import every `DeckSettings` field from `manifest.json`; only the
  supported subset above is read.
