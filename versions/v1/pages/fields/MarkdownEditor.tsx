import dynamic from "next/dynamic"

import { useAgilityAppSDK } from "@agility/app-sdk"

const MarkdownEditor = dynamic(() => import("../../components/MarkdownEditor"), { ssr: false })

export default function MarkdownEditorPage() {
	const { initializing, field, appInstallContext } = useAgilityAppSDK()
	if (initializing) return <span className="m-2 text-sm">Initializing app...</span>
	return <MarkdownEditor />
}
