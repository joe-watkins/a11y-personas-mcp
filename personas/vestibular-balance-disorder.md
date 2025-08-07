---
id: vestibular-balance-disorder 
title: Vestibular Balance Disorder
profile:
  - Experiences dizziness, vertigo, and nausea triggered by on-screen motion.
  - Highly sensitive to motion, including parallax scrolling, animations, and carousels.
  - May use browser settings or extensions to reduce motion.
interaction_style:
  input:
    - Standard input devices (mouse, keyboard)
  output:
    - Relies on static, stable visual displays.
  no_reliance_on:
    - Interfaces with motion, animation, or parallax scrolling.
key_needs:
  - Ability to disable or reduce motion in user interfaces.
  - Static and predictable layouts.
  - No autoplaying videos or animations.
  - Warnings before content with significant motion is displayed.
cross_functional_considerations:
  customer_care:
    - Be aware that screen sharing sessions with motion can trigger symptoms.
    - Verbally describe dynamic content changes.
  development:
    - Implement and respect the `prefers-reduced-motion` media query.
    - Avoid parallax scrolling and motion-heavy effects.
    - Provide user controls for all animations and videos.
  design_ux:
    - Prioritize static interface design.
    - Ensure animations are purposeful and user-initiated.
    - Provide clear warnings before displaying content with significant motion.
  testing:
    - Test interfaces with motion reduction settings enabled.
    - Verify that all animations and videos can be paused or disabled.
    - Check for unexpected layout shifts or motion during user interaction.
---

## Biography

A person with a vestibular disorder, such as Labyrinthitis or Ménière's disease, is highly sensitive to motion. Digital experiences with parallax scrolling, animations, carousels, or videos that simulate movement can cause debilitating symptoms like dizziness, vertigo, and nausea. They rely on interfaces being static and predictable to avoid triggering these symptoms.

### Quote

> "Sudden on-screen movement makes me feel like the room is spinning. I have to close my eyes or look away immediately."
