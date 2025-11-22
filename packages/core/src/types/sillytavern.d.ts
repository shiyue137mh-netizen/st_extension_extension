declare module '@sillytavern/script' {
    export const eventSource: {
        on: (event: string, handler: (...args: any[]) => void) => void;
        off: (event: string, handler: (...args: any[]) => void) => void;
        emit: (event: string, ...args: any[]) => void;
        once: (event: string, handler: (...args: any[]) => void) => void;
    };
    export const substituteParamsExtended: (text: string) => string;
}

declare global {
    interface Window {
        eventSource: any;
        substituteParamsExtended: any;
    }
}
