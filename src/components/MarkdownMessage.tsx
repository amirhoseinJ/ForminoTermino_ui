// MarkdownMessage.tsx
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSanitize from "rehype-sanitize";
import rehypeExternalLinks from "rehype-external-links";

type Props = {
    content: string;
    /** If true, invert colors so markdown looks good on your purple user bubble */
    isUser?: boolean;
};

// Extend the normal <code> props with the extra `inline` flag that react-markdown adds
type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
    inline?: boolean;
};

const Code = ({ inline, className, children, ...props }: CodeProps) => {
    if (!inline) {
        // Fenced code block
        return (
            <pre className="overflow-x-auto rounded-lg p-3 text-xs bg-black/80 text-white">
        <code className={className} {...props}>
          {String(children).replace(/\n$/, "")}
        </code>
      </pre>
        );
    }
    // Inline `code`
    return (
        <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10" {...props}>
            {children}
        </code>
    );
};

const components: Components = {
    // Cast because the public type for `code` doesn't include the `inline` prop,
    // even though react-markdown passes it at runtime.
    code: Code as unknown as Components["code"],
    a({ children, ...props }) {
        return (
            <a className="underline hover:opacity-80" {...props}>
                {children}
            </a>
        );
    },
    img(props) {
        return <img loading="lazy" className="rounded-lg max-w-full h-auto" {...props} />;
    },
};

export default function MarkdownMessage({ content, isUser = false }: Props) {
    return (
        <div
            className={[
                "prose prose-sm max-w-none",
                "prose-headings:mt-0 prose-headings:mb-2",
                "prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-pre:my-3",
                "prose-code:before:hidden prose-code:after:hidden",
                isUser ? "prose-invert prose-a:text-white" : "",
            ].join(" ")}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[
                    rehypeSanitize,
                    [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer", "nofollow"] }],
                ]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
