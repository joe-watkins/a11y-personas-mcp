// Import personas data - built from submodule via scripts/build-data.js
import personas from '../data/personas.json' with { type: 'json' };

/**
 * Helper to create text response
 */
function textResponse(text) {
  return {
    content: [{ type: 'text', text }]
  };
}

/**
 * Find a persona by ID or title (case-insensitive)
 */
function findPersona(query) {
  const queryLower = query.toLowerCase().trim();
  
  // Try exact ID match first
  if (personas[query]) {
    return { id: query, ...personas[query] };
  }
  
  // Try case-insensitive ID match
  const idMatch = Object.keys(personas).find(id => id.toLowerCase() === queryLower);
  if (idMatch) {
    return { id: idMatch, ...personas[idMatch] };
  }
  
  // Try title match (case-insensitive)
  const titleMatch = Object.entries(personas).find(([, p]) => 
    p.data?.title?.toLowerCase() === queryLower
  );
  if (titleMatch) {
    return { id: titleMatch[0], ...titleMatch[1] };
  }
  
  return null;
}

/**
 * Format a persona for output
 */
function formatPersona(persona) {
  const { id, data, content } = persona;
  
  let output = `# ${data.title || id}\n\n`;
  
  if (data.profile?.length) {
    output += `## Profile\n${data.profile.map(p => `- ${p}`).join('\n')}\n\n`;
  }
  
  if (data.interaction_style) {
    output += `## Interaction Style\n`;
    if (data.interaction_style.input?.length) {
      output += `### Input\n${data.interaction_style.input.map(i => `- ${i}`).join('\n')}\n\n`;
    }
    if (data.interaction_style.output?.length) {
      output += `### Output\n${data.interaction_style.output.map(o => `- ${o}`).join('\n')}\n\n`;
    }
    if (data.interaction_style.no_reliance_on?.length) {
      output += `### No Reliance On\n${data.interaction_style.no_reliance_on.map(n => `- ${n}`).join('\n')}\n\n`;
    }
  }
  
  if (data.key_needs?.length) {
    output += `## Key Needs\n${data.key_needs.map(k => `- ${k}`).join('\n')}\n\n`;
  }
  
  if (data.cross_functional_considerations) {
    const cfc = data.cross_functional_considerations;
    output += `## Cross-Functional Considerations\n`;
    if (cfc.customer_care?.length) {
      output += `### Customer Care\n${cfc.customer_care.map(c => `- ${c}`).join('\n')}\n\n`;
    }
    if (cfc.development?.length) {
      output += `### Development\n${cfc.development.map(d => `- ${d}`).join('\n')}\n\n`;
    }
    if (cfc.design_ux?.length) {
      output += `### Design/UX\n${cfc.design_ux.map(d => `- ${d}`).join('\n')}\n\n`;
    }
    if (cfc.testing?.length) {
      output += `### Testing\n${cfc.testing.map(t => `- ${t}`).join('\n')}\n\n`;
    }
  }
  
  if (content) {
    output += content;
  }
  
  return output.trim();
}

/**
 * Tool definitions for a11y-personas MCP
 */
export const tools = [
  {
    name: 'list-personas',
    description: 'List all available accessibility personas with their IDs and titles.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    },
    handler: async () => {
      const list = Object.entries(personas).map(([id, p]) => ({
        id,
        title: p.data?.title || id
      }));
      
      const output = list.map(p => `- **${p.id}**: ${p.title}`).join('\n');
      
      return textResponse(
        `# Available Accessibility Personas (${list.length})\n\n${output}`
      );
    }
  },
  {
    name: 'get-personas',
    description: 'Get detailed information about one or more accessibility personas by ID or title.',
    inputSchema: {
      type: 'object',
      properties: {
        personas: {
          oneOf: [
            { type: 'string', description: 'Single persona ID or title' },
            { type: 'array', items: { type: 'string' }, description: 'Array of persona IDs or titles' }
          ],
          description: 'Persona identifier(s) - can be ID (e.g., "blindness-screen-reader-nvda") or title (e.g., "Screen Reader User (NVDA)")'
        }
      },
      required: ['personas']
    },
    handler: async (args) => {
      const queries = Array.isArray(args.personas) ? args.personas : [args.personas];
      const results = [];
      const notFound = [];
      
      for (const query of queries) {
        const persona = findPersona(query);
        if (persona) {
          results.push(formatPersona(persona));
        } else {
          notFound.push(query);
        }
      }
      
      let output = '';
      
      if (results.length > 0) {
        output = results.join('\n\n---\n\n');
      }
      
      if (notFound.length > 0) {
        const notFoundMsg = `\n\n> **Not found:** ${notFound.join(', ')}\n> Use \`list-personas\` to see all available personas.`;
        output = output ? output + notFoundMsg : notFoundMsg.trim();
      }
      
      return textResponse(output);
    }
  }
];
