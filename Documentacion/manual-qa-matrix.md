# Manual QA matrix

Use this matrix for Android smoke QA before uploading a release candidate.

## Fresh Install And Onboarding

- Install the app on a clean Android device.
- Launch the app and verify the home screen loads without errors.
- Verify the welcome dialog appears only on first run.
- Start the guided tour.
- Verify the tour can open app settings, import the bundled starter deck,
  inspect the import summary, change deck settings, run a study session, open
  stats, and delete the guided starter deck.
- Verify the selectable UI languages are English, Spanish, Romanian, German,
  French, Japanese, and Chinese.
- Verify unsupported system locales fall back to English on first launch.
- Verify the tour can be restarted from general settings.
- From general settings, open the privacy policy, terms, legal notice, and
  official support site links.

## Import

- Import a flat `.flashjp` package.
- Import a `.flashjp` package with one wrapper root folder.
- On Android 11+ or newer, import a `.flashjp` selected from shared Downloads
  or the system Files app and verify it succeeds without storage permissions.
- Import a large encrypted `.flashjp` from Downloads/Documents and verify the
  preview can run for more than one minute, then continue into import without
  showing a generic import error.
- Try importing a `.zip` package and verify it is rejected.
- Try importing a ZIP renamed to `.flashjp` and verify it is rejected.
- Import an app-generated `.flashjp` progress backup from Downloads/Documents
  and verify the preview identifies it as a backup, not an official deck
  package.
- Import a package with word audio, sentence audio, images, and deck icon.
- Import a package with missing media and confirm the summary reports missing
  word audio, missing sentence audio, and missing images.
- Import a package with many small media files.
- Re-import an existing deck and choose update existing.
- Re-import an existing deck and choose create with another name.
- Try a package whose `pack_name` is `FlashLingo`; normal import must require a
  different name because that name is reserved for the starter deck.

## Progress Preservation

- Study at least one recognition card and one production card.
- Close and reopen the app before finishing the session.
- Confirm the session resumes at the saved card index.
- Update the same deck with a new package.
- Confirm card text/media update but these fields remain intact:
  - SRS state
  - next review
  - last review
  - repetition count
  - lifetime correct/wrong/review counts
  - total study time
  - review logs
  - session history
  - daily stats
  - user-edited deck settings

## Deck Progress Backup

- Study a deck enough to create SRS progress, review logs, an active/resumable
  session, session history, daily stats, and local media references.
- From the deck menu, choose export progress and confirm the Android share sheet
  opens with a `.flashjp` file.
- Import that backup into a clean install or clean test database and verify the
  restored deck has the same card content, media, deck settings, SRS state,
  review history, active session queue, session history, and daily stats.
- Import the same backup while the original deck exists and verify the app
  always asks whether to restore over the existing deck or create a copy.
- Choose restore over existing and verify the deck is replaced by the backup
  data, with review logs and active session queue remapped to the new local card
  IDs.
- Choose create copy and verify both decks remain, the copied deck has its own
  restored media files and progress, and the original deck is unchanged.
- Tamper with a backup JSON/media file or path and verify import fails before
  writing partial deck data.

## Study Flow

- Complete a new card until it reaches review.
- Fail a new card and confirm it repeats intra-day using the configured delay.
- Fail a review card and confirm fixed lapse or relearning behavior.
- Use undo once and confirm the latest answer, review log, new-card counter, and
  repeated queue item are reverted.
- Disable undo in deck settings and confirm the undo button is hidden.
- Enable write mode and test a production card with:
  - answer below threshold: Good is disabled
  - answer above threshold: Good is enabled
  - max write repetitions reached: write mode stops appearing for that card
- Confirm recognition cards with readings show the reading step before the final
  answer.
- Confirm audio buttons play word/sentence audio when media is present.
- Confirm image cards render without overflow on phone and tablet widths.
- Import or create a test card containing hostile HTML and verify rendered card
  HTML does not execute scripts, event handlers, unquoted `javascript:` links,
  encoded dangerous URLs, remote images, or remote audio/video sources.

## Daily Limits And Queue

- Set a low new-card limit and confirm only that many new cards appear.
- Set a low review cap and confirm overflow reviews are deferred.
- Enable "hide new cards on review overflow" and confirm new cards are hidden
  while review overflow exists.
