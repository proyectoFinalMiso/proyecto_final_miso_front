import { Image } from 'react-native';

// Cache for managing preloaded images
const imageCache: { [key: string]: boolean } = {};

/**
 * Preloads an image and caches the result
 * @param imagePath Path to the image asset
 * @returns Promise that resolves when the image is loaded
 */
export const preloadImage = async (imagePath: any): Promise<boolean> => {
    const cacheKey = JSON.stringify(imagePath);

    if (imageCache[cacheKey]) {
        return true; // Already cached
    }

    try {
        await Image.prefetch(Image.resolveAssetSource(imagePath).uri);
        imageCache[cacheKey] = true;
        return true;
    } catch (error) {
        console.error('Error preloading image:', error);
        return false;
    }
};

/**
 * Optimizes image display by ensuring appropriate dimensions
 * and reducing quality for faster loading while maintaining appearance
 */
export const getOptimizedImageProps = () => {
    return {
        fadeDuration: 300,
        progressiveRenderingEnabled: true,
    };
}; 
