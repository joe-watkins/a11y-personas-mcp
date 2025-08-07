---
id: blindness-braille 
title: Blindness (Braille User)
profile:
  - Is blind and relies primarily on braille displays or braille notetakers for digital access
  - Navigates content using screen readers with braille output
  - Prefers tactile feedback and structured, linear content
  - May encounter barriers with images, charts, or non-textual content
interaction_style:
  input:
    - Keyboard navigation
    - Braille display or notetaker
    - Screen reader commands
  output:
    - Tactile braille output
    - Audio feedback as a supplement
    - Structured, text-based content
  no_reliance_on:
    - Visual-only content or images without alt text
    - Mouse or touch navigation
    - Complex visual layouts
    - Color or shape as the only means of conveying information
key_needs:
  - Full compatibility with braille displays and screen readers
  - Descriptive alt text for all images and graphics
  - Logical, linear content structure
  - Keyboard-only navigation for all features
  - Avoidance of visual-only cues or instructions
  - Consistent heading and landmark structure
  - Option to skip repetitive navigation
cross_functional_considerations:
  customer_care:
    - Provide support in accessible formats (braille, text, audio)
    - Avoid referencing visual elements only
    - Offer step-by-step written instructions
    - Be patient and allow time for navigation
  development:
    - Ensure all content is accessible via screen reader and braille display
    - Use semantic HTML and ARIA landmarks
    - Provide alt text for all images and graphics
    - Support keyboard navigation throughout
  design_ux:
    - Design for linear, text-based navigation
    - Avoid reliance on color, shape, or position alone
    - Use clear, descriptive headings and landmarks
    - Minimize visual clutter and unnecessary graphics
  testing:
    - Test with braille displays and screen readers
    - Validate alt text and content structure
    - Ensure all features are accessible without a mouse
    - Check for logical tab order and skip links
---

## Biography

This persona represents a blind user who relies on braille displays for digital access. They navigate content using screen readers with braille output and prefer structured, linear content. Images, charts, and non-textual content can be barriers without proper descriptions.

They benefit from logical content structure, keyboard navigation, and descriptive alt text. Support in accessible formats and patience from customer care are essential for their independence and confidence.

> "I need everything in text or braille. Images or graphics without descriptions are just blank spaces to me."

When reviewing interfaces, this user looks for:
- Full compatibility with braille displays and screen readers
- Descriptive alt text for all images
- Logical, linear content structure
- Keyboard-only navigation
- Option to skip repetitive navigation

---

**Attribution:**  
This persona is based on research and synthesis of common needs among braille users. For more, see [American Foundation for the Blind - Braille Technology](https://www.afb.org/blindness-and-low-vision/using-technology/braille-technology).

*Persona generated: 2025-08-04*  
*Analysis: Blindness/braille accessibility needs*
