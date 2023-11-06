import FriendlyURLField from "@/components/FriendlySlugField"
import { useAgilityAppSDK } from "@agility/app-sdk"

export default function FriendlyURLPage() {
	const { initializing } = useAgilityAppSDK()
	if (initializing) return null

	return <FriendlyURLField />
}
