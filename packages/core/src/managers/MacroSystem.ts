import Handlebars from 'handlebars';
import { globalRegistry } from '../index';

// Define MacroCallback type if it's not already defined elsewhere
// Assuming it's a function that takes some arguments and returns a string or void
type MacroCallback = (...args: any[]) => string | void;

export class MacroSystem {
    // Internal map to store macro details, including description
    private macros: Map<string, { callback: MacroCallback, description?: string }>;

    constructor() {
        console.log('MacroSystem initialized');
        this.macros = new Map(); // Initialize the map
    }

    registerMacro(name: string, callback: MacroCallback, description?: string) {
        // Register with Handlebars
        Handlebars.registerHelper(name, callback as any);
        // Store internally with description
        this.macros.set(name, { callback, description });
        // Also register with globalRegistry if it's still needed for other purposes
        globalRegistry.macros.set(name, callback);
        console.log(`[MacroSystem] Macro registered: ${name}`);
    }

    /**
     * Get all registered macro names
     */
    getRegisteredMacros(): string[] {
        return Array.from(this.macros.keys());
    }

    /**
     * Get macro count
     */
    getMacroCount(): number {
        return this.macros.size;
    }

    processString(template: string, context: any = {}): string {
        try {
            const compiled = Handlebars.compile(template);
            return compiled(context);
        } catch (e) {
            console.error('Error processing macro:', e);
            return template;
        }
    }
}
