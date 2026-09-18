# Newbeultra Terminal 1.12.0

## CRT companion

The sidebar companion is now a small Macintosh 128K-inspired all-in-one
computer: a nearly square green-phosphor screen inside a refined
(not photorealistic) skeuomorphic graphite casing, with vent lines and a
recessed screen well. Instead of an Apple logo, the "chin" below the
screen has a small glowing LED power switch that turns off while the
companion sleeps and lights up on interaction.

Clicking or pressing Enter/Space on the companion no longer navigates
anywhere — it triggers one of three random playful reactions (a happy
squint, a surprised wide-eyed look, or a curious tilted glance). Use the
"Home" link at the bottom of the sidebar to return to the homepage.

The eyes are two borderless glowing green circles (no pupils) that track
the mouse across the whole page using bouncier spring physics with a
wider, more expressive travel range. They blink at random intervals and,
after 5 minutes of no activity, close further, dim the LED, and show
"zZz". Any interaction wakes them instantly.

Four corner labels show live terminal status text. On load the screen
flickers through green static and glitch bars for about 2.5 seconds,
then randomly glitches again every 8-25 seconds. All motion is skipped
for `prefers-reduced-motion` users.

## Site-wide footer

Every page shows a fixed terminal-style footer: a "Back to Home" link,
the site name, and a live Beijing-time clock.

## Other fixes

Homepage post titles are truncated to a single line with an ellipsis;
the category pill next to them keeps its own fixed width.

## Account shortcuts

The sidebar shows Sign in to visitors. After login, users see Dashboard
and Sign out. Accounts with the WordPress edit_posts capability, including
Authors, also see Write post, which opens WordPress New Post.

Includes terminal-style login screen (`/wp-login.php`) and a custom
404 template.

Install: Appearance -> Themes -> Add New -> Upload Theme.
