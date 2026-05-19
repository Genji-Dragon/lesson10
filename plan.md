Plan: Pomodoro Timer App
TL;DR - Build a vanilla Pomodoro timer with three files: index.html, style.css, and app.js. The app will support a 25-minute focus session, 5-minute break session, pause, resume, reset, circular progress, sound notifications, and a completed session counter persisted in localStorage.

File responsibilities
index.html

Define the app structure and semantic elements.
Include the timer display, session label, control buttons, progress indicator, and completed session counter.
Link style.css and app.js.
style.css

Style layout, typography, spacing, and button appearance.
Build the circular progress indicator styling.
Provide visual state feedback for active sessions and controls.
app.js

Manage timer state, session switching, and user interactions.
Persist completed session count in localStorage.
Play notification sound when sessions switch.
app.js function signatures
function initApp()

Initialize the app on load.
Load completed session count, set initial session state, bind controls, and render the initial UI.
function bindControls()

Attach listeners to start, pause, resume, and reset buttons.
Ensure UI and timer state stay synchronized.
function startTimer()

Begin or resume the countdown.
Start the interval that updates time and progress.
function pauseTimer()

Pause the countdown while preserving remaining time.
Stop the timer interval.
function resetTimer()

Reset the current session time to its full duration.
Stop running timers and refresh the display.
function switchSession()

Toggle between focus and break modes when the timer ends.
Reset session duration, update labels, and trigger sound notification.
function updateDisplay()

Render the remaining time, session label, and completed count.
Update the timer text and any UI states.
function updateProgressCircle()

Calculate elapsed percentage for the current session.
Update the circular progress visual accordingly.
function incrementCompletedCount()

Increase the completed focus-session count after a finished focus round.
Save the new count to localStorage.
function loadCompletedCount()

Read the persisted completed session count from localStorage.
Return zero if no stored value exists.
function playNotificationSound()

Play a short alert when the app switches sessions.
Use browser audio APIs or a hidden audio element.
Build order
Create index.html with the app shell, timer display, control buttons, progress element, and completed count.
Create style.css for layout, typography, button styles, and the circular progress indicator.
Create app.js and implement initialization, DOM references, and UI rendering.
Implement timer lifecycle functions: startTimer, pauseTimer, resetTimer, and switchSession.
Add progress updates through updateProgressCircle.
Add persistence with loadCompletedCount and incrementCompletedCount.
Add sound notifications via playNotificationSound.
Test timer flow, session switching, reset/pause/resume, counter persistence, and progress visuals.