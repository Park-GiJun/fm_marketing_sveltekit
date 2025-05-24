// src/lib/utils/imageProcessor.js
import Jimp from 'jimp';

/**
 * 이미지 처리 유틸리티 클래스
 */
export class ImageProcessor {
    /**
     * 이미지 리사이즈
     * @param {File|Buffer} imageFile - 이미지 파일
     * @param {Object} options - 리사이즈 옵션
     * @param {number} options.width - 너비 (픽셀)
     * @param {number} options.height - 높이 (픽셀)
     * @param {boolean} options.maintainAspectRatio - 비율 유지 여부
     * @param {string} options.format - 출력 포맷 (jpeg, png, webp)
     * @param {number} options.quality - 품질 (1-100, jpeg만 해당)
     * @returns {Promise<{blob: Blob, dataUrl: string, dimensions: Object}>}
     */
    static async resize(imageFile, options = {}) {
        const {
            width = 800,
            height = 600,
            maintainAspectRatio = true,
            format = 'jpeg',
            quality = 85
        } = options;

        try {
            // 파일에서 Jimp 이미지 생성
            const buffer = await this.fileToBuffer(imageFile);
            const image = await Jimp.read(buffer);
            
            // 원본 크기 저장
            const originalDimensions = {
                width: image.getWidth(),
                height: image.getHeight()
            };

            // 리사이즈 처리
            if (maintainAspectRatio) {
                if (width && height) {
                    image.scaleToFit(width, height);
                } else if (width) {
                    image.resize(width, Jimp.AUTO);
                } else if (height) {
                    image.resize(Jimp.AUTO, height);
                }
            } else {
                image.resize(width, height);
            }

            // 포맷에 따른 처리
            let processedImage;
            let mimeType;

            switch (format.toLowerCase()) {
                case 'png':
                    processedImage = await image.getBufferAsync(Jimp.MIME_PNG);
                    mimeType = 'image/png';
                    break;
                case 'webp':
                    // Jimp가 WebP를 지원하지 않는 경우 PNG로 대체
                    processedImage = await image.getBufferAsync(Jimp.MIME_PNG);
                    mimeType = 'image/png';
                    break;
                case 'jpeg':
                default:
                    image.quality(quality);
                    processedImage = await image.getBufferAsync(Jimp.MIME_JPEG);
                    mimeType = 'image/jpeg';
                    break;
            }

            // Blob 생성
            const blob = new Blob([processedImage], { type: mimeType });
            
            // Data URL 생성
            const dataUrl = await this.blobToDataUrl(blob);
            
            // 처리된 이미지 크기
            const newDimensions = {
                width: image.getWidth(),
                height: image.getHeight()
            };

            return {
                blob,
                dataUrl,
                originalDimensions,
                newDimensions,
                size: blob.size,
                format: mimeType
            };

        } catch (error) {
            console.error('이미지 리사이즈 실패:', error);
            throw new Error('이미지 처리 중 오류가 발생했습니다.');
        }
    }

    /**
     * 썸네일 생성
     * @param {File|Buffer} imageFile - 이미지 파일
     * @param {Object} options - 썸네일 옵션
     * @returns {Promise<{blob: Blob, dataUrl: string}>}
     */
    static async createThumbnail(imageFile, options = {}) {
        const {
            size = 150,
            format = 'jpeg',
            quality = 80
        } = options;

        return this.resize(imageFile, {
            width: size,
            height: size,
            maintainAspectRatio: true,
            format,
            quality
        });
    }

    /**
     * 이미지 압축
     * @param {File|Buffer} imageFile - 이미지 파일
     * @param {Object} options - 압축 옵션
     * @returns {Promise<{blob: Blob, dataUrl: string, compressionRatio: number}>}
     */
    static async compress(imageFile, options = {}) {
        const {
            maxWidth = 1920,
            maxHeight = 1080,
            quality = 70,
            format = 'jpeg'
        } = options;

        try {
            const originalSize = imageFile.size || imageFile.length;
            
            const result = await this.resize(imageFile, {
                width: maxWidth,
                height: maxHeight,
                maintainAspectRatio: true,
                format,
                quality
            });

            const compressionRatio = ((originalSize - result.size) / originalSize * 100).toFixed(1);

            return {
                ...result,
                originalSize,
                compressionRatio: parseFloat(compressionRatio)
            };

        } catch (error) {
            console.error('이미지 압축 실패:', error);
            throw new Error('이미지 압축 중 오류가 발생했습니다.');
        }
    }

