# Newbeultra Terminal 1.13.0

## CRT companion

The sidebar companion is exactly the requested green-phosphor terminal
screen effect (black background, layered dark border, scanlines, glow) -
no additional monitor casing or bezel is wrapped around it.

Inside the screen: two borderless glowing circles (no pupils) form the
face, tracking the mouse across the whole page with bouncy spring
physics. They blink randomly and, after 5 minutes idle, close further
and show "zZz". Clicking (or pressing Enter/Space) triggers one of three
random playful reactions instead of navigating; use the "Home" link at
the bottom of the sidebar to go to the homepage.

Four corner labels show live terminal status text. On load the screen
flickers through static and glitch bars for about 2.5 seconds, then
glitches again randomly every 8-25 seconds.

### New: CRT Companion customizer settings

Under Appearance -> Customize -> CRT Companion, admins can adjust:

- Display Color - overall phosphor color (default green #00ff41)
- Scanline Density - Off / Fine / Medium / Heavy
- Glow Intensity - Low / Medium / High
- Border Thickness - Thin / Medium / Thick

All settings apply site-wide via CSS custom properties. All motion is
skipped for `prefers-reduced-motion` users.

## Site-wide footer

Every page shows a fixed terminal-style footer: a "Back to Home" link,
the site name, and a live Beijing-time clock.

## Other fixes

Homepage post rows now define 6 explicit grid columns matching their 6
child elements, fixing a layout bug where titles were squeezed and the
category pill stretched to fill empty space.

## Account shortcuts

The sidebar shows Sign in to visitors. After login, users see Dashboard
and Sign out. Accounts with the WordPress edit_posts capability, including
Authors, also see Write post, which opens WordPress New Post.

Includes terminal-style login screen (`/wp-login.php`) and a custom
404 template.

Install: Appearance -> Themes -> Add New -> Upload Theme.
