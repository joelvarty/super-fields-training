import { useAgilityAppSDK, contentItemMethods, setHeight } from "@agility/app-sdk"
import React, { useState, useEffect, useRef, useMemo } from "react"
import useOnScreen from "../hooks/useOnScreen"
import SimpleMDE from "react-simplemde-editor";

const MarkdownEditor = () => {
  const { contentItem } = useAgilityAppSDK()
  const containerRef = useRef<HTMLIFrameElement | null>(null)
  const isVisible = useOnScreen(containerRef)
  const markdownValues = useMemo(() => contentItem?.values?.MarkdownField, [contentItem?.values?.MarkdownField])
  const [markdownHeight, setMarkdownHeight] = useState(500)

  const onChange = (newValue: any) => {
    const valueJSON = JSON.stringify(newValue)
		contentItemMethods.setFieldValue({ value: valueJSON })
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
    // min height for the editor is 500
    const height  = markdownHeight < 500 ? 500 : markdownHeight + 200
    setHeight({ height })
  }, [ markdownHeight ])

  return (
    <div ref={containerRef} className=" bg-white">
      <SimpleMDE id="simple-mde" value={markdownValues} onChange={onChange} />
    </div>
  );

}


export default MarkdownEditor