    /**
     * 이미지 자르기 (크롭)
     * @param {File|Buffer} imageFile - 이미지 파일
     * @param {Object} cropArea - 자르기 영역
     * @param {number} cropArea.x - X 좌표
     * @param {number} cropArea.y - Y 좌표
     * @param {number} cropArea.width - 너비
     * @param {number} cropArea.height - 높이
     * @returns {Promise<{blob: Blob, dataUrl: string}>}
     */
    static async crop(imageFile, cropArea, options = {}) {
        const { format = 'jpeg', quality = 85 } = options;
        const { x, y, width, height } = cropArea;

        try {
            const buffer = await this.fileToBuffer(imageFile);
            const image = await Jimp.read(buffer);

            // 크롭 처리
            image.crop(x, y, width, height);

            // 포맷에 따른 처리
            let processedImage;
            let mimeType;

            if (format.toLowerCase() === 'png') {
                processedImage = await image.getBufferAsync(Jimp.MIME_PNG);
                mimeType = 'image/png';
            } else {
                image.quality(quality);
                processedImage = await image.getBufferAsync(Jimp.MIME_JPEG);
                mimeType = 'image/jpeg';
            }

            const blob = new Blob([processedImage], { type: mimeType });
            const dataUrl = await this.blobToDataUrl(blob);

            return { blob, dataUrl };

        } catch (error) {
            console.error('이미지 크롭 실패:', error);
            throw new Error('이미지 크롭 중 오류가 발생했습니다.');
        }
    }

    /**
     * 이미지 회전
     * @param {File|Buffer} imageFile - 이미지 파일
     * @param {number} degrees - 회전 각도 (90의 배수)
     * @returns {Promise<{blob: Blob, dataUrl: string}>}
     */
    static async rotate(imageFile, degrees, options = {}) {
        const { format = 'jpeg', quality = 85 } = options;

        try {
            const buffer = await this.fileToBuffer(imageFile);
            const image = await Jimp.read(buffer);

            // 회전 처리
            image.rotate(degrees);

            // 포맷에 따른 처리
            let processedImage;
            let mimeType;

            if (format.toLowerCase() === 'png') {
                processedImage = await image.getBufferAsync(Jimp.MIME_PNG);
                mimeType = 'image/png';
            } else {
                image.quality(quality);
                processedImage = await image.getBufferAsync(Jimp.MIME_JPEG);
                mimeType = 'image/jpeg';
            }

            const blob = new Blob([processedImage], { type: mimeType });
            const dataUrl = await this.blobToDataUrl(blob);

            return { blob, dataUrl };

        } catch (error) {
            console.error('이미지 회전 실패:', error);
            throw new Error('이미지 회전 중 오류가 발생했습니다.');
        }
    }

    /**
     * 이미지 필터 적용
     * @param {File|Buffer} imageFile - 이미지 파일
     * @param {string} filterType - 필터 타입
     * @returns {Promise<{blob: Blob, dataUrl: string}>}
     */
    static async applyFilter(imageFile, filterType, options = {}) {
        const { format = 'jpeg', quality = 85 } = options;

        try {
            const buffer = await this.fileToBuffer(imageFile);
            const image = await Jimp.read(buffer);

            // 필터 적용
            switch (filterType) {
                case 'grayscale':
                    image.greyscale();
                    break;
                case 'sepia':
                    image.sepia();
                    break;
                case 'invert':
                    image.invert();
                    break;
                case 'blur':
                    image.blur(3);
                    break;
                case 'brighten':
                    image.brightness(0.3);
                    break;
                case 'darken':
                    image.brightness(-0.3);
                    break;
                case 'contrast':
                    image.contrast(0.3);
                    break;
                default:
                    break;
            }

            // 포맷에 따른 처리
            let processedImage;
            let mimeType;

            if (format.toLowerCase() === 'png') {
                processedImage = await image.getBufferAsync(Jimp.MIME_PNG);
                mimeType = 'image/png';
            } else {
                image.quality(quality);
                processedImage = await image.getBufferAsync(Jimp.MIME_JPEG);
                mimeType = 'image/jpeg';
            }

            const blob = new Blob([processedImage], { type: mimeType });
            const dataUrl = await this.blobToDataUrl(blob);

            return { blob, dataUrl };

        } catch (error) {
            console.error('이미지 필터 적용 실패:', error);
            throw new Error('이미지 필터 적용 중 오류가 발생했습니다.');
        }
    }

