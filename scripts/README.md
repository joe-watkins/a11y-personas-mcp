# Persona Scraper Scripts

This directory contains scripts for automatically creating accessibility personas from web content.

## Files

- **`mcp-persona-scraper.js`** - Main scraper that integrates with MCP tools
- **`persona-scraper.js`** - Base scraper with detailed content analysis
- **`test-scraper.js`** - Test script for validation
- **`package.json`** - Dependencies and scripts

## Installation

```bash
cd scripts
npm install
```

## Usage

### Basic Usage

```bash
node mcp-persona-scraper.js "https://example.com/user-story" "persona-name"
```

### Examples

```bash
# Create a visual processing disorder persona
node mcp-persona-scraper.js "https://site.com/visual-processing" "visual-processing"

# Create a motor impairment persona  
node mcp-persona-scraper.js "https://example.com/motor-disability" "motor-impaired"

# Create a cognitive accessibility persona
node mcp-persona-scraper.js "https://docs.example.com/cognitive-needs" "cognitive-disability"
```

### Test the Scraper

```bash
node test-scraper.js
```

## How It Works

1. **Web Scraping**: Uses MCP Firecrawl tools to extract content from the provided URL
2. **Content Analysis**: Analyzes the scraped content to identify:
   - Disability type and characteristics
   - Assistive technologies mentioned
   - Accessibility barriers
   - User needs and pain points
3. **Persona Generation**: Creates a structured persona following the template format:
   - Profile characteristics
   - Interaction styles (input/output/no_reliance_on)
   - Key accessibility needs
   - Cross-functional team considerations
   - Biography with background and quote
4. **File Creation**: Saves the persona as a markdown file in the `personas/` directory
5. **Pattern Updates**: Automatically updates accessibility patterns for the new persona

## Content Analysis Features

The scraper automatically detects and categorizes:

### Disability Types
- **Visual Processing**: Reading difficulties, text processing issues
- **Low Vision**: Vision loss requiring magnification
- **Blind**: Complete vision loss, screen reader dependence  
- **Deaf/HoH**: Hearing impairment requiring visual alternatives
- **Motor**: Mobility/dexterity impairments affecting input
- **Cognitive**: Memory, attention, or processing differences

### Assistive Technologies
- Screen readers (NVDA, JAWS, VoiceOver)
- Screen magnification tools
- Voice control software
- Switch navigation systems
- Eye tracking devices
- High contrast modes
- Text-to-speech tools

### Accessibility Barriers
- Small text or low contrast
- Complex visual layouts
- Mouse-only interactions
- Time-sensitive interfaces
- Audio-only content
- Visual-only instructions
- Inconsistent navigation

## Generated Persona Structure

Each generated persona includes:

```yaml
---
title: "Generated Persona Title"
profile:
  - Primary disability description
  - Independence level
  - Assistive technology usage
  - Additional considerations
interaction_style:
  input:
    - Preferred input methods
    - Assistive technology inputs
  output:
    - Accessible output formats
    - Preferred feedback types
  no_reliance_on:
    - Problematic interaction patterns
    - Inaccessible interface elements
key_needs:
  - Specific accessibility requirements
  - Technical implementation needs
  - User experience considerations
cross_functional_considerations:
  customer_care:
    - Support channel recommendations
    - Communication guidelines
  development:
    - Technical implementation requirements
    - Testing recommendations
  design_ux:
    - Design system considerations
    - Visual design requirements
  testing:
    - QA testing approaches
    - Validation methods
---

## Biography
Generated biography with background, quote, and interface requirements list.
```

## Integration with MCP Tools

The scraper integrates with several MCP tools:

- **Firecrawl**: For web content extraction
- **Accessibility Personas**: For pattern analysis and updates
- **Content Analysis**: For intelligent persona generation

## Customization

### Modifying Analysis Patterns

Edit the analysis functions in `mcp-persona-scraper.js`:

- `analyzeContentForDisability()` - Add new disability type patterns
- `extractAssistiveTechnologies()` - Add new assistive tech detection
- `extractBarriers()` - Add new barrier pattern recognition
- `generateKeyNeeds()` - Customize need generation logic

### Adding New Disability Types

To add support for new disability types:

1. Add patterns to `analyzeContentForDisability()`
2. Add interaction styles in `generateInteractionStyle()`
3. Add specific needs in `generateKeyNeeds()`
4. Add team considerations in `generateCrossFunctionalConsiderations()`

## Error Handling

The scraper includes robust error handling:

- **Network failures**: Falls back to manual content entry prompts
- **Content analysis failures**: Uses generic accessibility template
- **File system errors**: Provides clear error messages
- **Invalid URLs**: Validates and suggests corrections

## Output Quality

Generated personas include:

- **Confidence scores** for disability type detection
- **Source attribution** with original URL
- **Generation metadata** including date and version
- **Analysis summary** showing matched patterns
- **Validation status** against template requirements

## Best Practices

1. **URL Selection**: Choose URLs with rich accessibility content
2. **Persona Naming**: Use descriptive, hyphenated names (e.g., "visual-processing-disorder")
3. **Review Generated Content**: Always review and refine generated personas
4. **Test Integration**: Verify personas work with your accessibility review tools
5. **Update Patterns**: Keep accessibility patterns current with new personas

## Troubleshooting

### Common Issues

**"No content extracted"**
- Check URL accessibility
- Verify the page contains relevant accessibility information
- Try a different scraping approach

**"Low confidence disability detection"**
- Page may not contain enough specific accessibility information
- Review and manually enhance the generated persona
- Consider using a more specific source URL

**"Pattern update failed"**
- MCP tools may not be available
- Pattern file permissions issue
- Run pattern update manually after persona creation

### Debug Mode

Add debug logging by setting environment variable:
```bash
DEBUG=1 node mcp-persona-scraper.js "url" "name"
```

## Contributing

To improve the scraper:

1. Add new disability type detection patterns
2. Enhance assistive technology recognition
3. Improve barrier identification
4. Expand cross-functional considerations
5. Add support for new content sources

## License

MIT License - see main project for details.
