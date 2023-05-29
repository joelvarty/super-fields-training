import { useAgilityAppSDK } from "@agility/app-sdk"
import dynamic from 'next/dynamic'
import FriendlyURLField from '../components/FriendlySlugField'

const BlockEditor = dynamic(
  () => import('../components/BlockEditor'),
  { ssr: false }
)

const MarkdownEditor = dynamic(
  () => import('../components/MarkdownEditor'),
  { ssr: false }
)


export default function App() {
  const { initializing, field, appInstallContext } = useAgilityAppSDK()

  const RenderEditor = () => {
    switch(field?.typeName) {
      case "BlockEditor":
        return <BlockEditor configuration={appInstallContext?.configuration} />
      case "Markdown":
        return <MarkdownEditor />
      case "FriendlyURL":
        return <FriendlyURLField />
      default:
        break;
    }
  }

  return (
    initializing && !field ?
    <span className="m-2 text-sm">Initializing app...</span> :
    RenderEditor()
  )
}
