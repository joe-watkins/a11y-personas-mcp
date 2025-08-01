---
title: Sighted Deaf or Hard-of-Hearing user with limited technical ability
profile:
    - Cannot hear or has limited hearing. 
    - Uses visual UI and may use voice input selectively. 
    - May be in noisy environments or use hearing aids. 
    - May use speech that is atypical or not easily understood by unfamiliar listeners. 
    - Not a power user or might not be technically savvy. 
interaction_style: 
    input:
        – Typed text 
        - Taps or touch input 
        - "Spoken voice (selectively, depending on context and environment – may switch inputs)"
    output:
        - Visual interface only (text, captions, on-screen prompts) 
    no_reliance_on:
        - Audio-only feedback 
        - Hearing-based cues or system sounds 
        - Accurate speech recognition without visual confirmation 
key_needs:
    - Real-time captions for all bot responses. 
    - "Show captions of user voice input (“You said: ...”) for confirmation."
    - Support correction of misheard commands. 
    - Allow seamless switching between voice and text modes. 
    - Support ASR that handles diverse speech patterns. 
    - Use clear, structured visual prompts (e.g., buttons). 
    - Avoid audio-only feedback. 
    - Provide session summary or transcript. 
    - Ensure high contrast, scalable, readable UI.
cross_functional_considerations:
    customer_care:
        - Do not assume the user can hear or will respond to audio cues 
        - Do not assume the user can speak, they may need to use ASL to communicate 
        - Support chat, SMS, or other visual-first communication options 
        - "Confirm voice input with text ('You said: ...') before acting" 
        - Avoid reliance on phone-only interactions or spoken confirmations 
        - Be patient with slower interactions or repeated clarification needs 
    development:
        - Implement real-time captioning for bot/system responses and user voice input 
        - Provide robust support for toggling between input modes (voice to text) 
        - Use ASR models that support varied or atypical speech patterns 
        - Avoid audio feedback without visual equivalents 
        - Ensure UI elements are clearly labeled and screen reader-compatible if needed 
    design_ux:
        - Use clear visual prompts (buttons, icons, captions) to guide interaction 
        - Ensure real-time captions and/or visual transcripts for system messages 
        - Avoid placing critical information in audio-only formats 
        - Design high-contrast, readable, and flexible UI for clear comprehension 
        - Allow easy switching between text and voice input modes 
    testing:
        - Test voice input accuracy with diverse speech patterns 
        - Validate text captioning and visual confirmations across devices 
        - Confirm that all audio cues have synchronized visual equivalents 
        - Include users with low technical proficiency in usability testing 
        - Test input switching (text to voice) under noisy or low-hearing conditions 
---

## Biography
...