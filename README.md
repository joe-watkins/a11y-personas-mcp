# Accessibility Personas MCP (Model Context Protocol Server)

A Model Context Protocol (MCP) server providing 60+ accessibility personas for your inclusive design and development needs. This server enables AI agents, Copilot, and LLMs to access detailed accessibility personas that can be used for design reviews, testing, and inclusive design and development workflows.

## Important note about synthetic users with disabilities

**These synthetic personas are educational tools and starting points for accessibility considerations—they do not replace the need to work directly with real people with disabilities.** Each person's experience with disability is unique, and these generalized personas may not accurately reflect the full spectrum of real-world impacts, adaptive strategies, or individual preferences. For meaningful accessibility improvements, always prioritize user research, usability testing, and direct feedback from people with disabilities in your target audience.

These personas are more centered around the technical and functional aspects of accessibility, rather than personal narratives or lived experiences. They are designed to help teams understand the specific interaction styles, key needs, and cross-functional considerations for various disabilities, enabling more effective design and development practices.

## Installation in VSCode / Github Copilot

1. Clone this project
2. Open the project in Visual Studio Code
3. Run `npm install` to install dependencies
4. Open VS Code Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
5. Search for "MCP install" and select it
6. Choose "Command (stdio)" as the connection type
7. Choose "Global or Workspace" for the installation scope
8. Configure the MCP server:
   - **Command**: `npm start --silent`
   - **Name**: `A11y Personas MCP`
   - **Type**: Local MCP

The MCP server will now be available in your VS Code MCP clients list. Start the server by clicking on the gear icon and choosing "Start Server". Ensure you are in Agent mode and run the `#list-personas` tool in Copilot to start working with the personas.

## Tools

### `list-personas`
Lists all available accessibility personas with their descriptive titles.

Usage in Copilot:
```
#list-personas
```

