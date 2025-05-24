// src/lib/utils/imageProcessor.js

/**
 * 브라우저 환경에서의 기본 이미지 처리 유틸리티
 * Jimp는 Node.js 환경에서만 동작하므로 브라우저용 대안 제공
 */

export class ImageProcessor {
	constructor() {
		this.canvas = null;
		this.ctx = null;
	}

	/**
	 * 파일을 Image 객체로 로드
	 */
	async loadFromFile(file) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const url = URL.createObjectURL(file);
			
			img.onload = () => {
				URL.revokeObjectURL(url);
				resolve(img);
			};
			
			img.onerror = () => {
				URL.revokeObjectURL(url);
				reject(new Error('이미지 로드 실패'));
			};
			
			img.src = url;
		});
	}

	/**
	 * 캔버스 초기화
	 */
	initCanvas(width, height) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext('2d');
		return this.canvas;
	}

	/**
	 * 이미지 리사이징
	 */
	async resizeImage(imageFile, options = {}) {
		const {
			width = 800,
			height = 600,
			maintainAspectRatio = true,
			quality = 0.9
		} = options;

		try {
			const img = await this.loadFromFile(imageFile);
			
			let newWidth = width;
			let newHeight = height;

			if (maintainAspectRatio) {
				const aspectRatio = img.width / img.height;
				
				if (width && height) {
					if (aspectRatio > width / height) {
						newHeight = width / aspectRatio;
					} else {
						newWidth = height * aspectRatio;
					}
				} else if (width) {
					newHeight = width / aspectRatio;
				} else if (height) {
					newWidth = height * aspectRatio;
				}
			}

			const canvas = this.initCanvas(newWidth, newHeight);
			this.ctx.drawImage(img, 0, 0, newWidth, newHeight);

			return {
				canvas,
				width: newWidth,
				height: newHeight
			};
		} catch (error) {
			throw new Error(`이미지 리사이징 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지를 Base64로 변환
	 */
	async toBase64(canvas, format = 'image/jpeg', quality = 0.9) {
		return canvas.toDataURL(format, quality);
	}

	/**
	 * 이미지를 Blob으로 변환
	 */
	async toBlob(canvas, format = 'image/jpeg', quality = 0.9) {
		return new Promise(resolve => {
			canvas.toBlob(resolve, format, quality);
		});
	}

	/**
	 * 이미지 정보 조회
	 */
	async getImageInfo(imageFile) {
		const img = await this.loadFromFile(imageFile);
		
		return {
			width: img.width,
			height: img.height,
			aspectRatio: img.width / img.height,
			size: imageFile.size,
			type: imageFile.type
		};
	}

	/**
	 * 썸네일 생성
	 */
	async generateThumbnail(imageFile, size = 150) {
		const result = await this.resizeImage(imageFile, {
			width: size,
			height: size,
			maintainAspectRatio: true
		});

		return result;
	}

	/**
	 * 이미지 최적화
	 */
	async optimizeImage(imageFile, options = {}) {
		const {
			maxWidth = 1920,
			maxHeight = 1080,
			quality = 0.8
		} = options;

		const img = await this.loadFromFile(imageFile);
		
		let targetWidth = img.width;
		let targetHeight = img.height;

		// 최대 크기 제한
		if (img.width > maxWidth || img.height > maxHeight) {
			const aspectRatio = img.width / img.height;
			
			if (aspectRatio > maxWidth / maxHeight) {
				targetWidth = maxWidth;
				targetHeight = maxWidth / aspectRatio;
			} else {
				targetHeight = maxHeight;
				targetWidth = maxHeight * aspectRatio;
			}
		}

		return await this.resizeImage(imageFile, {
			width: targetWidth,
			height: targetHeight,
			maintainAspectRatio: true,
			quality
		});
	}

	/**
	 * 파일 형식 지원 확인
	 */
	isSupportedFormat(file) {
		const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		return supportedTypes.includes(file.type);
	}

	/**
	 * 파일 크기 유효성 검사
	 */
	isValidFileSize(file, maxSize = 10 * 1024 * 1024) {
		return file.size <= maxSize;
	}
}

// 싱글톤 인스턴스
export const imageProcessor = new ImageProcessor();

// 편의 함수들
export async function resizeImage(file, width, height, options = {}) {
	return await imageProcessor.resizeImage(file, { width, height, ...options });
}

export async function createThumbnail(file, size = 150) {
	return await imageProcessor.generateThumbnail(file, size);
}

export async function optimizeImage(file, options = {}) {
	return await imageProcessor.optimizeImage(file, options);
}

export async function getImageInfo(file) {
	return await imageProcessor.getImageInfo(file);
}
