
import FriendlyURLField from "@/components/FriendlySlugField"
import { useAgilityAppSDK } from "@agility/app-sdk"

export default function FriendlyURLPage() {
	const { initializing, field, appInstallContext } = useAgilityAppSDK()
	if (initializing) return <span className="m-2 text-sm">Initializing app...</span>
	return <FriendlyURLField />
}