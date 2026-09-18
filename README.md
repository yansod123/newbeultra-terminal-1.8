# Newbeultra Terminal 1.10.0

Homepage begins directly with terminal search. The sidebar logo has been
replaced with a CRT monitor companion. The monitor's outer casing is
unchanged; the screen shows two large glowing purple circles with no
border and no pupils — the circles themselves are the eyes, styled after
minimal console-mascot faces (no eyebrows, no mouth).

- Eyes continuously track the mouse position across the whole page.
- Eyes blink at random intervals by squashing flat and springing back.
- After 5 minutes without any pointer, keyboard, scroll, or touch
  activity, the eyes close further and a "zZz" indicator appears. Any
  interaction wakes the screen instantly.
- Four corner labels show live terminal-style status text (boot status,
  terminal type, uptime timer, signal strength).
- On page load the screen flickers through TV static and glitch bars for
  about 2.5 seconds before settling; afterward it randomly glitches
  briefly every 8–25 seconds to feel like an aging CRT tube.
- All motion is skipped for users with `prefers-reduced-motion` enabled.

Homepage post titles longer than the available row width are now
truncated to a single line with an ellipsis.

## Account shortcuts

The sidebar shows Sign in to visitors. After login, users see Dashboard
and Sign out. Accounts with the WordPress edit_posts capability, including
Authors, also see Write post, which opens WordPress New Post.

Includes terminal-style login screen (`/wp-login.php`) and a custom
404 template.

Install: Appearance -> Themes -> Add New -> Upload Theme.
