import { useAgilityAppSDK, contentItemMethods, setHeight } from "@agility/app-sdk";
import { TextInput, Button } from "@agility/plenum-ui";
import { useEffect, useState } from "react"

const makeFriendlyStr = (s: string): string => {
    if (!s) return ""
    let friendly = s.toLowerCase();
    friendly = friendly
        .replace(new RegExp("\\s", 'g'), "-")
        .replace(new RegExp("[àáâãäå]", 'g'), "a")
        .replace(new RegExp("æ", 'g'), "ae")
        .replace(new RegExp("ç", 'g'), "c")
        .replace(new RegExp("[èéêë]", 'g'), "e")
        .replace(new RegExp("[ìíîï]", 'g'), "i")
        .replace(new RegExp("ñ", 'g'), "n")
        .replace(new RegExp("[òóôõö]", 'g'), "o")
        .replace(new RegExp("œ", 'g'), "oe")
        .replace(new RegExp("[ùúûü]", 'g'), "u")
        .replace(new RegExp("[ýÿ]", 'g'), "y")
        .replace(new RegExp("[^\\w\\-@-]", 'g'), "-")
        .replace(new RegExp("--+", 'g'), "-")


    if (friendly.lastIndexOf("-") > 0 && friendly.lastIndexOf("-") == friendly.length - 1) {
      friendly = friendly.substring(0, friendly.length - 1);
    }
    return friendly
  
}

const FriendlyURLField = () => {
  const { contentItem } = useAgilityAppSDK()
  const [slug, setSlug] = useState<string>("")
  const [currentTitle, setCurrentTitle] = useState<string>("")

  const regenerateSlug = async (title: string) => {
    const newVal = makeFriendlyStr(title)
    contentItemMethods.setFieldValue({ value: newVal })
    setSlug(newVal)
  }

  useEffect(() => { 
    const isNewContentItem = Boolean(contentItem && contentItem?.contentID < 0)

    setSlug(() => {
      return isNewContentItem ? contentItem?.values.Title : contentItem?.values.Slug
    })

    contentItemMethods.addFieldListener({ 
      fieldName: 'Title', 
      onChange: (t) => {
        if (isNewContentItem) regenerateSlug(t)
        setCurrentTitle(t)
      } 
    })
  }, [contentItem])

  useEffect(() => {
    setHeight({ height: 50 })
  }, [])

  return (
    <div className="flex flex-row justify-between items-center gap-2">
      <div className="w-full">
        <TextInput type="text" value={slug} placeholder="" />
      </div>
      {!Boolean(contentItem && contentItem?.contentID < 0) ? 
        <Button
        className="w-[105px] h-[38px]"
        label={"Regenerate Slug"}
        size="sm"
        type="primary"
        onClick={() => regenerateSlug(currentTitle)}
        /> : 
      null}
    </div>
  )
}

export default FriendlyURLField