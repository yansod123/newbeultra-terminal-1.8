# Newbeultra Terminal 1.11.0

## CRT companion

The sidebar logo is a green-phosphor CRT monitor. The bezel uses a flat
layered border (no plastic/glossy casing), a black screen, inner green
glow bleeding from the screen edges, scanlines, vignette, and a subtle
idle flicker.

Inside the screen: two large glowing green circles with no border and no
pupils are the entire face (no eyebrows, no mouth). Eyes track the mouse
across the whole page using spring physics (inspired by Grok Bot's bouncy
motion) with a wide travel range that can reach the edge of the screen.
They blink at random intervals and, after 5 minutes of no pointer,
keyboard, scroll, or touch activity, close further and show "zZz". Any
interaction wakes them instantly.

Four corner labels show live terminal status text (boot status, terminal
type, uptime, signal strength). On load the screen flickers through green
static and glitch bars for about 2.5 seconds, then randomly glitches
again every 8-25 seconds. All motion is skipped for
`prefers-reduced-motion` users.

## Site-wide footer

Every page (home, single posts, archives, 404) now shows a fixed,
always-visible terminal-style footer pinned to the bottom of the
viewport: a "Back to Home" link, the site name, and a live Beijing-time
clock.

## Other fixes

Homepage post titles longer than the available row width are truncated
to a single line with an ellipsis.

## Account shortcuts

The sidebar shows Sign in to visitors. After login, users see Dashboard
and Sign out. Accounts with the WordPress edit_posts capability, including
Authors, also see Write post, which opens WordPress New Post.

Includes terminal-style login screen (`/wp-login.php`) and a custom
404 template.

Install: Appearance -> Themes -> Add New -> Upload Theme.
