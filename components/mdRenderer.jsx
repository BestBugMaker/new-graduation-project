import MarkdownIt from 'markdown-it'
import 'github-markdown-css'
import { memo, useMemo } from 'react'

const md = new MarkdownIt({
    html: true,
    linkify: true
})

function base64_to_utf8(str) {
    return decodeURIComponent(escape(atob(str)))
}

export default memo(function mdRenderer({ content, isBase64 }) {
    const markdown = isBase64? base64_to_utf8(content): content
    //markdown变化才重新render
    const html = useMemo(() => md.render(markdown), [markdown])

    return (
        <div className="markdown-body">
            <div dangerouslySetInnerHTML={{__html: html}} />
        </div>
    )
})