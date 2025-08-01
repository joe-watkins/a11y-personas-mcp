---
title: Low Vision User - Taylor Kim
profile:
  - Cannot speak or use hands
  - Cognitively intact; uses AAC (speech-generating device), eye tracking, or switch control
  - May use screen reader or visual interface
interaction_style:
  input:
    - Screen Magnifier
    - High Contrast Mode
    - Keyboard navigation
  output:
    - Visual display with magnification
    - High contrast themes
  no_reliance_on:
    - Small text or low contrast elements
    - Mouse-only interactions
    - Time-sensitive interactions
key_needs:
  - Accept synthesized speech input (AAC)
  - Fully supported text input with no voice-only dependencies
  - Support for eye-tracking, keyboard-like input, and switch navigation
  - Avoid gestures or touch-reliant interactions
  - Use structured prompts to reduce input effort
cross_functional_considerations:
  customer_care:
    - Do not assume ability to speak or use voice-based systems
    - "Provide alternative input channels (e.g., chat, email, text forms)"
    - Accept responses from AAC devices and synthesized speech
    - Allow longer response time without session timeouts
  development:
    - Ensure zoom compatibility up to 400%
    - Use relative font sizes and scalable layouts
    - Provide high contrast mode support
    - Test with screen magnification tools
  design_ux:
    - Use high contrast color combinations
    - Ensure minimum font sizes of 16px
    - Provide clear visual hierarchy
    - Design for zoom and magnification
  testing:
    - Test with screen magnifiers
    - Verify high contrast mode functionality
    - Test keyboard navigation paths
    - Validate at 400% zoom level
---

## Biography

Taylor Kim works in marketing and uses a screen magnifier to browse dashboards and websites. She gets frustrated when text is low contrast or when interactive elements are not clearly distinguishable from regular content.

Taylor has been living with low vision for several years and has become proficient with assistive technologies. She prefers dark themes and high contrast modes when available, and often needs to zoom web pages to 200-400% to read comfortably.

> "If I have to squint, I'll just close the tab. There are too many other options to waste time struggling with poor design."

When reviewing interfaces, Taylor looks for:
- Clear visual boundaries between sections
- Sufficient color contrast (at least 4.5:1 for normal text)
- Scalable text that doesn't break layouts when magnified
- Keyboard accessibility as a backup to mouse interactions
