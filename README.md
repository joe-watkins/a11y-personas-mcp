# Accessibility Personas MCP (Model Context Protocol Server)

A Model Context Protocol (MCP) server designed for AI and LLM-powered accessibility analysis, automation, and inclusive design evaluation. This project provides 60+ structured accessibility personas and tools for use by AI agents, Copilot, and other LLM-based systems. Whether you want to review designs, test code or content against personas, ask accessibility consulting questions, review customer support scripts, or integrate inclusive practices into your workflow, this server enables AI-driven accessibility insights and recommendations.

## Important note about synthetic users with disabilities

**These synthetic personas are educational tools and starting points for accessibility considerations—they do not replace the need to work directly with real people with disabilities.** Each person's experience with disability is unique, and these generalized personas may not accurately reflect the full spectrum of real-world impacts, adaptive strategies, or individual preferences. For meaningful accessibility improvements, always prioritize user research, usability testing, and direct feedback from people with disabilities in your target audience.

## Installation in VS Code / Github Copilot
1. Clone this project
2. Open VS Code Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
3. Search for "MCP install" and select it
4. Choose "Command (stdio)" as the connection type
5. Configure the MCP server:
   - **Command**: `npm start --silent`
   - **Name**: `A11y Personas MCP`
   - **Type**: Local MCP
5. Save the configuration

*note:* The MCP server will now be available in your VS Code MCP clients list. Start the server by clicking on the gear icon and choosing "Start Server". Ensure you are in Agent mode and run the  `#list-personas` tool in Copilot to list all personas and to start working with them. The A11y Personas MCP Tools should be listed in your Copilot tools panel.

## Tools
### `list-personas`
Lists all available accessibility personas with their descriptive titles.

