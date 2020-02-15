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
    //在src后+?raw=true才能直接访问github图片
    const html = useMemo(() => md.render(markdown).replace(/(\.(jpg|png|gif))/g, '$1' + '?raw=true'), [markdown])
    // html.replace(/(\.(jpg|png|gif))/g, '$1' + '?raw=true')

    return (
        <div className="markdown-body">
            <div dangerouslySetInnerHTML={{__html: html}} />
        </div>
    )
})