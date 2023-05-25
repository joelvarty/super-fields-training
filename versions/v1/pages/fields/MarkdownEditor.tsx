import dynamic from "next/dynamic"

import { useAgilityAppSDK } from "@agility/app-sdk"

const MarkdownEditor = dynamic(() => import("../../components/MarkdownEditor"), { ssr: false })

export default function MarkdownEditorPage() {
	const { initializing } = useAgilityAppSDK()
	if (initializing) return null
	return <MarkdownEditor />
}
