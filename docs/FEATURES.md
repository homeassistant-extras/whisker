# Features

- **Model-aware artwork** — The card shows an image matching your robot, detected from the device's model and serial number (Litter-Robot 4, 5, 5 Pro, or Evo). A `color` option picks white or black artwork ([Configuration options](configuration/OPTIONS.md)).
- **Status header** — Friendly title (device name or optional override), human-readable status text, and a colored **status icon** derived from the `status_code` sensor.
- **Cycle styling** — While the robot reports an active cycle (`ccp`, `ec`, `cst`), the card reflects **cycling** state for subtle visual emphasis.
- **Quick actions** — Picture-style controls for the litter box **vacuum** and **reset** (see [Interactions](configuration/INTERACTIONS.md)).
- **Controls menu** — A menu button opens a dialog with standard Lovelace **entity rows** for globe light, globe brightness, panel brightness, cycle delay, and panel lockout when those entities exist.
- **Pet weight** — A compact chip for the **pet weight** sensor (when present).
- **Litter and waste gauges** — Visual fill levels; waste styling reflects severity as the drawer fills. Optionally show fill **percentages** on the gauge labels ([Feature flags](configuration/FEATURE-FLAGS.md)).
- **Customizable footer** — Choose which device metrics appear in the card footer ([Footer configuration](configuration/FOOTER.md)). Defaults to total cycles, status last changed, and last seen.

![Controls](assets/control.png)
