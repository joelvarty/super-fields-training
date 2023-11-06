import { useAgilityAppSDK, contentItemMethods, setHeight, openAlertModal, useResizeHeight } from "@agility/app-sdk"
import { TextInput, Button, TextInputAddon } from "@agility/plenum-ui"
import { IconName } from "@agility/plenum-ui/lib/util/DynamicIcons"
import { useEffect, useRef, useState } from "react"

const makeFriendlyStr = (s: string): string => {
	if (!s) return ""
	let friendly = s.toLowerCase()
	friendly = friendly
		.replace(new RegExp("\\s", "g"), "-")
		.replace(new RegExp("[àáâãäå]", "g"), "a")
		.replace(new RegExp("æ", "g"), "ae")
		.replace(new RegExp("ç", "g"), "c")
		.replace(new RegExp("[èéêë]", "g"), "e")
		.replace(new RegExp("[ìíîï]", "g"), "i")
		.replace(new RegExp("ñ", "g"), "n")
		.replace(new RegExp("[òóôõö]", "g"), "o")
		.replace(new RegExp("œ", "g"), "oe")
		.replace(new RegExp("[ùúûü]", "g"), "u")
		.replace(new RegExp("[ýÿ]", "g"), "y")
		.replace(new RegExp("[^\\w\\-@-]", "g"), "-")
		.replace(new RegExp("--+", "g"), "-")

	if (friendly.lastIndexOf("-") > 0 && friendly.lastIndexOf("-") == friendly.length - 1) {
		friendly = friendly.substring(0, friendly.length - 1)
	}
	return friendly
}

const FriendlyURLField = () => {
	const { contentItem, field, fieldValue } = useAgilityAppSDK()

	const [currentTitle, setCurrentTitle] = useState<string>("")

	const regenerateSlug = async (title: string) => {
		const newVal = makeFriendlyStr(title)
		contentItemMethods.setFieldValue({ name: field?.name, value: newVal })
	}

	useEffect(() => {
		//listen for changes to the title field
		contentItemMethods.addFieldListener({
			fieldName: "Title",
			onChange: (t) => {
				setCurrentTitle(t)

				contentItemMethods?.getContentItem()?.then((ci) => {
					//only regenerate the slug if the content item is new
					const isNewContentItem = Boolean((ci?.contentID ?? -1) < 0)
					if (isNewContentItem) {
						regenerateSlug(t)
					}
				})
			}
		})
	}, [])

	const containerRef = useRef<HTMLDivElement>(null)
	useResizeHeight({ ref: containerRef })

	const hasBeenSaved = !!!(contentItem && contentItem?.contentID < 0)

	return (
		<div className="flex flex-row items-center justify-between gap-1" ref={containerRef}>
			<div className="w-full p-1 ">
				<textarea
					value={fieldValue}
					onChange={(e) => {
						contentItemMethods.setFieldValue({ name: field?.name, value: e.target.value })
					}}
				/>
				{/* <TextInputAddon
					type="text"
					value={fieldValue}
					trailIcon={hasBeenSaved ? "RefreshIcon" : undefined}
					trailLabel={hasBeenSaved ? "Re-Generate Slug" : undefined}
					onChange={(str) => {
						regenerateSlug(str)
					}}
					onCtaClick={() => {
						openAlertModal({
							title: "Re-Generate Slug",
							iconColor: "blue",
							message:
								"By changing the URL you could create broken links. We recommend you add in a URL redirection from the old URL to the new URL. Are you sure you wish to continue?",
							okButtonText: "Re-Generate",
							cancelButtonText: "Cancel",
							iconName: "QuestionMarkCircleIcon",
							callback: (ok: boolean) => {
								if (!ok) return
								regenerateSlug(currentTitle)
							}
						})
					}}
				/> */}
			</div>
		</div>
	)
}

export default FriendlyURLField
