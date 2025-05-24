// src/lib/utils/imageProcessor.js
import Jimp from 'jimp';

/**
 * 이미지 처리 유틸리티 클래스
 */
export class ImageProcessor {
	constructor() {
		this.supportedFormats = [Jimp.MIME_JPEG, Jimp.MIME_PNG, Jimp.MIME_BMP, Jimp.MIME_GIF];
		this.defaultOptions = {
			quality: 90,
			format: Jimp.MIME_JPEG,
			progressive: true
		};
	}

	/**
	 * 파일을 Jimp 이미지로 로드
	 */
	async loadFromFile(file) {
		try {
			const buffer = await this.fileToBuffer(file);
			const image = await Jimp.read(buffer);
			return image;
		} catch (error) {
			throw new Error(`이미지 로드 실패: ${error.message}`);
		}
	}

	/**
	 * URL에서 이미지 로드
	 */
	async loadFromUrl(url) {
		try {
			const image = await Jimp.read(url);
			return image;
		} catch (error) {
			throw new Error(`이미지 로드 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 리사이징
	 */
	async resizeImage(image, options = {}) {
		const {
			width = Jimp.AUTO,
			height = Jimp.AUTO,
			mode = 'cover', // cover, contain, stretch
			maintainAspectRatio = true
		} = options;

		try {
			let resizedImage = image.clone();

			if (mode === 'cover') {
				resizedImage = resizedImage.cover(width, height);
			} else if (mode === 'contain') {
				resizedImage = resizedImage.contain(width, height);
			} else if (mode === 'stretch') {
				resizedImage = resizedImage.resize(width, height);
			} else {
				// 기본 리사이징 (비율 유지)
				resizedImage = resizedImage.resize(width, height);
			}

			return resizedImage;
		} catch (error) {
			throw new Error(`이미지 리사이징 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 자르기
	 */
	async cropImage(image, x, y, width, height) {
		try {
			return image.clone().crop(x, y, width, height);
		} catch (error) {
			throw new Error(`이미지 자르기 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 회전
	 */
	async rotateImage(image, degrees) {
		try {
			return image.clone().rotate(degrees);
		} catch (error) {
			throw new Error(`이미지 회전 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 플립
	 */
	async flipImage(image, horizontal = false, vertical = false) {
		try {
			let flippedImage = image.clone();
			
			if (horizontal) {
				flippedImage = flippedImage.flip(true, false);
			}
			
			if (vertical) {
				flippedImage = flippedImage.flip(false, true);
			}

			return flippedImage;
		} catch (error) {
			throw new Error(`이미지 플립 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 밝기 조정
	 */
	async adjustBrightness(image, value) {
		try {
			return image.clone().brightness(value);
		} catch (error) {
			throw new Error(`밝기 조정 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 대비 조정
	 */
	async adjustContrast(image, value) {
		try {
			return image.clone().contrast(value);
		} catch (error) {
			throw new Error(`대비 조정 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 블러 효과
	 */
	async blurImage(image, radius = 1) {
		try {
			return image.clone().blur(radius);
		} catch (error) {
			throw new Error(`블러 효과 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 그레이스케일 변환
	 */
	async grayscaleImage(image) {
		try {
			return image.clone().grayscale();
		} catch (error) {
			throw new Error(`그레이스케일 변환 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 세피아 효과
	 */
	async sepiaImage(image) {
		try {
			return image.clone().sepia();
		} catch (error) {
			throw new Error(`세피아 효과 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 색조 조정
	 */
	async adjustHue(image, degrees) {
		try {
			return image.clone().color([{ apply: 'hue', params: [degrees] }]);
		} catch (error) {
			throw new Error(`색조 조정 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 채도 조정
	 */
	async adjustSaturation(image, value) {
		try {
			return image.clone().color([{ apply: 'saturate', params: [value] }]);
		} catch (error) {
			throw new Error(`채도 조정 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 워터마크 추가
	 */
	async addWatermark(image, watermarkImage, options = {}) {
		const {
			position = 'bottom-right',
			opacity = 0.7,
			margin = 20
		} = options;

		try {
			const clonedImage = image.clone();
			const watermark = watermarkImage.clone().opacity(opacity);

			let x, y;
			const imageWidth = clonedImage.getWidth();
			const imageHeight = clonedImage.getHeight();
			const watermarkWidth = watermark.getWidth();
			const watermarkHeight = watermark.getHeight();

			switch (position) {
				case 'top-left':
					x = margin;
					y = margin;
					break;
				case 'top-right':
					x = imageWidth - watermarkWidth - margin;
					y = margin;
					break;
				case 'bottom-left':
					x = margin;
					y = imageHeight - watermarkHeight - margin;
					break;
				case 'bottom-right':
					x = imageWidth - watermarkWidth - margin;
					y = imageHeight - watermarkHeight - margin;
					break;
				case 'center':
					x = (imageWidth - watermarkWidth) / 2;
					y = (imageHeight - watermarkHeight) / 2;
					break;
				default:
					x = imageWidth - watermarkWidth - margin;
					y = imageHeight - watermarkHeight - margin;
			}

			return clonedImage.composite(watermark, x, y);
		} catch (error) {
			throw new Error(`워터마크 추가 실패: ${error.message}`);
		}
	}

	/**
	 * 썸네일 생성
	 */
	async generateThumbnail(image, size = 150) {
		try {
			return image.clone().resize(size, size).quality(80);
		} catch (error) {
			throw new Error(`썸네일 생성 실패: ${error.message}`);
		}
	}

	/**
	 * 다양한 크기의 이미지 생성 (반응형 이미지)
	 */
	async generateResponsiveImages(image, sizes = []) {
		const defaultSizes = [
			{ name: 'small', width: 320 },
			{ name: 'medium', width: 768 },
			{ name: 'large', width: 1200 },
			{ name: 'xlarge', width: 1920 }
		];

		const imageSizes = sizes.length > 0 ? sizes : defaultSizes;
		const results = {};

		try {
			for (const size of imageSizes) {
				const resizedImage = await this.resizeImage(image, {
					width: size.width,
					height: Jimp.AUTO,
					maintainAspectRatio: true
				});

				results[size.name] = resizedImage;
			}

			return results;
		} catch (error) {
			throw new Error(`반응형 이미지 생성 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 최적화
	 */
	async optimizeImage(image, options = {}) {
		const {
			quality = 90,
			format = Jimp.MIME_JPEG,
			maxWidth = 1920,
			maxHeight = 1920
		} = { ...this.defaultOptions, ...options };

		try {
			let optimizedImage = image.clone();

			// 크기 제한
			const currentWidth = optimizedImage.getWidth();
			const currentHeight = optimizedImage.getHeight();

			if (currentWidth > maxWidth || currentHeight > maxHeight) {
				optimizedImage = await this.resizeImage(optimizedImage, {
					width: maxWidth,
					height: maxHeight,
					mode: 'contain'
				});
			}

			// 품질 설정
			optimizedImage = optimizedImage.quality(quality);

			return optimizedImage;
		} catch (error) {
			throw new Error(`이미지 최적화 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지를 Base64로 변환
	 */
	async toBase64(image, format = Jimp.MIME_JPEG) {
		try {
			return await image.getBase64Async(format);
		} catch (error) {
			throw new Error(`Base64 변환 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지를 Buffer로 변환
	 */
	async toBuffer(image, format = Jimp.MIME_JPEG) {
		try {
			return await image.getBufferAsync(format);
		} catch (error) {
			throw new Error(`Buffer 변환 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지를 Blob으로 변환
	 */
	async toBlob(image, format = Jimp.MIME_JPEG) {
		try {
			const buffer = await this.toBuffer(image, format);
			return new Blob([buffer], { type: format });
		} catch (error) {
			throw new Error(`Blob 변환 실패: ${error.message}`);
		}
	}

	/**
	 * 배치 이미지 처리
	 */
	async processBatch(files, operations = []) {
		const results = [];

		try {
			for (const file of files) {
				let processedImage = await this.loadFromFile(file);

				// 각 작업 순차 실행
				for (const operation of operations) {
					switch (operation.type) {
						case 'resize':
							processedImage = await this.resizeImage(processedImage, operation.options);
							break;
						case 'crop':
							processedImage = await this.cropImage(
								processedImage,
								operation.x,
								operation.y,
								operation.width,
								operation.height
							);
							break;
						case 'rotate':
							processedImage = await this.rotateImage(processedImage, operation.degrees);
							break;
						case 'flip':
							processedImage = await this.flipImage(
								processedImage,
								operation.horizontal,
								operation.vertical
							);
							break;
						case 'brightness':
							processedImage = await this.adjustBrightness(processedImage, operation.value);
							break;
						case 'contrast':
							processedImage = await this.adjustContrast(processedImage, operation.value);
							break;
						case 'blur':
							processedImage = await this.blurImage(processedImage, operation.radius);
							break;
						case 'grayscale':
							processedImage = await this.grayscaleImage(processedImage);
							break;
						case 'sepia':
							processedImage = await this.sepiaImage(processedImage);
							break;
						case 'optimize':
							processedImage = await this.optimizeImage(processedImage, operation.options);
							break;
					}
				}

				results.push({
					original: file,
					processed: processedImage,
					originalName: file.name
				});
			}

			return results;
		} catch (error) {
			throw new Error(`배치 처리 실패: ${error.message}`);
		}
	}

	/**
	 * 이미지 정보 조회
	 */
	getImageInfo(image) {
		return {
			width: image.getWidth(),
			height: image.getHeight(),
			channels: image.hasAlpha() ? 4 : 3,
			format: image.getMIME(),
			hasAlpha: image.hasAlpha()
		};
	}

	/**
	 * 파일을 Buffer로 변환하는 헬퍼 함수
	 */
	fileToBuffer(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const arrayBuffer = reader.result;
				const buffer = Buffer.from(arrayBuffer);
				resolve(buffer);
			};
			reader.onerror = () => reject(new Error('파일 읽기 실패'));
			reader.readAsArrayBuffer(file);
		});
	}

	/**
	 * 지원되는 파일 형식 확인
	 */
	isSupportedFormat(file) {
		return this.supportedFormats.includes(file.type);
	}

	/**
	 * 파일 크기 확인 (바이트)
	 */
	isValidFileSize(file, maxSize = 10 * 1024 * 1024) { // 기본 10MB
		return file.size <= maxSize;
	}
}

// 싱글톤 인스턴스 생성
export const imageProcessor = new ImageProcessor();

/**
 * 편의 함수들
 */

// 이미지 리사이징
export async function resizeImage(file, width, height, options = {}) {
	const image = await imageProcessor.loadFromFile(file);
	return await imageProcessor.resizeImage(image, { width, height, ...options });
}

// 썸네일 생성
export async function createThumbnail(file, size = 150) {
	const image = await imageProcessor.loadFromFile(file);
	return await imageProcessor.generateThumbnail(image, size);
}

// 이미지 최적화
export async function optimizeImage(file, options = {}) {
	const image = await imageProcessor.loadFromFile(file);
	return await imageProcessor.optimizeImage(image, options);
}

// 이미지를 Base64로 변환
export async function imageToBase64(file, format = Jimp.MIME_JPEG) {
	const image = await imageProcessor.loadFromFile(file);
	return await imageProcessor.toBase64(image, format);
}

// 반응형 이미지 생성
export async function createResponsiveImages(file, sizes = []) {
	const image = await imageProcessor.loadFromFile(file);
	return await imageProcessor.generateResponsiveImages(image, sizes);
}

// 이미지 정보 조회
export async function getImageInfo(file) {
	const image = await imageProcessor.loadFromFile(file);
	return imageProcessor.getImageInfo(image);
}
