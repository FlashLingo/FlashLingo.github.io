# Android release checklist

Minimum bar before shipping a new Play Store build of FlashLingo.

## 1. Versioning And Signing

- Confirm `version:` in `pubspec.yaml` is the intended public release version.
  - The current repository value is `1.0.0+1`.
  - Increment the build number for every later Play upload.
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

Current code behavior:

- debug builds use Google's sample Android AdMob app id and sample banner ids
- profile/release Android builds use the production app id and production banner
  ids unless overridden
- app startup refreshes UMP consent information, shows required consent forms,
  and initializes Mobile Ads only when `canRequestAds` is true
- banner slots still use plain `AdRequest()` with no app-level targeting extras
- the study screen reserves a banner slot and the finished-session screen uses a
  medium rectangle slot plus a 5 second disabled continue button; the continue
  button sits in its own divider-separated footer so the ad is never flush
  against it
- fixed-size ad slots are hidden (not clipped) when the available width is
  smaller than the ad, so narrow/split-screen/large-display layouts do not break
- general settings exposes UMP privacy options when Google Mobile Ads reports
  that a privacy options entry point is required

Before publishing with ads enabled:

- complete the Play Console ads declaration
- complete the Advertising ID declaration because the merged manifest includes
  `com.google.android.gms.permission.AD_ID`
- configure and test AdMob Privacy & messaging / CMP messages for the required
  regions before serving ads there
- use a Google-certified CMP for personalized ads in EEA, UK, and Switzerland
  when applicable
- verify the finished-session ad placement does not create a no-exit or
  accidental-click flow

## 3. Static Verification

Run all commands from repo root:

```bash
flutter pub get
dart run build_runner build --force-jit
flutter analyze
flutter test
flutter build appbundle --release
```

Expected outcome:

- no analyzer issues
- all tests green
- generated Isar Community/Riverpod files are current
- `build/app/outputs/bundle/release/app-release.aab` generated successfully

## 4. Android Manifest And Native Compatibility

Confirm the merged release manifest contains only expected permissions and
metadata:

- `targetSdkVersion` is 36
- `versionName` / `versionCode` match `pubspec.yaml`
- `POST_NOTIFICATIONS` is present for study reminders
- `RECEIVE_BOOT_COMPLETED` is present for reminder rescheduling
- `INTERNET`, `ACCESS_NETWORK_STATE`, `AD_ID`, and Android AdServices
  permissions are present because Google Mobile Ads is enabled
- no camera, microphone, location, contacts, calendar, SMS, phone, broad storage
  or Bluetooth permissions are present
- `android:allowBackup` is set to `false` in the source manifest, and
  `android/app/src/main/res/xml/data_extraction_rules.xml` also excludes cloud
  backup and device-to-device transfer of app data (users migrate with the
  in-app per-deck `.flashjp` progress backup instead)

Native libraries must be compatible with Android 15+ 16 KB page-size devices
before uploading to Play. Check every 64-bit `.so` from the release build with
`llvm-readelf` and reject any library whose `LOAD` alignment is below `0x4000`.

Current audited release build status:

- `libapp.so`, `libflutter.so`, `libdatastore_shared_counter.so`,
  `libsqlite3.so`, and `libisar.so` pass on the ABIs included in the bundle
- `libisar.so` now comes from `isar_community_flutter_libs 3.3.2`
- the generated `app-release.aab` was extracted and all `arm64-v8a` /
  `x86_64` `LOAD` alignments were verified at `0x4000` or `0x10000`
- the current dependency set passes the native 16 KB page-size alignment check
  for the release bundle generated locally

Reference:

- https://developer.android.com/guide/practices/page-sizes

## 5. Device Smoke Validation

Install the release build on at least one physical Android device and verify:

- fresh install works
- onboarding/welcome dialog works
- bundled starter deck tour works
- import of a valid `.flashjp` deck succeeds
- import of a large `.flashjp` selected from Downloads/Documents completes
  preview and import without provider disposal errors
- export deck progress from a deck menu opens the Android share sheet with a
  `.flashjp` backup
- import of an app-generated `.flashjp` backup from Downloads/Documents restores
  cards, media, settings, logs, active session, session history, and daily stats
- importing a backup for an existing deck always asks whether to restore over
  the existing deck or create a copy
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

## 6. Upgrade Validation

Validate an upgrade from an existing local database:

- install a previous app build with real data
- import at least one deck
- study enough cards to create review logs, sessions, and daily stats
- install the new release over the existing build
- confirm decks, settings, stats, review dates, logs, and session history remain
  intact
- confirm `updateExisting` still preserves progress

## 7. Play Console Assets

Prepare before upload:

- app icon
- screenshots
- short description
- full description
- privacy policy URL
- Data Safety form answers, including behavior of Google Mobile Ads and any
  data handled by third-party SDKs
- Data Safety/privacy policy wording covers user-initiated CSV/PDF exports and
  `.flashjp` deck progress backups, including that backup v1 has no password or
  user encryption
- Google Mobile Ads Data Safety disclosures reviewed against the current
  official SDK disclosure page
- Ads declaration set to "contains ads" while AdMob is enabled
- Advertising ID declaration completed if the merged manifest includes `AD_ID`
- sensitive permissions/declarations reviewed for `POST_NOTIFICATIONS`
- AdMob Privacy & messaging / CMP configuration tested for regions where
  consent or privacy options are required
- target audience and content rating completed
- release notes / changelog

Reference:

- https://support.google.com/googleplay/android-developer/answer/10787469
- https://support.google.com/googleplay/android-developer/answer/9859455

## 8. Release Bundle Handoff

Archive these artifacts for each release:

- generated `.aab`
- exact git revision or tag
- final `versionName` and `versionCode`
- release notes text
- signed-off checklist result

## 9. Do Not Ship If Any Fail

- import/update resets user progress
- `flutter analyze` is not clean
- tests are failing
- release bundle was built with debug signing
- release/profile build uses sample AdMob ids
- any 64-bit native library fails the 16 KB page-size alignment check
- public version is a placeholder or has not been incremented from a previous
  Play upload
- Play Console privacy, Data Safety, ads, Advertising ID, notification, or
  content-rating declarations are incomplete
- AdMob Privacy & messaging / CMP setup is missing or unverified for regions
  where it is required
- `android:allowBackup` is not `false`, or the data extraction rules no longer
  exclude cloud backup and device-to-device transfer
- debug-only tools are visible in production
- Android share/export is broken
- deck progress backup export/import is broken
- onboarding or starter deck import is broken
