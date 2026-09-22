# Litter-Robot 3 Artwork 🐱🤖

## 🤖 Litter-Robot 3 Support

The card now recognizes the **Litter-Robot 3** (including the LR3 Connect) and shows matching artwork instead of falling back to the LR5 image - fixes #71

Detection is automatic from the device reported by the [`litterrobot` integration](https://www.home-assistant.io/integrations/litterrobot/) — nothing to configure. The LR3 only ever shipped in two colorways, so the card's **Robot color** option picks between them:

```yaml
type: custom:whisker-card
device_id: YOUR_DEVICE_ID
color: black # Grey LR3; `white` (the default) shows the Beige one
```

Your LR3 shows fewer gauges than a newer unit — it reports a waste drawer level but no litter level — and the card simply leaves out what the integration doesn't provide.
