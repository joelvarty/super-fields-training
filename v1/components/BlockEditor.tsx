import React, { useState, useEffect, useRef, useMemo } from "react"
import { contentItemMethods, useAgilityAppSDK, setHeight, getManagementAPIToken } from "@agility/app-sdk"
import useOnScreen from "../hooks/useOnScreen"

import EditorJS from "@editorjs/editorjs"
import Embed from "@editorjs/embed"
import Table from "@editorjs/table"
import Paragraph from "@editorjs/paragraph"
import Warning from "@editorjs/warning"
import Code from "@editorjs/code"
import Image from "@editorjs/image"
import Raw from "@editorjs/raw"
import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import Delimiter from "@editorjs/delimiter"
import InlineCode from "@editorjs/inline-code"
import NestedList from "@editorjs/nested-list"
import DragDrop from "editorjs-drag-drop"

const BlockEditor = ({ configuration }: { configuration: any }) => {
	const {  initializing, field, instance, contentItem, fieldValue } = useAgilityAppSDK()
	const containerRef = useRef<HTMLIFrameElement>(null)
	const blockRef = useRef<HTMLIFrameElement>(null)
	const savedValue = useRef<string | null>(null)

	const isVisible = useOnScreen(containerRef)

	const [token, setToken] = useState()

	const editor = useRef<EditorJS | null>(null)

	// Get the ManagementAPIToken
	useEffect(() => {
		;(async () => {
			const token = await getManagementAPIToken()
			setToken(token)
		})()
	}, [])

	useEffect(() => {

		//handle changes to the field value from outside the editor

		if (!editor.current) return
		if (savedValue.current === null) return

		const str = savedValue.current


		if (fieldValue !== savedValue.current) {

			if (!fieldValue) {
				editor.current.clear()
			} else {
				const blocks = JSON.parse(fieldValue)
				if (blocks) {
					editor.current.render(blocks)
				}
			}
		}
	}, [fieldValue, editor])

	const initEditor = () => {
		if (fieldValue && editor.current) {
			const blocks = JSON.parse(fieldValue)
			if (blocks) {
				editor.current.render(blocks)
			}
		}
	}


	useEffect(() => {
		if (!blockRef.current || !token || initializing) return

		if (editor.current) return

		const uploadImagePayload = {
			guid: instance?.guid,
			token,
			assetFolder: configuration.assetFolder ?? "/images/block-editor"
		}

		const editorJS = new EditorJS({
			autofocus: false, //setting this to true will not do anything because this is in an iframe
			holder: blockRef.current,
			placeholder: "📝 Enter text, paste images/embed urls, or select a block to add here...",

			tools: {
				table: Table,
				paragraph: {
					class: Paragraph,
					inlineToolbar: true
				},
				list: {
					class: NestedList,
					inlineToolbar: true
				},
				warning: Warning,
				code: Code,
				image: {
					class: Image,
					config: {
						endpoints: {
							byFile: "/api/image/uploadByFile",
							byUrl: "/api/image/fetchByUrl"
						},
						additionalRequestData: { ...uploadImagePayload }
					}
				},
				raw: Raw,
				header: Header,
				quote: Quote,
				marker: Marker,
				delimiter: Delimiter,
				inlineCode: InlineCode,
				embed: Embed
			},
			onChange: (e: any) => {
				editorJS.save().then((v: any) => {
					const valueJSON = JSON.stringify(v)
					if (valueJSON !== fieldValue) {
						savedValue.current = valueJSON
						contentItemMethods.setFieldValue({ value: valueJSON })
					}
				})
			},
			onReady: () => {

				const blockSizeElm = document.querySelector<HTMLElement>("#container-element")
				if (blockSizeElm) {
					const observer = new ResizeObserver((entries) => {
						const entry = entries[0]
						if (!entry) return
						let height = entry.contentRect.height + 50
						if (height < 400) height = 400

						setHeight({ height })
					})
					observer.observe(blockSizeElm)
				}

				new DragDrop(editorJS)

				initEditor()
			}
		})

		editor.current = editorJS
	}, [blockRef, initializing, token])

	return (
		<div className="bg-white py-2 px-20" ref={containerRef} id="container-element">
			<div className="min-h-[400px] prose" id="editor-elem" ref={blockRef}></div>
		</div>
	)
}

export default BlockEditor
