export const MAX_IMAGE_SIZE_MB = 10
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

export interface ImageValidationResult {
    valid: boolean
    error?: string
}

/**
 * Validates whether the file size is within the allowed limit (default: 10 MB).
 */
export function validateMediaFile(file: File, maxMB: number = MAX_IMAGE_SIZE_MB): ImageValidationResult {
    const sizeInMB = file.size / (1024 * 1024)
    if (sizeInMB > maxMB) {
        return {
            valid: false,
            error: `File size (${sizeInMB.toFixed(1)} MB) exceeds the ${maxMB} MB limit. Please select a smaller file for a faster experience.`,
        }
    }
    return { valid: true }
}

/**
 * Compresses and resizes an image file in the browser using HTML5 Canvas.
 * - Files up to 10 MB are compressed down to a lightweight JPEG/WebP base64 string (~200-400 KB),
 *   ensuring fast uploads and preventing server 413 "Request entity too large" errors.
 * - Non-image files (e.g. videos) are returned as regular Base64 strings after size validation.
 */
export async function compressMediaFile(
    file: File,
    options: {
        maxDimension?: number
        quality?: number
        maxMB?: number
    } = {}
): Promise<{ base64: string; compressed: boolean; originalMB: number; finalMB: number }> {
    const { maxDimension = 1920, quality = 0.82, maxMB = MAX_IMAGE_SIZE_MB } = options

    // 1. Validate file size first
    const validation = validateMediaFile(file, maxMB)
    if (!validation.valid) {
        throw new Error(validation.error || `File exceeds ${maxMB} MB limit.`)
    }

    const originalMB = file.size / (1024 * 1024)

    // 2. If it is not an image (e.g. video), return as data URL without canvas compression
    if (!file.type.startsWith('image/')) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result as string
                const finalMB = (base64.length * 0.75) / (1024 * 1024)
                resolve({ base64, compressed: false, originalMB, finalMB })
            }
            reader.onerror = () => reject(new Error('Failed to read media file.'))
            reader.readAsDataURL(file)
        })
    }

    // 3. Compress image using HTML5 Canvas
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                let width = img.width
                let height = img.height

                // Resize down if larger than maxDimension while preserving aspect ratio
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round((height * maxDimension) / width)
                        width = maxDimension
                    } else {
                        width = Math.round((width * maxDimension) / height)
                        height = maxDimension
                    }
                }

                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    reject(new Error('Failed to initialize canvas for image compression.'))
                    return
                }

                // Draw background white for transparent PNGs converted to JPEG
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, width, height)
                ctx.drawImage(img, 0, 0, width, height)

                // Compress as JPEG
                const base64 = canvas.toDataURL('image/jpeg', quality)
                const finalMB = (base64.length * 0.75) / (1024 * 1024)

                resolve({
                    base64,
                    compressed: true,
                    originalMB,
                    finalMB,
                })
            }
            img.onerror = () => reject(new Error('Failed to process image file.'))
            img.src = e.target?.result as string
        }
        reader.onerror = () => reject(new Error('Failed to read image file.'))
        reader.readAsDataURL(file)
    })
}

/**
 * Safely parses fetch response from an upload API, throwing clean human-readable errors
 * even if the server returns 413 "Request entity too large" plain-text or HTML.
 */
export async function parseUploadResponse(res: Response): Promise<any> {
    const contentType = res.headers.get('content-type') || ''
    if (!res.ok) {
        let errorMessage = 'Media upload failed on server.'
        try {
            if (contentType.includes('application/json')) {
                const errorJson = await res.json()
                errorMessage = errorJson.message || errorMessage
            } else {
                const text = await res.text()
                if (text && text.toLowerCase().includes('request entity too large')) {
                    errorMessage =
                        'Upload failed: The image file is too large for the server. Please try a smaller file under 10 MB.'
                } else if (text && text.trim().length > 0 && text.length < 200) {
                    errorMessage = text.trim()
                }
            }
        } catch {
            errorMessage = 'Upload failed due to server size limit or network error.'
        }
        throw new Error(errorMessage)
    }

    if (contentType.includes('application/json')) {
        return res.json()
    }
    throw new Error('Server returned an invalid non-JSON response.')
}
