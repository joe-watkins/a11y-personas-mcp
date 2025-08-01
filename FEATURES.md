# Features & Enhancements

This document tracks planned features and enhancements for the Accessibility Personas MCP Server.

## 🚀 Planned Enhancements

### #1 Tool Implementation - Real Functionality
**Status**: Pending  
**Priority**: High  

**Current State**: The `get-persona` tool currently returns static text with hardcoded response.

**Implementation Plan**:

#### File System Integration
- Import Node.js `fs` module (`readFileSync`, `readdirSync`)
- Import `path` module (`join`, `dirname`) for cross-platform path handling
- Import `url` module (`fileURLToPath`) to get `__dirname` in ES modules

#### Dynamic Persona Discovery
- Create `getAvailablePersonas()` function that:
  - Reads the `personas/` directory
  - Filters for `.md` files (excludes `_template.md`)
  - Returns array of persona names without `.md` extension

#### Enhanced get-persona Tool
- Replace static enum with dynamic persona validation
- Read actual persona files from `personas/` directory
- Return real markdown content from persona files
- Add proper error handling for missing personas
- Provide helpful error messages with available personas list

#### Code Structure
```javascript
// File imports
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function
const getAvailablePersonas = () => {
    const personasDir = join(__dirname, 'personas');
    return readdirSync(personasDir)
        .filter(file => file.endsWith('.md') && !file.startsWith('_'))
        .map(file => file.replace('.md', ''));
};

// Tool implementation with try/catch error handling
// Real file reading with readFileSync()
// Dynamic persona enumeration
```

#### Testing Considerations
- Test with all existing persona files
- Test error handling with invalid persona names
- Verify cross-platform path handling works correctly

---

### #2 Add List Personas Tool
**Status**: Pending  
**Priority**: Medium  

**Description**: Add a new tool to list all available accessibility personas without requiring a specific persona name.

**Implementation**:
- Tool name: `list-personas`
- No parameters required
- Returns formatted list of available personas
- Uses the same `getAvailablePersonas()` helper function

---

### #3 Update Documentation
**Status**: Pending  
**Priority**: Medium  

**Description**: Update README.md to reflect actual functionality instead of placeholder content.

**Requirements**:
- Document both tools (`get-persona` and `list-personas`)
- List all available personas by name
- Update usage examples
- Remove placeholder/template content

---

## 🎯 Future Considerations

### Persona Metadata Support
- Add frontmatter parsing for persona metadata
- Support for persona categories or tags
- Version tracking for persona updates

### Enhanced Error Handling
- Validate persona file format
- Handle corrupted or invalid markdown files
- Provide more detailed error messages

### Performance Optimizations
- Cache persona list on server startup
- Implement file watching for dynamic updates
- Add persona content caching with invalidation

### Additional Tools
- Search personas by keywords or characteristics
- Get persona summary/excerpt
- Validate persona file format
- Export personas in different formats

---

## 📝 Implementation Notes

- All personas are stored as markdown files in the `personas/` directory
- Template file (`_template.md`) should be excluded from available personas
- Current personas:
  - `deaf-blind.md`
  - `low-vision-taylor.md` 
  - `motor-impaired-non-speaking.md`
  - `sighted-deaf-hoh-low-tech.md`

- ES modules require special handling for `__dirname` using `fileURLToPath`
- Cross-platform path handling is important for Windows/Unix compatibility
- Error messages should be helpful and guide users to available options