- Test all study mix modes:
  - new first
  - reviews first
  - interleave reviews then new
  - interleave new then reviews
- Confirm sibling recognition/production cards are not adjacent when avoidable.
- Use "Review now" / advance reviews from home and confirm future review cards
  become available today.

## Library And Browser

- Open deck settings and save valid values.
- Try invalid learning steps and confirm validation blocks the save.
- Confirm day cutoff changes the study-day label behavior.
- Open the card browser.
- Search by question, answer, sentence, and translation.
- Filter recognition/production cards.
- Filter by state: new, learning, review, relearning.
- Sort by original order, hardest, overdue, next review, and last review.
- Open a card tile and verify per-card stats and review history.
- Rename a deck and confirm the new name propagates everywhere.
- Delete a deck and confirm cards, settings, logs, sessions, daily stats, and
  orphaned media are removed.

## Stats And Exports

- Open statistics for a populated deck.
- Confirm the page loads without technical error text.
- Verify summary metrics: total cards, new today, learning now, review now,
  overdue, lifetime reviews, lifetime accuracy, 7-day accuracy, and 30-day
  accuracy.
- Verify comparison metrics for recent vs baseline activity.
- Switch heatmap mode between answers and unique cards.
- Change forecast, study-time, interval, hourly, and prediction ranges.
- Change hourly slot size between 60, 30, and 15 minutes.
- Use problem-card actions:
  - open in browser
  - open history
  - review now for future-due problem cards
- Export CSV and confirm the Android share sheet opens with all CSV files.
- Export PDF and confirm the Android share sheet opens with the report.
- Export a `.flashjp` deck progress backup and confirm a determinate progress
  bar advances to 100% and then the Android share sheet opens with the backup
  file.

## Theme, Layout, And Accessibility

- Verify light theme.
- Verify dark theme.
- Verify system theme mode.
- Verify large text / font scaling does not break core screens.
- Verify compact phone width, normal phone width, and tablet width.
- Verify phones remain portrait-only and tablets can rotate freely.
- Verify dialogs and tour overlays do not cover their target controls.

## Reminders And Notifications

- On Android 13+, verify when the notification runtime prompt appears.
- Save reminder settings for a deck and confirm reminders are scheduled only for
  enabled decks.
- Use the reminder preview button and confirm the notification opens the
  expected deck.
- Reboot the device and confirm reminders are rescheduled through the boot
  receiver.
- Disable reminders for a deck and confirm no new reminders are shown for that
  deck.

## Ads

- In debug builds, verify Google sample AdMob ids are used.
- In profile/release builds, verify production AdMob app id validation runs.
- On a device/region/test setup where UMP requires consent, verify the consent
  form appears before ads load.
- On a device/region/test setup where UMP requires privacy options, verify the
  ad privacy options entry appears in general settings and opens the UMP form.
- Verify the study banner reserves stable space and does not break the card
  layout.
- On a very narrow viewport (split-screen/multi-window, a small device, or a
  large display-size setting), verify the fixed-size banner and finished-session
  medium rectangle are hidden instead of clipped or overflowing the layout.
- Finish a study session and verify the final screen shows the finished-session
  ad area and short continue countdown on supported mobile platforms.
- Verify the finished-session screen still has a clear non-ad way out and does
  not encourage accidental ad taps.

## Upgrade Test

- Install an older build with real study data.
- Import at least one deck.
- Study cards and generate review logs/daily stats.
- Install the candidate build over the old build without uninstalling.
- Confirm decks, review counts, next review dates, sessions, daily stats, and
  recent stats remain intact.
- Confirm import/update still preserves progress.

## Native Release Compatibility

- Build the release app bundle with `flutter build appbundle --release`.
- Extract or inspect the 64-bit native libraries from the generated `.aab`.
- Confirm every `LOAD` segment in `arm64-v8a` and `x86_64` native libraries has
  `Align >= 0x4000`.
- Confirm `libisar.so` from Isar Community passes the same check.

## Pass Criteria

- No crashes.
- No empty placeholders in production UI.
- No raw exception strings shown to the user during normal flows.
- Import, backup restore, study, settings, stats, exports, onboarding, and ads
  work end to end.
- Release candidate passes native 16 KB page-size validation for all 64-bit
  libraries.
