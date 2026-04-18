/// <reference types="vite/client" />

declare module '*.md' {
    const data: Record<string, unknown>;
    export default data;
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}
