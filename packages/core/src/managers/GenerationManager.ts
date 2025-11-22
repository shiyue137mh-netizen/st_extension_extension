import { eventSource } from '@sillytavern/script';

export type GenerationStep = (context: any, next: () => Promise<any>) => Promise<any>;

export class GenerationManager {
    private interceptors: {
        onBefore: ((prompt: string) => string)[];
        onStream: ((token: string) => string)[];
        onAfter: ((text: string) => string)[];
    } = {
            onBefore: [],
            onStream: [],
            onAfter: []
        };

    constructor() {
        // Listen to ST events if possible to trigger interceptors
        // For now, this manager primarily serves as a utility for extensions to run their own generation pipelines
        // or if we can monkey-patch ST's generation, we would do it here (but that's risky)
    }

    intercept(hooks: {
        onBefore?: (prompt: string) => string;
        onStream?: (token: string) => string;
        onAfter?: (text: string) => string;
    }) {
        if (hooks.onBefore) this.interceptors.onBefore.push(hooks.onBefore);
        if (hooks.onStream) this.interceptors.onStream.push(hooks.onStream);
        if (hooks.onAfter) this.interceptors.onAfter.push(hooks.onAfter);
    }

    // A helper to run the pipeline (to be used by extensions that want to generate text)
    async processBefore(prompt: string): Promise<string> {
        let result = prompt;
        for (const hook of this.interceptors.onBefore) {
            result = hook(result);
        }
        return result;
    }

    processStream(token: string): string {
        let result = token;
        for (const hook of this.interceptors.onStream) {
            result = hook(result);
        }
        return result;
    }

    processAfter(text: string): string {
        let result = text;
        for (const hook of this.interceptors.onAfter) {
            result = hook(result);
        }
        return result;
    }
}
