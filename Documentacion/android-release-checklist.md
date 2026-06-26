# Android release checklist

Minimum bar before shipping a new Play Store build of FlashLingo.

## 1. Versioning And Signing

- Update `version:` in `pubspec.yaml`.
- Confirm Android package id is `com.flashlingo.app`.
- Copy `android/key.properties.template` to `android/key.properties` if needed.
- Confirm `android/key.properties` or environment variables define:
  - `storeFile` / `FLASHLINGO_KEY_STORE_FILE`
  - `storePassword` / `FLASHLINGO_KEY_STORE_PASSWORD`
  - `keyAlias` / `FLASHLINGO_KEY_ALIAS`
  - `keyPassword` / `FLASHLINGO_KEY_PASSWORD`
- Confirm the keystore file exists at the configured path.
- Confirm release builds use `signingConfigs.release`.

## 2. AdMob Configuration

Release/profile builds must not use Google's sample AdMob ids.

Expected production values:

- Android AdMob app id: `ca-app-pub-9344640998798252~6893857194`
- Study banner unit id: `ca-app-pub-9344640998798252/2573514404`
- Finished session banner unit id: `ca-app-pub-9344640998798252/7412731941`

Override inputs:

```bash
FLASHLINGO_ADMOB_ANDROID_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
--dart-define=ADMOB_ANDROID_STUDY_BANNER_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
--dart-define=ADMOB_ANDROID_FINISHED_BANNER_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
```

`android/app/build.gradle.kts` validates production AdMob app id for profile and
full release configuration for release tasks.

## 3. Static Verification

Run all commands from repo root:

```bash
flutter pub get
flutter analyze
flutter test
flutter build appbundle --release
```

Expected outcome:

- no analyzer issues
- all tests green
- `build/app/outputs/bundle/release/app-release.aab` generated successfully

## 4. Device Smoke Validation

Install the release build on at least one physical Android device and verify:

- fresh install works
- onboarding/welcome dialog works
- bundled starter deck tour works
- import of a valid `.flashjp` deck succeeds
- update existing preserves progress
- study flow works for new, learning, review, relearning, recognition, and
  production cards
- write mode works when enabled
- undo works when enabled and is hidden when disabled
- stats page opens and charts render
- CSV and PDF exports open the Android share sheet
- deck rename/delete work and media cleanup does not leave visible stale data
- AdMob banner areas do not break layout

Use the full matrix in [manual-qa-matrix.md](manual-qa-matrix.md).

## 5. Upgrade Validation

Validate an upgrade from an existing local database:

- install a previous app build with real data
- import at least one deck
- study enough cards to create review logs, sessions, and daily stats
- install the new release over the existing build
- confirm decks, settings, stats, review dates, logs, and session history remain
  intact
- confirm `updateExisting` still preserves progress

## 6. Play Console Assets

Prepare before upload:

- app icon
- screenshots
- short description
- full description
- privacy policy URL
- Data Safety form answers
- Ads declaration set to "contains ads" while AdMob is enabled
- Advertising ID declaration completed if the merged manifest includes `AD_ID`
- release notes / changelog

## 7. Release Bundle Handoff

Archive these artifacts for each release:

- generated `.aab`
- exact git revision or tag
- final `versionName` and `versionCode`
- release notes text
- signed-off checklist result

## 8. Do Not Ship If Any Fail

- import/update resets user progress
- `flutter analyze` is not clean
- tests are failing
- release bundle was built with debug signing
- release/profile build uses sample AdMob ids
- debug-only tools are visible in production
- Android share/export is broken
- onboarding or starter deck import is broken
