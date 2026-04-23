/// <reference types="vite/client" />

declare module 'canvasparticles-js' {
    interface ParticlesOptions {
        background?: string;
        particles?: {
            color?: string;
            ppm?: number;
            connectDistance?: number;
            max?: number;
        };
        mouse?: {
            interactionType?: number;
        };
        animation?: {
            startOnEnter?: boolean;
            stopOnLeave?: boolean;
        };
        gravity?: Record<string, unknown>;
    }
    export default class CanvasParticles {
        constructor(selector: string | HTMLElement, options?: ParticlesOptions);
        start(): this;
        stop(options?: { clear?: boolean }): this;
        destroy(): void;
        setBackground(color: string): void;
        setParticleColor(color: string): void;
    }
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}
