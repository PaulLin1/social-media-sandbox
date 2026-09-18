import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Nav } from "./components/Nav";
import "./app.css";

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="theme-color" content="#ffffff" />
                <Meta />
                <Links />
            </head>
            <body>
                <Nav />
                <div className="pb-16 sm:pb-0 sm:pl-60">{children}</div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="container mx-auto p-6 pb-16 text-ink">
            <h1 className="text-2xl font-semibold">{message}</h1>
            <p className="mt-2 text-ink-soft">{details}</p>
            {stack && (
                <pre className="mt-4 w-full overflow-x-auto border border-rule p-4 text-sm">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
