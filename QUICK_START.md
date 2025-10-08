# Quick Start Guide - A11y Personas MCP

## What is this project?

A **production-ready** system that provides 60+ accessibility personas through two interfaces:
1. **MCP Server** for AI/Copilot integration
2. **REST API** for web applications

## 🚀 5-Minute Quick Start

### For VS Code / GitHub Copilot Users

```bash
# 1. Clone and install
git clone https://github.com/joe-watkins/a11y-personas-mcp.git
cd a11y-personas-mcp
npm install

# 2. Configure in VS Code
# Open Command Palette (Cmd+Shift+P)
# Search: "MCP install"
# Command: npm start --silent
# Name: A11y Personas MCP

# 3. Use in Copilot
#list-personas
#get-personas "deaf-blind"
```

### For Web Developers / API Users

```bash
# 1. Clone and install
git clone https://github.com/joe-watkins/a11y-personas-mcp.git
cd a11y-personas-mcp
npm install

# 2. Start the API server
npm run server

# 3. Use the API
curl http://localhost:3000/list-personas
curl http://localhost:3000/get-personas?personas=deaf-blind
```

### Quick Test (No Installation)

Try the live API right now:
```bash
curl https://a11y-personas-mcp.vercel.app/list-personas
curl https://a11y-personas-mcp.vercel.app/get-personas?personas=low-vision,deaf-blind
```

## 📊 What You Get

### 60+ Accessibility Personas Covering:

| Category | Count | Examples |
|----------|-------|----------|
| **Vision** | 11 | Blindness, Low Vision, Colorblindness |
| **Hearing** | 7 | Deafness, Sign Language, Tinnitus |
| **Motor** | 8 | Wheelchair, Tremor, RSI |
| **Cognitive** | 17 | ADHD, Autism, Dyslexia, Memory Loss |
| **Mental Health** | 4 | Anxiety, Depression, PTSD |
| **Temporary** | 9 | One-handed, Noisy Environment |

### Each Persona Includes:

- ✅ **Profile**: Key characteristics and abilities
- ✅ **Interaction Style**: Input/output methods, limitations
- ✅ **Key Needs**: Specific accessibility requirements
- ✅ **Cross-functional Guidance**: For customer care, dev, design, testing

## 🔧 Common Use Cases

### 1. Design Review
```
Get the personas for users who rely on keyboard navigation
#get-personas ["deaf-blind", "motor-impaired-non-speaking", "blindness-screen-reader-nvda"]
```

### 2. Testing Scenarios
```bash
# Get personas for testing your new form
curl https://a11y-personas-mcp.vercel.app/get-personas?personas=low-vision,dyslexia-reading,motor-impaired-non-speaking
```

### 3. Team Education
```
List all available personas to understand accessibility needs
#list-personas
```

### 4. Specific Feature Planning
```
Get autism-related personas for designing a new onboarding flow
#get-personas ["autistic-sensory-sensitive", "autistic-rule-oriented", "autistic-executive-function"]
```

## 📖 Key Commands

### MCP Server (main.js)
```bash
npm start         # Start MCP server
npm run dev       # Start with watch mode
```

### REST API (server.js)
```bash
npm run server      # Start API server
npm run server:dev  # Start with watch mode
```

## 🌐 API Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /list-personas` | List all personas | `/list-personas` |
| `GET /get-personas` | Get specific personas | `/get-personas?personas=deaf-blind` |
| `GET /health` | Health check | `/health` |

## 🎯 MCP Tools

| Tool | Description | Example |
|------|-------------|---------|
| `list-personas` | List all with titles | `#list-personas` |
| `get-personas` | Get by ID or title | `#get-personas "Deafblind Person"` |

## 💡 Pro Tips

1. **Use IDs or Titles**: Both work! `deaf-blind` or `"Deafblind Person"`
2. **Multiple Personas**: Get several at once: `["id1", "id2", "id3"]`
3. **Case Insensitive**: Don't worry about exact case matching
4. **Fuzzy Title Matching**: Partial titles work too
5. **Error Messages**: Helpful suggestions when persona not found

## 📚 Full Documentation

- **README.md**: Complete installation and usage guide
- **API.md**: Detailed REST API documentation
- **PROJECT_STATUS.md**: Comprehensive project overview
- **Live Demo**: https://a11y-personas-mcp.vercel.app/

## ⚠️ Important Note

**These personas are educational tools** - they don't replace working with real people with disabilities. Always:
- Prioritize user research with actual users
- Get direct feedback from your target audience
- Remember: every person's experience is unique

## 🤝 Contributing

Want to add a persona or improve existing ones?

1. Check no one else is working on it
2. Use `personas/_template.md`
3. Follow people-first language guidelines
4. One persona per pull request

## 🔗 Quick Links

- **Live API**: https://a11y-personas-mcp.vercel.app/
- **Repository**: https://github.com/joe-watkins/a11y-personas-mcp
- **Issues**: https://github.com/joe-watkins/a11y-personas-mcp/issues

---

**Questions?** Check the full documentation or open an issue!
