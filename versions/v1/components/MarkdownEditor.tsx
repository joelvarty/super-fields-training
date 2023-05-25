import { useAgilityAppSDK, contentItemMethods, setHeight } from "@agility/app-sdk"
import React, { useState, useEffect, useRef, useMemo } from "react"
import useOnScreen from "../hooks/useOnScreen"
import SimpleMDE from "react-simplemde-editor"

const MarkdownEditor = () => {
	const { contentItem, field } = useAgilityAppSDK()
	const containerRef = useRef<HTMLIFrameElement | null>(null)
	const isVisible = useOnScreen(containerRef)
	const markdownValues = useMemo(() => {
		if (!contentItem?.values || !field) return ""
		const str = contentItem?.values[field.name] || ""
		return str
	}, [contentItem?.values, field])
	const [markdownHeight, setMarkdownHeight] = useState(500)

	const onChange = (value: string) => {
		contentItemMethods.setFieldValue({ value })
	}

	// listen for simple-mde resizing events
	useEffect(() => {
		const mdeSizeElm = document.querySelector<HTMLElement>(".CodeMirror-sizer")
		if (!isVisible || !mdeSizeElm) return
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0]
			if (!entry) return
			setMarkdownHeight(entry.contentRect.height)
		})
		observer.observe(mdeSizeElm)

		return () => observer.disconnect()
	}, [isVisible])

	// when the markdown height of the simple-mde changes, then adjust the height of iframe
	// and offset the height by 200 so the element can scroll all the way back up
	useEffect(() => {
		// min height for the editor is 400
		const height = markdownHeight < 400 ? 400 : markdownHeight + 100

		setHeight({ height })
	}, [markdownHeight])

	return (
		<div ref={containerRef} className="bg-white min-h-[400px]">
			<SimpleMDE id="simple-mde" value={markdownValues} onChange={onChange} />
		</div>
	)
}

export default MarkdownEditor
