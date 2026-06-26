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
- Verify English and Spanish are the only selectable UI languages.
- Verify the tour can be restarted from general settings.

## Import

- Import a flat `.flashjp` package.
- Import a `.flashjp` package with one wrapper root folder.
- Import a `.zip` package with the same valid contents.
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

## Theme, Layout, And Accessibility

- Verify light theme.
- Verify dark theme.
- Verify system theme mode.
- Verify large text / font scaling does not break core screens.
- Verify compact phone width, normal phone width, and tablet width.
- Verify phones remain portrait-only and tablets can rotate freely.
- Verify dialogs and tour overlays do not cover their target controls.

## Ads

- In debug builds, verify Google sample AdMob ids are used.
- In profile/release builds, verify production AdMob app id validation runs.
- Verify the study banner reserves stable space and does not break the card
  layout.
- Finish a study session and verify the final screen shows the finished-session
  ad area and short continue countdown on supported mobile platforms.

## Upgrade Test

- Install an older build with real study data.
- Import at least one deck.
- Study cards and generate review logs/daily stats.
- Install the candidate build over the old build without uninstalling.
- Confirm decks, review counts, next review dates, sessions, daily stats, and
  recent stats remain intact.
- Confirm import/update still preserves progress.

## Pass Criteria

- No crashes.
- No empty placeholders in production UI.
- No raw exception strings shown to the user during normal flows.
- Import, study, settings, stats, exports, onboarding, and ads work end to end.
