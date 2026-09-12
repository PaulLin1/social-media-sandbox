import { Form } from "react-router";
import { PostGrid, type Block } from "~/components/PostGrid";

export function Search({ blocks, query }: { blocks: Block[]; query: string }) {
    return (
        <main className="relative px-5 pt-6 pb-24 sm:px-8">
            <div className="max-w-md pb-3 pt-2">
                <h1 className="text-lg text-ink">Search</h1>
                <p className="mt-1 text-sm text-ink-soft">
                    Describe what you're looking for in words. CLIP matches
                    your query against every image in the collection by
                    meaning, not tags.
                </p>
            </div>

            {query && blocks.length === 0 ? (
                <p className="py-10 text-center text-ink-soft">
                    No results for "{query}"
                </p>
            ) : (
                <PostGrid blocks={blocks} />
            )}

            <div className="fixed bottom-4 left-1/2 z-50 w-[min(48rem,calc(100vw-2rem))] -translate-x-1/2">
                <Form
                    method="get"
                    className="flex items-center gap-3 border-2 border-ink bg-paper p-3"
                >
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="Search…"
                        className="flex-1 bg-transparent text-lg text-ink placeholder:text-ink-soft focus:outline-none"
                    />

                    <button
                        type="submit"
                        className="flex h-10 w-10 shrink-0 items-center justify-center text-lg text-ink transition-colors hover:text-link"
                    >
                        ⌕
                    </button>
                </Form>
            </div>
        </main>
    );
}
