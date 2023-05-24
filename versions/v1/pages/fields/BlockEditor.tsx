

import { useAgilityAppSDK } from "@agility/app-sdk"
import dynamic from "next/dynamic"

const BlockEditor = dynamic(() => import("../../components/BlockEditor"), { ssr: false })

export default function BlockEditorPage() {

	const { initializing, field, appInstallContext } = useAgilityAppSDK()
	if (initializing) return <span className="m-2 text-sm">Initializing app...</span>
	return <BlockEditor configuration={appInstallContext?.configuration} />

}