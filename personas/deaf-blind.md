---
id: deaf-blind 
title: Deafblind Person
profile:
    - Profound hearing and vision loss. 
    - Uses a screen reader with a braille display. 
    - Cannot perceive audio or visual content. 
    - Non-speaking individual
interaction_style:
    input:
        - Braille keyboard
        - Switch input or other tactile method 
    output:
        - Braille display only 
    no_reliance_on:
        - Voice input/output 
        - Visual interface 
        - Audio content 
key_needs:
    - Real-time text output (captions) for communication. 
    - Fully functional text input paths. 
    - Screen reader and braille compatibility. 
    - Support for keyboard/switch navigation. 
    - Long timeouts to accommodate slower interaction. 
    - Text-based confirmation of actions. 
    - Text Transcripts available after chat session. 
    - Non-visual, non-audio interaction path for all tasks. 
    - Haptics for interaction cues
cross_functional_considerations:
    customer_care:
        - Do not assume the customer can hear, speak, or see. 
        - Offer chat, text, or RTT as default communication channels 
        - Avoid references to voice tone, visual cues, or spoken confirmation 
        - Allow longer response times for braille input 
        - Always provide written confirmation of actions or outcomes 
    development:
        - Ensure full keyboard access is present for all functionality 
        - Ensure all UI components are accessible via semantic HTML and ARIA if needed. 
        - Allow adjustable timeout settings 
        - Include accessible text equivalents for visual or auditory outputs 
        - Maintain proper focus management and live region announcements 
        - Leverage onboard support for haptics when applicable 
        - Ensure multimedia can technically support captions and text transcripts  
    design_ux:
        - Ensure fully linear, text-based interaction paths 
        - Use semantic headings and landmarks for navigation 
        - Do not rely on color, sound, or animation for feedback 
        - Prioritize consistent, descriptive labeling
        - Avoid modal or focus traps; ensure logical tab order 
    testing:
        - Perform manual QA with keyboard, screen reader 
        - Emulate braille display outputs 
        - Verify Live Region outputs are working correctly with screen readers 
        - Validate tasks using only keyboard  
        - Test for reliance on visual or audio cues during task completion 
        - Ensure text feedback is immediate and programmatically accessible 
        - Test edge cases involving slow, sequential input 
---

## Biography
...