---
title: Blindness (Screen Reader - NVDA)
profile:
  - Is blind and uses a screen reader (NVDA) on Windows devices for digital access
  - Navigates content using keyboard shortcuts and screen reader commands
  - Relies on audio feedback and logical content structure
  - May encounter barriers with unlabeled buttons, images, or inaccessible forms
interaction_style:
  input:
    - Keyboard shortcuts (Windows)
    - NVDA screen reader commands
    - Braille display (optional)
  output:
    - Audio feedback via NVDA
    - Structured, text-based content
    - Optional braille output
  no_reliance_on:
    - Visual-only content or images without alt text
    - Mouse navigation
    - Inaccessible forms or widgets
    - Color or position as the only means of conveying information
key_needs:
  - Full compatibility with NVDA on Windows
  - Descriptive alt text for all images and icons
  - Logical, semantic content structure
  - Keyboard navigation for all features
  - Avoidance of unlabeled buttons or ambiguous controls
  - Consistent heading and landmark structure
  - Option to skip repetitive navigation
cross_functional_considerations:
  customer_care:
    - Provide support in accessible formats (text, audio)
    - Avoid referencing visual elements only
    - Offer step-by-step written instructions
    - Be patient and allow time for navigation
  development:
    - Ensure all content is accessible via NVDA
    - Use semantic HTML and ARIA landmarks
    - Provide alt text for all images and icons
    - Support keyboard navigation throughout
  design_ux:
    - Design for logical, semantic navigation
    - Avoid reliance on color, shape, or position alone
    - Use clear, descriptive headings and landmarks
    - Minimize visual clutter and unnecessary graphics
  testing:
    - Test with NVDA on Windows
    - Validate alt text and content structure
    - Ensure all features are accessible without a mouse
    - Check for logical tab order and skip links
---

## Biography

This persona represents a blind user who uses NVDA on Windows devices. They navigate content using keyboard shortcuts and screen reader commands, relying on audio feedback and logical structure. Unlabeled buttons, images, and inaccessible forms can be barriers without proper accessibility support.

They benefit from semantic content structure, keyboard navigation, and descriptive alt text. Support in accessible formats and patience from customer care are essential for their independence and confidence.

> "If a form or button isn't labeled, I can't use it. Everything needs to be described and accessible."

When reviewing interfaces, this user looks for:
- Full compatibility with NVDA
- Descriptive alt text for all images and icons
- Logical, semantic content structure
- Keyboard navigation
- Option to skip repetitive navigation

---

**Attribution:**  
This persona is based on research and synthesis of common needs among NVDA users. For more, see [NV Access - NVDA Screen Reader](https://www.nvaccess.org/).

*Persona generated: 2025-08-04*  
*Analysis: Blindness/screen reader (NVDA) accessibility needs*
