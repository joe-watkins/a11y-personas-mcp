---
id: blindness-screen-reader-voiceover 
title: Blindness (Screen Reader - VoiceOver)
profile:
  - Is blind and uses a screen reader (VoiceOver) on Apple devices for digital access
  - Navigates content using keyboard shortcuts and touch gestures
  - Relies on audio feedback and logical content structure
  - May encounter barriers with unlabeled buttons, images, or custom widgets
interaction_style:
  input:
    - Keyboard shortcuts (Mac)
    - Touch gestures (iOS)
    - VoiceOver screen reader commands
  output:
    - Audio feedback via VoiceOver
    - Structured, text-based content
    - Haptic feedback on mobile
  no_reliance_on:
    - Visual-only content or images without alt text
    - Mouse navigation (on desktop)
    - Custom widgets without accessibility support
    - Color or position as the only means of conveying information
key_needs:
  - Full compatibility with VoiceOver on Mac and iOS
  - Descriptive alt text for all images and icons
  - Logical, semantic content structure
  - Keyboard and gesture navigation for all features
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
    - Ensure all content is accessible via VoiceOver
    - Use semantic HTML and ARIA landmarks
    - Provide alt text for all images and icons
    - Support keyboard and gesture navigation
  design_ux:
    - Design for logical, semantic navigation
    - Avoid reliance on color, shape, or position alone
    - Use clear, descriptive headings and landmarks
    - Minimize visual clutter and unnecessary graphics
  testing:
    - Test with VoiceOver on Mac and iOS
    - Validate alt text and content structure
    - Ensure all features are accessible without a mouse
    - Check for logical tab order and skip links
---

## Biography

This persona represents a blind user who uses VoiceOver on Apple devices. They navigate content using keyboard shortcuts and touch gestures, relying on audio feedback and logical structure. Unlabeled buttons, images, and custom widgets can be barriers without proper accessibility support.

They benefit from semantic content structure, keyboard and gesture navigation, and descriptive alt text. Support in accessible formats and patience from customer care are essential for their independence and confidence.

> "If a button or image isn't labeled, I have no idea what it does. I need everything described clearly."

When reviewing interfaces, this user looks for:
- Full compatibility with VoiceOver
- Descriptive alt text for all images and icons
- Logical, semantic content structure
- Keyboard and gesture navigation
- Option to skip repetitive navigation

---

**Attribution:**  
This persona is based on research and synthesis of common needs among VoiceOver users. For more, see [Apple - VoiceOver for Mac](https://support.apple.com/guide/voiceover/welcome/mac) and [Apple - VoiceOver for iPhone](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios).

*Persona generated: 2025-08-04*  
*Analysis: Blindness/screen reader (VoiceOver) accessibility needs*
