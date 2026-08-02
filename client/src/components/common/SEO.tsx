import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export interface SEOProps {
    title?: string
    description?: string
    keywords?: string
    image?: string
    url?: string
    type?: string
    schema?: Record<string, unknown> | Array<Record<string, unknown>>
}

const DEFAULT_TITLE = 'Trendy Decor Gidderbaha | Event Decor, Gift Hampers & Customized Chocolates'
const DEFAULT_DESCRIPTION =
    'Trendy Decor in Gidderbaha, Punjab — managed by Harish Ahuja & Hitin Ahuja. Specializing in customized gift hampers, chocolates, bouquets, designer rakhis, baby welcome decor, and milestone event styling across Gidderbaha, Bathinda & Malout.'
const DEFAULT_KEYWORDS =
    'trendy decor, gidderbaha, harish ahuja, hitin ahuja, gift hampers, customized chocolates, bouquets, designer rakhis, event decor, baby welcome setups, bathinda, malout, punjab'
const DEFAULT_IMAGE = 'https://trendydecor24.shop/hero-assets/hero1.png'
const DEFAULT_URL = 'https://trendydecor24.shop'


const updateMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
    let element = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement
    if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attributeName, attributeValue)
        document.head.appendChild(element)
    }
    element.setAttribute('content', content)
}


const updateCanonicalLink = (href: string) => {
    let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', 'canonical')
        document.head.appendChild(element)
    }
    element.setAttribute('href', href)
}

const SEO = ({
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = DEFAULT_KEYWORDS,
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    schema,
}: SEOProps) => {
    const location = useLocation()

    useEffect(() => {

        const finalTitle = title ? `${title} | Trendy Decor` : DEFAULT_TITLE
        document.title = finalTitle


        updateMetaTag('name', 'description', description)
        updateMetaTag('name', 'keywords', keywords)
        updateMetaTag('name', 'author', 'Trendy Decor Studio')
        updateMetaTag('name', 'robots', 'index, follow')

        const currentUrl = url || `${DEFAULT_URL}${location.pathname}`

        updateMetaTag('property', 'og:title', finalTitle)
        updateMetaTag('property', 'og:description', description)
        updateMetaTag('property', 'og:image', image)
        updateMetaTag('property', 'og:url', currentUrl)
        updateMetaTag('property', 'og:type', type)
        updateMetaTag('property', 'og:site_name', 'Trendy Decor')
        updateMetaTag('property', 'og:locale', 'en_US')

        updateMetaTag('name', 'twitter:card', 'summary_large_image')
        updateMetaTag('name', 'twitter:title', finalTitle)
        updateMetaTag('name', 'twitter:description', description)
        updateMetaTag('name', 'twitter:image', image)

        updateCanonicalLink(currentUrl)

        let scriptElement: HTMLScriptElement | null = null
        if (schema) {
            scriptElement = document.getElementById('page-jsonld-schema') as HTMLScriptElement
            if (!scriptElement) {
                scriptElement = document.createElement('script')
                scriptElement.id = 'page-jsonld-schema'
                scriptElement.type = 'application/ld+json'
                document.head.appendChild(scriptElement)
            }
            scriptElement.textContent = JSON.stringify(schema, null, 2)
        }

        return () => {
            if (scriptElement && scriptElement.parentNode) {
                scriptElement.parentNode.removeChild(scriptElement)
            }
        }
    }, [title, description, keywords, image, url, type, schema, location.pathname])

    return null
}

export default SEO