![Screenshot of list-persons output](https://github.com/joe-watkins/a11y-personas-mcp/blob/main/images/list-personas-show-some.png?raw=true)


### `get-personas`
Retrieves the complete accessibility persona documentation for one or more personas. Supports both persona IDs (filename without .md) and titles from frontmatter.

Usage in Copilot:
```
#get-personas "Blindness (Braille User)"
#get-personas low-vision
#get-personas ["low-vision", "deaf-blind"]
#get-personas "Low Vision User", "Deafblind Person"
```

**Parameters:**
- `personas` (string | array): Single persona or array of persona identifiers. Can be:
  - Persona ID: filename without .md (e.g., "deaf-blind", "low-vision") 
  - Persona Title: title from frontmatter (e.g., "Blindness (Braille User)", "Low Vision User")
  - Persona ID (filename): e.g., "low-vision", "deaf-blind"  
  - Persona title: e.g., "Low Vision User", "Deafblind Person"
  - Array of IDs/titles: multiple personas in one request

**Returns:** Full markdown content including profile, interaction style, key needs, and cross-functional considerations. For multiple personas, returns formatted sections with separators.

![Screenshot of get-persona output](https://github.com/joe-watkins/a11y-personas-mcp/blob/main/images/get-persona-single.png?raw=true)


## Available Personas

This MCP server provides access to 60+ accessibility personas covering permanent disabilities, temporary impairments, and situational limitations:

- **ADHD (Attention/Executive Function)** - Focus and executive function challenges
- **Aging (Multiple Mild Impairments)** - Combined age-related accessibility needs
- **Anxiety (Mental Health)** - Anxiety-related interaction considerations
- **Arthritis (Rheumatoid)** - Joint pain and mobility limitations
- **Autistic (Communication Differences)** - Communication and social interaction needs
- **Autistic (Executive Function Differences)** - Planning and organizational challenges
- **Autism (Non-Speaking)** - Non-verbal communication needs
- **Autistic (Rule-Oriented)** - Preference for clear, consistent patterns
- **Autistic (Sensory Sensitive)** - Sensory processing sensitivities
- **Autistic (Visual Thinker)** - Visual processing preferences
- **Autistic** - General autism spectrum considerations
- **Blindness (Braille User)** - Braille reading and tactile navigation
- **Blindness (Light Perception Only)** - Minimal light perception
- **Blindness (Low Vision, Progressive)** - Declining vision over time
- **Blindness (Screen Reader - NVDA)** - NVDA screen reader user
- **Blindness (Screen Reader - VoiceOver)** - VoiceOver screen reader user
- **Broken Dominant Arm (Temporary One-Handed)** - Temporary one-handed use
- **Cognitive (Aphasia - Language Processing)** - Language processing difficulties from brain injury
- **Cognitive (Age-Related Memory Loss)** - Memory and cognitive decline
- **Color Vision Deficiency (Colorblindness)** - Color perception limitations
- **Concussion (Cognitive Fatigue)** - Cognitive processing difficulties
- **Deafblind Person** - Combined hearing and vision loss
- **Deafness (Deafblind)** - Profound hearing and vision loss
- **Deafness (Hard of Hearing)** - Partial hearing loss
- **Deafness (Late-Deafened)** - Hearing loss later in life
- **Deafness (Oral Communicator)** - Oral communication preference
- **Deafness (Sign Language First, No Residual Hearing)** - Primary sign language user
- **Deafness (Sign Language User, Also Uses Speech)** - Bilingual communication
- **Deafness (Sign Language User)** - Sign language communication
- **Major Depression (Low Motivation)** - Depression-related challenges
- **Dyscalculia (Number Processing)** - Difficulties with numerical concepts
- **Dyslexia (Reading/Processing)** - Reading and text processing difficulties
- **Epilepsy (Seizure Risk)** - Seizure sensitivity considerations
- **Eye Patch (Temporary Monocular Vision)** - Temporary single-eye vision
- **Chronic Fatigue Syndrome (Variable Energy)** - Fluctuating energy levels
- **Hearing Loss (Age-Related)** - Progressive hearing decline
- **Intellectual Disability (Mild)** - Cognitive processing considerations
- **Laryngitis (Temporary Voice Loss)** - Temporary speech limitations
- **Non-Native/Low Literacy Digital** - Limited digital literacy
- **Low Vision User** - Partial vision impairment
- **Migraine (Light/Sound Sensitivity)** - Sensory trigger sensitivity
- **Chronic Pain (Mobility/Energy)** - Pain-related limitations
- **Repetitive Stress Injury (Mobility/RSI)** - Computer-related strain and ergonomic needs
- **One-Handed (Limb Difference)** - Single-hand interaction needs
- **Motor-Impaired / Non-Speaking Person** - Motor and communication challenges
- **Multiple Sclerosis (Fluctuating Ability)** - Variable symptom presentation
- **Noisy Environment (Limited Audio)** - Environmental audio challenges
- **Paraplegia (Wheelchair User)** - Wheelchair mobility needs
- **Parkinson's Disease (Tremor)** - Movement control difficulties
- **PTSD (Trauma-Related)** - Trauma-sensitive interaction needs
- **Sighted Deaf or Hard-of-Hearing user with limited technical ability** - Deaf/HoH with basic tech skills
- **Speech Impairment (Communication)** - Speech production challenges
- **Tinnitus (Audio Sensitivity)** - Phantom sound sensitivity and audio control needs
- **Crisis Situation (Acute Stress)** - High-stress emergency scenarios
- **Holding Child (One-Handed)** - Situational one-handed use
- **Public Place (Privacy Concern)** - Privacy and discretion needs
- **Tourette's Syndrome (Tics)** - Involuntary movement considerations
- **Vestibular Balance Disorder** - Sensitivity to motion
- **Vision (Contrast Sensitivity)** - Difficulty with low-contrast visual elements
- **Visual Processing Disorder** - Visual information processing difficulties


## Example Persona

### Deafblind Person

**Profile:**
- Profound hearing and vision loss
- Uses a screen reader with a braille display
- Cannot perceive audio or visual content
- Non-speaking individual

**Interaction Style:**
- **Input:** Braille keyboard, switch input, or other tactile methods
- **Output:** Braille display only
- **Cannot rely on:** Voice input/output, visual interface, audio content

**Key Needs:**
- Real-time text output (captions) for communication
- Fully functional text input paths
- Screen reader and braille compatibility
- Support for keyboard/switch navigation
- Long timeouts to accommodate slower interaction
- Text-based confirmation of actions
- Text transcripts available after chat sessions
- Non-visual, non-audio interaction path for all tasks
- Haptics for interaction cues

**Cross-Functional Considerations:**

*Customer Care:*
- Do not assume the customer can hear, speak, or see
- Offer chat, text, or RTT as default communication channels
- Avoid references to voice tone, visual cues, or spoken confirmation
- Allow longer response times for braille input
- Always provide written confirmation of actions or outcomes

*Development:*
- Ensure full keyboard access for all functionality
- Use semantic HTML and ARIA for UI components
- Allow adjustable timeout settings
- Include accessible text equivalents for visual or auditory outputs
- Maintain proper focus management and live region announcements
- Leverage onboard haptic support when applicable
- Ensure multimedia supports captions and text transcripts

*Design/UX:*
- Ensure fully linear, text-based interaction paths
- Use semantic headings and landmarks for navigation
- Do not rely on color, sound, or animation for feedback
- Prioritize consistent, descriptive labeling
- Avoid modal or focus traps; ensure logical tab order

*Testing:*
- Perform manual QA with keyboard and screen reader
- Emulate braille display outputs
- Verify live region outputs work correctly with screen readers
- Validate tasks using only keyboard
- Test for reliance on visual or audio cues during task completion
- Ensure text feedback is immediate and programmatically accessible
- Test edge cases involving slow, sequential input

This persona represents the most comprehensive accessibility requirements, as it combines the needs of both blind and deaf users, requiring purely tactile interaction methods.

## Sample Prompts

Once the MCP server is installed and running, you can use prompts like these in your MCP client:

**List all available personas:**
```
#list-personas
```

**Get a specific persona:**
```
#get-personas "deaf-blind"
```

```
#get-personas "Low Vision User"
```

```
#get-personas "Motor-Impaired / Non-Speaking Person"
```

**Get multiple personas:**
```
#get-personas ["low-vision", "deaf-blind", "motor-impaired-non-speaking"]
```

**List all available personas:**
```
List all available accessibility personas
```

**Get a specific persona:**
```
Get the deaf-blind persona
```

```
Tell me about the low vision user persona
```

```
I need information about the motor-impaired non-speaking persona
```

```
Show me the sighted deaf hard-of-hearing persona with low tech skills
```

**Get multiple personas:**
```
#get-personas ["low-vision", "deaf-blind", "motor-impaired-non-speaking"]
```

```
#get-personas "Low Vision User", "Deaf-Blind"
```

## Contributing

We welcome contributions! Please open an issue or pull request with your proposed changes. For major changes, discuss them with the maintainers first.

1. Ensure that there is not already an issue or pull request for your change.
2. Double check that the Persona is not already defined in `personas/`.
3. *Template* Ensure the /data/_template.md file is used for new personas.
4. Create only a single Persona per Pull Request.

Thank you for helping improve accessibility for all!

## License
This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit) file for details