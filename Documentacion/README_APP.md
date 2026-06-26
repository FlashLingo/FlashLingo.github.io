# FlashLingo

FlashLingo is a local-first Flutter flashcard app for Android vocabulary study.
It imports `.flashjp` deck packages, stores all user progress locally, and helps
users study recognition and production cards with spaced repetition, deck-level
settings, analytics, CSV/PDF exports, and a guided first-run tour.

## Release Scope

- Primary target: Android / Play Store
- App id: `com.flashlingo.app`
- Current app version in `pubspec.yaml`: `0.0.0+1`
- Supported UI languages in v1: English and Spanish
- Data model: fully local; no account system, no cloud sync, no remote deck
  downloads
- Monetization: AdMob banners on supported mobile builds

## Core Capabilities

- Import `.flashjp` or `.zip` deck packages.
- Preview imports, detect deck-name conflicts, and choose between updating an
  existing deck or creating a new deck name.
- Update an existing deck while preserving user progress, review history,
  sessions, daily stats, and user-edited deck settings.
- Study two generated card types per SQLite row:
  - recognition cards: `{language_id}_recog`
  - production cards: `{language_id}_prod`
- Study with configurable daily limits, review caps, learning steps, lapse
  behavior, day cutoff, undo, and queue mixing.
- Use optional write mode on production cards with typed answer comparison and a
  configurable pass threshold.
- Resume unfinished sessions and persist the current queue/index.
- Review local history for individual cards and full sessions.
- Inspect deck statistics, forecasts, problem cards, recent sessions, heatmaps,
  interval histograms, hourly distribution, and prediction charts.
- Export deck statistics as CSV files or a PDF report.
- Store package media locally and clean orphaned media after import/update/delete.
- Run an onboarding tour with a bundled starter deck.

## Project Layout

- `lib/main.dart`: app bootstrap, ads initialization, localization, themes, and
  phone/tablet orientation behavior.
- `lib/data/`: Isar models, local database setup, migrations/backfills, daily
  stats sync, study-day utilities, and review daily-limit planning.
- `lib/features/home/`: deck list, import entry point, deck actions, starter
  tour integration, rename/delete, and manual review advance.
- `lib/features/importer/`: ZIP extraction, manifest parsing, SQLite import,
  media handling, import preview/progress, and summary UI.
- `lib/features/library/`: deck overview, study queue logic, deck settings,
  card browser, review history, and deck name rules.
- `lib/features/study_session/`: study screen, WebView/HTML card rendering,
  write mode, undo, SRS transitions, session persistence, and study logs.
- `lib/features/stats/`: stats provider, charts, forecasts, problem card
  actions, CSV export, PDF export, and PDF chart rendering.
- `lib/features/settings/`: app language, theme mode, general settings, debug
  time-machine tool, and tour restart entry point.
- `lib/features/onboarding/`: guided tour state machine, starter deck handling,
  and tour overlay widgets.
- `lib/features/ads/`: AdMob id selection, initialization, and fixed banner slot.
- `lib/l10n/`: English and Spanish production strings.
- `lib/theme/`: color palette, app theme, responsive layout, and PDF colors.
- `test/`: coverage for importer behavior, SRS, queue logic, stats, PDF export,
  browser logic, settings validation, localization, and review daily limits.

Generated `*.g.dart` files are produced by Isar/Riverpod tooling and are excluded
from analyzer noise.

## Development

```bash
flutter pub get
flutter analyze
flutter test
flutter run
```

## Release Commands

```bash
flutter analyze
flutter test
flutter build appbundle --release
```

The signed Android bundle is produced at:

```text
build/app/outputs/bundle/release/app-release.aab
```

## Deck Package Contract

FlashLingo accepts package files with either extension:

- `.flashjp`
- `.zip`

The importer supports:

- flat archive contents
- a single wrapper folder containing the package contents
- `manifest.json` plus a SQLite database referenced by `db_filename`
- optional media files and an optional deck icon

See:

- [docs/flashjp-format.md](docs/flashjp-format.md)
- [docs/manifest-json-mazos.md](docs/manifest-json-mazos.md)

## Android Release Setup

Copy `android/key.properties.template` to `android/key.properties` before
building a signed release:

```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=YOUR_KEY_ALIAS
storeFile=../keystore/flashlingo-upload.jks
```

Then place the keystore file at the matching relative path.

Android release/profile builds use production AdMob ids configured in the
project:

```text
AdMob app id: ca-app-pub-9344640998798252~6893857194
Study banner unit id: ca-app-pub-9344640998798252/2573514404
Finished session banner unit id: ca-app-pub-9344640998798252/7412731941
```

To override them for a specific Android build, pass:

```bash
FLASHLINGO_ADMOB_ANDROID_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
--dart-define=ADMOB_ANDROID_STUDY_BANNER_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
--dart-define=ADMOB_ANDROID_FINISHED_BANNER_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
```

Debug builds keep using Google's sample AdMob ids.

## Documentation

- Website/product brief: [docs/flashlingo-descripcion-web.md](docs/flashlingo-descripcion-web.md)
- Android release checklist: [docs/android-release-checklist.md](docs/android-release-checklist.md)
- Manual QA matrix: [docs/manual-qa-matrix.md](docs/manual-qa-matrix.md)
- Visual palette: [docs/flashlingo_color_palette.md](docs/flashlingo_color_palette.md)

## Current Expectations

- `flutter analyze` must stay clean.
- `flutter test` must stay green.
- Import/update flows must preserve user progress.
- Release builds must use production signing and production AdMob app ids.
- The app remains local-first: backup/sync is not part of the current release
  scope.

## Notes

- Test runs may rewrite `tmp/pdfs/stats_report_test.pdf`.
- Web, desktop, iOS, macOS, Linux, and Windows folders are present from Flutter
  scaffolding, but Android is the active release target.
