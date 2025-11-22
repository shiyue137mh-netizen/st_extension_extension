import Handlebars from 'handlebars';
import { globalRegistry } from '../index';

export class MacroSystem {
    constructor() {
        console.log('MacroSystem initialized');
    }

    registerMacro(name: string, fn: Function) {
        console.log(`Registering macro: ${name}`);
        Handlebars.registerHelper(name, fn as any);
        globalRegistry.macros.set(name, fn);
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
