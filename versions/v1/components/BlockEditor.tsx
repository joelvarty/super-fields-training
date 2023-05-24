import React, { useState, useEffect, useRef, useMemo } from "react"
import { contentItemMethods, useAgilityAppSDK, setHeight } from "@agility/app-sdk"
import useOnScreen from "../hooks/useOnScreen"

import EditorJS from '@editorjs/editorjs'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import NestedList from '@editorjs/nested-list'
import DragDrop from 'editorjs-drag-drop'
//import Undo from 'editorjs-undo' //this has bugs...
//import LinkAutocomplete from '@editorjs/link-autocomplete' //enable this to support link autocompletes (requires env-vars)

const BlockEditor = ({ configuration }: { configuration: any }) => {
    const { field, instance, contentItem } = useAgilityAppSDK()
    const containerRef = useRef<HTMLIFrameElement>()
    const blockRef = useRef<HTMLIFrameElement>()
    const [editor, setEditor] = useState({})
    const isVisible = useOnScreen(containerRef)
    const blockValues = useMemo(() => contentItem?.values?.BlockEditorApp, [contentItem?.values?.BlockEditorApp])	

		useEffect(() => {
			if (!isVisible || !field) return

			//if running locally after a hot-module replacement, don't reinitialize everything...
			if (editor && Object.keys(editor).length > 0) return;

			const uploadImagePayload = {
					websiteName: instance?.websiteName,
					securityKey: configuration.securityKey,
					location: configuration.dcLocation,
					assetFolder: configuration.assetFolder ? configuration.assetFolder : ''
			};

			const valueJS = typeof blockValues === 'string' ? JSON.parse(blockValues) : null;

			const editorJS = new EditorJS({
				autofocus: false, //setting this to true will not do anything because this is in an iframe
				holder: blockRef.current,
				placeholder: "📝 Enter text, paste images/embed urls, or select a block to add here...",
				tools: {
					table: Table,
					paragraph: {
							class: Paragraph,
							inlineToolbar: true,
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
											byFile: '/api/image/uploadByFile',
											byUrl: '/api/image/fetchByUrl'
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
							contentItemMethods.setFieldValue({ value: valueJSON })
					})

				},
				onReady: () => {
					const blockSizeElm = document.querySelector<HTMLElement>(".codex-editor")
					if (blockSizeElm) {
						const observer = new ResizeObserver((entries) => {
							const entry = entries[0]
							if (!entry) return
							setHeight({ height: entry.contentRect.height + 30 })
						})
						observer.observe(blockSizeElm)
					}

					new DragDrop(editorJS);

					if (valueJS && valueJS.blocks && valueJS.blocks.length > 0) {
							editorJS.render(valueJS);
					}
				}
			});

			setEditor(editorJS);

    }, [isVisible, field, editor])

    return (
			<div className="bg-white" ref={containerRef}>
				<div ref={blockRef} className="border-[0.1px] border-radius rounded border-solid border-gray-300 px-1 py-2 mb-1 "></div>
			</div>
    );

}

export default BlockEditor