import React, { useEffect, useState } from 'react';
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut
} from '@extension-extension/ui';
import { globalRegistry } from '../index';
import { Command } from '../managers/CommandManager';
import { useHotkeys } from 'react-hotkeys-hook';

export const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const [commands, setCommands] = useState<Command[]>([]);

    // Toggle with Cmd+K
    useHotkeys('meta+k', (e) => {
        e.preventDefault();
        setOpen((open) => !open);
    });

    useEffect(() => {
        // Initial load
        if (globalRegistry.commandManager) {
            setCommands(globalRegistry.commandManager.getAllCommands());
        }

        // Note: Real-time command updates disabled due to eventSource timing issues
        // Commands will update on next render
    }, []);

    const runCommand = (command: Command) => {
        setOpen(false);
        command.action();
    };

    // Group commands
    const groupedCommands = commands.reduce((acc, cmd) => {
        const group = cmd.group || 'General';
        if (!acc[group]) acc[group] = [];
        acc[group].push(cmd);
        return acc;
    }, {} as Record<string, Command[]>);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {Object.entries(groupedCommands).map(([group, groupCommands]) => (
                    <CommandGroup key={group} heading={group}>
                        {groupCommands.map((cmd) => (
                            <CommandItem key={cmd.id} onSelect={() => runCommand(cmd)}>
                                <span>{cmd.title}</span>
                                {cmd.shortcut && <CommandShortcut>{cmd.shortcut}</CommandShortcut>}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                ))}
            </CommandList>
        </CommandDialog>
    );
};
