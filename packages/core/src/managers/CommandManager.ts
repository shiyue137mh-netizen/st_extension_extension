import { globalRegistry } from '../index';

export interface Command {
    id: string;
    title: string;
    description?: string;
    action: () => void;
    shortcut?: string;
    group?: string;
}

export class CommandManager {
    private commands: Map<string, Command> = new Map();

    constructor() {
        console.log('CommandManager initialized');
    }

    registerCommand(command: Command) {
        console.log(`Registering command: ${command.title}`);
        this.commands.set(command.id, command);
        // Note: Event emission disabled - UI updates handled via direct state access
        // globalRegistry.events.emit('commands-updated', this.getAllCommands());
    }

    unregisterCommand(id: string) {
        this.commands.delete(id);
        // Note: Event emission disabled
        // globalRegistry.events.emit('commands-updated', this.getAllCommands());
    }

    getAllCommands(): Command[] {
        return Array.from(this.commands.values());
    }

    executeCommand(id: string) {
        const command = this.commands.get(id);
        if (command) {
            command.action();
        } else {
            console.warn(`Command not found: ${id}`);
        }
    }
}