Usage in Copilot:
```
#list-personas
```
![Screenshot of list-personas output](https://github.com/joe-watkins/a11y-personas-mcp/blob/main/readme-images/list-personas-show-some.png?raw=true)

### `get-persona`
Retrieves the complete accessibility persona documentation for one or more personas. Supports both persona IDs (filename without .md) and titles from frontmatter.

Usage in Copilot:
```
#get-persona Blindness (Braille User)
#get-persona low-vision
#get-persona "ADHD (Attention/Executive Function)"
#get-persona "Motor-Impaired / Non-Speaking Person"
#get-persona ["low-vision", "deaf-blind"]
#get-persona "Low Vision User", "Deafblind Person"
#get-persona "Autistic (Sensory Sensitive)", "Migraine (Light/Sound Sensitivity)"
```

**Parameters:**
- `personas` (string | array): Single persona or array of persona identifiers. Can be:
  - Persona ID: filename without .md (e.g., "deaf-blind", "low-vision") 
  - Persona Title: title from frontmatter (e.g., "Blindness (Braille User)", "Low Vision User")
  - Array of IDs/titles: multiple personas in one request

**Returns:** Full markdown content including profile, interaction style, key needs, and cross-functional considerations. For multiple personas, returns formatted sections with separators.


**Parameters:** None

**Returns:** Formatted list of all available personas with user-friendly titles.

![Screenshot of list-personas output](https://github.com/joe-watkins/a11y-personas-mcp/blob/main/readme-images/get-persona-single.png?raw=true)


### `review-customer-support-scripts`
Reviews customer support scripts through the lens of accessibility personas to identify barriers and suggest improvements.

Usage in Copilot:
```
#review-customer-support-scripts Click the big red button in the top right corner of your screen to access your account settings. If you don't see it, please refresh your browser and try again.
```

**Parameters:**
- `script_content` (string): The support script text to review
- `script_type` (string): The type of support interaction (phone, chat, email, in-person)
- `issue_category` (string): The category of support issue (technical-support, billing, account-access, etc.)
- `personas` (array, optional): Specific personas to focus on (default: all)

**Returns:** Accessibility grade (A-F), persona-specific issues with severity levels, suggested improvements, and inclusive alternatives.

![Screenshot of list-personas output](https://github.com/joe-watkins/a11y-personas-mcp/blob/main/readme-images/review-customer-support-script.png?raw=true)


### `analyze-persona-patterns`
When adding a new Persona this analyzes an existing persona or new one and suggests accessibility pattern updates to maintain comprehensive coverage.

Usage in Copilot:
```
#analyze-persona-patterns deaf-blind
```

**Parameters:**
- `persona_id` (string): The persona identifier (e.g., "deaf-blind", "low-vision-taylor")
- `auto_update` (boolean, optional): Whether to automatically update patterns file (default: false)

**Returns:** Analysis of existing patterns that should include this persona, suggested new patterns, and optional automatic updates.

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
- **One-Handed (Limb Difference)** - Single-hand interaction needs
- **Motor-Impaired / Non-Speaking Person** - Motor and communication challenges
- **Multiple Sclerosis (Fluctuating Ability)** - Variable symptom presentation
- **Noisy Environment (Limited Audio)** - Environmental audio challenges
- **Paraplegia (Wheelchair User)** - Wheelchair mobility needs
- **Parkinson's Disease (Tremor)** - Movement control difficulties
- **PTSD (Trauma-Related)** - Trauma-sensitive interaction needs
- **Sighted Deaf or Hard-of-Hearing user with limited technical ability** - Deaf/HoH with basic tech skills
- **Speech Impairment (Communication)** - Speech production challenges
- **Crisis Situation (Acute Stress)** - High-stress emergency scenarios
- **Holding Child (One-Handed)** - Situational one-handed use
- **Public Place (Privacy Concern)** - Privacy and discretion needs
- **Tourette's Syndrome (Tics)** - Involuntary movement considerations
- **Vestibular Balance Disorder** - Sensitivity to motion
- **Visual Processing Disorder** - Visual information processing difficulties

Each persona includes detailed profile information, interaction preferences, key needs, and cross-functional guidance for customer care, development, design, and testing teams.

## Sample Prompts

Once the MCP server is installed and running, you can use prompts like these in your MCP client:

### Basic Persona Queries

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
#get-persona ["low-vision", "deaf-blind", "motor-impaired-non-speaking"]
```

```
#get-persona "Low Vision User", "Deaf-Blind"
```

```
Compare the needs of users with visual and motor impairments by getting both low-vision and motor-impaired-non-speaking personas
```

### Customer Support Script Review

**Review a support script for accessibility issues:**
```
#review-customer-support-scripts "Hello, thank you for calling support. Please look at your screen and click on the red 'Account Settings' button in the top right corner. Once you see the settings page load, please tell me verbally what you see so I can confirm you're in the right place. If you don't see it within 10 seconds, refresh your browser and try again."
```

**Review with specific personas:**
```
#review-customer-support-scripts "Hi! To help you reset your password, I need you to quickly navigate to your email and click the reset link we just sent. Please do this now and let me know when you see the confirmation page."

Script type: chat  
Issue category: technical-support
Personas: ["motor-impaired-non-speaking", "sighted-deaf-hoh-low-tech"]
```

**Review different script types:**
```
#review-customer-support-scripts "Thank you for contacting support. Please watch the attached video tutorial to resolve your issue. If you can't see the solution clearly, call our phone support line for further assistance."

Script type: email
Issue category: technical-support
```

### Accessibility Consultation Questions

**General accessibility questions:**
```
What accessibility considerations should I keep in mind for users with motor impairments?
```

```
How should customer care handle interactions with deafblind users?
```

```
#get-persona low-vision What are the main barriers for users with low vision when using customer support?
```

```
Review this support process for accessibility issues:

"Our standard support process requires customers to: 1) Call our phone line, 2) Navigate to our website while on the call, 3) Click through multiple menus to find their account settings, 4) Read confirmation codes aloud, and 5) Confirm changes verbally before hanging up."

Script type: phone
Issue category: account-access
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get involved.

## Resources

### Model Context Protocol (MCP)
- **[MCP Main Repository](https://github.com/modelcontextprotocol)** - Official Model Context Protocol documentation, specifications, and examples
- **[TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)** - TypeScript/JavaScript SDK used to build this MCP server, includes APIs for creating tools, resources, and prompts
- **[MCP Inspector](https://github.com/modelcontextprotocol/inspector)** - Debugging tool for testing and inspecting MCP servers during development
