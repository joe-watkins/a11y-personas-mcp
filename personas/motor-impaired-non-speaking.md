---
title: Motor-Impaired / Non-Speaking Person
profile:
    - Cannot speak or use hands. 
    - Cognitively intact; uses AAC (speech-generating device), eye tracking, or switch control. 
    - May use screen reader or visual interface. 
interaction_style:
    input:
        - Eye tracking 
        - Switch control 
        - On-screen keyboard 
        - Synthesized speech via AAC 
        - Sip and Puff device 
    output:
        - Visual display 
        - Optional screen reader 
    no_reliance_on:
        - Hand gestures or touch interfaces 
        - Natural voice input 
        - Rapid or time-sensitive interactions 
        - Complex gestures 
key_needs:
    - Accept synthesized speech input (AAC). 
    - Fully supported text input with no voice-only dependencies. 
    - Support for eye-tracking, keyboard-like input, and switch navigation. 
    - Avoid gestures or touch-reliant interactions. 
    - Use structured prompts to reduce input effort. 
    - Inclusive ASR - support diverse and synthetic voices. 
    - Allow longer response time and adaptive pacing. 
    - Visual confirmation and transcript availability. 
    - Non-touch, non-voice fallback paths.
cross_functional_considerations: 
    customer_care:
        - Do not assume ability to speak or use voice-based systems 
        - "Provide alternative input channels (e.g., chat, email, text forms)"
        - "Accept responses from AAC devices and synthesized speech"
        - Allow longer response time without session timeouts 
        - Ensure clear, visual confirmation of submitted actions
    development:
        - Ensure full keyboard, eye-tracking, and switch navigation support 
        - "Enable input from AAC tools and non-standard devices (e.g., sip-and-puff)"
        - Do not gate interactions behind voice input or touch gestures 
        - Provide adjustable response timing and session timeout settings 
        - Implement consistent visual focus indicators and keyboard accessible controls   
    design_ux:
        - Avoid reliance on drag, swipe, or multi-touch gestures 
        - Design large, selectable targets compatible with eye tracking and switches 
        - Use structured, predictable layouts that reduce scanning effort 
        - Minimize cognitive and motor load by offering response shortcuts or prompts 
        - Ensure full functionality without time constraints or the ability to extend those sessions 
    testing:
        - Perform manual testing using keyboards  
        - Validate full task completion without touch, speech, or rapid input 
        - Test compatibility with on-screen keyboards and synthesized speech input 
        - Include slow input scenarios and edge cases (e.g., form errors, session handling) 
---

## Biography
...