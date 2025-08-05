---
title: Low Vision User
profile:
  - Has low vision; primary challenge is visual clarity and detail
  - Cognitively intact and independent
  - Uses screen magnifier and high contrast mode for most tasks
  - May use screen reader as a backup for some content
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
  - Ability to zoom content up to 400% without loss of functionality or content
  - High contrast mode and customizable color schemes
  - Scalable text and layouts that do not break when magnified
  - Clear visual hierarchy and distinguishable interactive elements
  - Keyboard navigation as a reliable alternative to mouse
  - Avoid reliance on small text, low contrast, or color alone to convey information
  - Support for screen magnifiers and compatibility with assistive technology
cross_functional_considerations:
  customer_care:
    - Do not rely solely on voice-based systems; provide accessible alternatives
    - Provide alternative input channels (e.g., chat, email, text forms)
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

This user works in marketing and uses a screen magnifier to browse dashboards and websites. They get frustrated when text is low contrast or when interactive elements are not clearly distinguishable from regular content.

They have been living with low vision for several years and have become proficient with assistive technologies. They prefer dark themes and high contrast modes when available, and often need to zoom web pages to 200-400% to read comfortably.

> "If I have to squint, I'll just close the tab. There are too many other options to waste time struggling with poor design."

When reviewing interfaces, this user looks for:
- Clear visual boundaries between sections
- Sufficient color contrast (at least 4.5:1 for normal text)
- Scalable text that doesn't break layouts when magnified
- Keyboard accessibility as a backup to mouse interactions