    /**
     * 이미지 정보 추출
     * @param {File|Buffer} imageFile - 이미지 파일
     * @returns {Promise<Object>} 이미지 정보
     */
    static async getImageInfo(imageFile) {
        try {
            const buffer = await this.fileToBuffer(imageFile);
            const image = await Jimp.read(buffer);

            return {
                width: image.getWidth(),
                height: image.getHeight(),
                mimeType: image.getMIME(),
                size: buffer.length,
                aspectRatio: (image.getWidth() / image.getHeight()).toFixed(2)
            };

        } catch (error) {
            console.error('이미지 정보 추출 실패:', error);
            throw new Error('이미지 정보를 읽을 수 없습니다.');
        }
    }

    /**
     * 배치 이미지 처리
     * @param {Array<File>} files - 이미지 파일 배열
     * @param {Object} options - 처리 옵션
     * @returns {Promise<Array>} 처리된 이미지 배열
     */
    static async batchProcess(files, options = {}) {
        const {
            operation = 'resize',
            width = 800,
            height = 600,
            quality = 85,
            format = 'jpeg'
        } = options;

        const results = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            try {
                let result;
                
                switch (operation) {
                    case 'resize':
                        result = await this.resize(file, { width, height, format, quality });
                        break;
                    case 'compress':
                        result = await this.compress(file, { quality, format });
                        break;
                    case 'thumbnail':
                        result = await this.createThumbnail(file, { size: width, format, quality });
                        break;
                    default:
                        result = await this.resize(file, { width, height, format, quality });
                        break;
                }

                results.push({
                    ...result,
                    originalFile: file,
                    index: i,
                    success: true
                });

            } catch (error) {
                results.push({
                    originalFile: file,
                    index: i,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * File을 Buffer로 변환
     * @param {File|Buffer} file - 파일 또는 버퍼
     * @returns {Promise<Buffer>}
     */
    static async fileToBuffer(file) {
        if (file instanceof Buffer) {
            return file;
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const buffer = Buffer.from(arrayBuffer);
                resolve(buffer);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Blob을 Data URL로 변환
     * @param {Blob} blob - Blob 객체
     * @returns {Promise<string>} Data URL
     */
    static async blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    /**
     * Data URL을 Blob으로 변환
     * @param {string} dataUrl - Data URL
     * @returns {Blob}
     */
    static dataUrlToBlob(dataUrl) {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new Blob([u8arr], { type: mime });
    }

    /**
     * 파일 크기를 사람이 읽기 쉬운 형태로 변환
     * @param {number} bytes - 바이트 크기
     * @returns {string} 형식화된 크기
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// 기본 이미지 처리 설정
export const DEFAULT_IMAGE_SETTINGS = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 85,
    format: 'jpeg',
    thumbnailSize: 150,
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxFileSize: 10 * 1024 * 1024 // 10MB
};

// 이미지 처리 프리셋
export const IMAGE_PRESETS = {
    thumbnail: {
        width: 150,
        height: 150,
        quality: 80,
        format: 'jpeg'
    },
    small: {
        width: 400,
        height: 300,
        quality: 85,
        format: 'jpeg'
    },
    medium: {
        width: 800,
        height: 600,
        quality: 85,
        format: 'jpeg'
    },
    large: {
        width: 1200,
        height: 900,
        quality: 90,
        format: 'jpeg'
    },
    fullhd: {
        width: 1920,
        height: 1080,
        quality: 90,
        format: 'jpeg'
    }
};
