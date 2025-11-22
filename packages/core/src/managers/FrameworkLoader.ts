export class FrameworkLoader {
    private loadedFrameworks: Set<string> = new Set();
    private loadingPromises: Map<string, Promise<any>> = new Map();

    constructor() {
        console.log('[FrameworkLoader] Initialized');
        // Check if frameworks are already loaded
        if ((window as any).Vue) {
            this.loadedFrameworks.add('vue');
        }
        if ((window as any).React) {
            this.loadedFrameworks.add('react');
        }
    }

    /**
     * Load Vue 3 runtime
     */
    async loadVue(): Promise<any> {
        if (this.loadedFrameworks.has('vue')) {
            console.log('[FrameworkLoader] Vue already loaded');
            return (window as any).Vue;
        }

        if (this.loadingPromises.has('vue')) {
            return this.loadingPromises.get('vue');
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js';
            script.onload = () => {
                this.loadedFrameworks.add('vue');
                console.log('[FrameworkLoader] Vue 3 loaded successfully');
                resolve((window as any).Vue);
            };
            script.onerror = () => reject(new Error('Failed to load Vue'));
            document.head.appendChild(script);
        });

        this.loadingPromises.set('vue', promise);
        return promise;
    }

    /**
     * Load React 18 runtime
     */
    async loadReact(): Promise<{ React: any; ReactDOM: any }> {
        if (this.loadedFrameworks.has('react')) {
            console.log('[FrameworkLoader] React already loaded');
            return { React: (window as any).React, ReactDOM: (window as any).ReactDOM };
        }

        if (this.loadingPromises.has('react')) {
            return this.loadingPromises.get('react')!;
        }

        const promise = new Promise<{ React: any; ReactDOM: any }>((resolve, reject) => {
            // Load React
            const reactScript = document.createElement('script');
            reactScript.src = 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
            reactScript.crossOrigin = 'anonymous';

            reactScript.onload = () => {
                // Load ReactDOM
                const reactDOMScript = document.createElement('script');
                reactDOMScript.src = 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js';
                reactDOMScript.crossOrigin = 'anonymous';

                reactDOMScript.onload = () => {
                    this.loadedFrameworks.add('react');
                    console.log('[FrameworkLoader] React 18 loaded successfully');
                    resolve({ React: (window as any).React, ReactDOM: (window as any).ReactDOM });
                };

                reactDOMScript.onerror = () => reject(new Error('Failed to load ReactDOM'));
                document.head.appendChild(reactDOMScript);
            };

            reactScript.onerror = () => reject(new Error('Failed to load React'));
            document.head.appendChild(reactScript);
        });

        this.loadingPromises.set('react', promise);
        return promise;
    }

    /**
     * Check if a framework is loaded
     */
    isLoaded(framework: string): boolean {
        return this.loadedFrameworks.has(framework.toLowerCase());
    }

    /**
     * Get all loaded frameworks
     */
    getLoadedFrameworks(): string[] {
        return Array.from(this.loadedFrameworks);
    }
}
