// src/lib/utils/api.js

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = 10000; // 10초

/**
 * API 응답 래퍼 타입
 */
class ApiResponse {
	constructor(data, success = true, message = '', status = 200) {
		this.data = data;
		this.success = success;
		this.message = message;
		this.status = status;
	}
}

/**
 * API 에러 클래스
 */
class ApiError extends Error {
	constructor(message, status = 500, response = null) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.response = response;
	}
}

/**
 * HTTP 요청 유틸리티
 */
class ApiClient {
	constructor(baseURL = API_BASE_URL) {
		this.baseURL = baseURL;
		this.defaultHeaders = {
			'Content-Type': 'application/json',
		};
	}

	/**
	 * 인증 토큰 설정
	 */
	setAuthToken(token) {
		if (token) {
			this.defaultHeaders['Authorization'] = `Bearer ${token}`;
		} else {
			delete this.defaultHeaders['Authorization'];
		}
	}

	/**
	 * 기본 fetch 래퍼
	 */
	async request(endpoint, options = {}) {
		const url = `${this.baseURL}${endpoint}`;
		const config = {
			timeout: API_TIMEOUT,
			headers: {
				...this.defaultHeaders,
				...options.headers
			},
			...options
		};

		try {
			// 타임아웃 처리
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), config.timeout);
			
			const response = await fetch(url, {
				...config,
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			// 응답 처리
			let data;
			const contentType = response.headers.get('content-type');
			
			if (contentType && contentType.includes('application/json')) {
				data = await response.json();
			} else {
				data = await response.text();
			}

			if (!response.ok) {
				throw new ApiError(
					data.message || `HTTP ${response.status}: ${response.statusText}`,
					response.status,
					data
				);
			}

			return new ApiResponse(data, true, '', response.status);

		} catch (error) {
			if (error.name === 'AbortError') {
				throw new ApiError('요청 시간이 초과되었습니다.', 408);
			}
			
			if (error instanceof ApiError) {
				throw error;
			}

			// 네트워크 오류 등
			throw new ApiError(
				error.message || '네트워크 오류가 발생했습니다.',
				0,
				null
			);
		}
	}

	/**
	 * GET 요청
	 */
	async get(endpoint, params = {}) {
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				searchParams.append(key, value.toString());
			}
		});

		const queryString = searchParams.toString();
		const url = queryString ? `${endpoint}?${queryString}` : endpoint;

		return this.request(url, { method: 'GET' });
	}

	/**
	 * POST 요청
	 */
	async post(endpoint, data = {}) {
		return this.request(endpoint, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * PUT 요청
	 */
	async put(endpoint, data = {}) {
		return this.request(endpoint, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	/**
	 * PATCH 요청
	 */
	async patch(endpoint, data = {}) {
		return this.request(endpoint, {
			method: 'PATCH',
			body: JSON.stringify(data)
		});
	}

	/**
	 * DELETE 요청
	 */
	async delete(endpoint) {
		return this.request(endpoint, { method: 'DELETE' });
	}

	/**
	 * 파일 업로드
	 */
	async upload(endpoint, file, additionalData = {}) {
		const formData = new FormData();
		formData.append('file', file);
		
		Object.entries(additionalData).forEach(([key, value]) => {
			formData.append(key, value);
		});

		return this.request(endpoint, {
			method: 'POST',
			body: formData,
			headers: {
				// Content-Type을 설정하지 않음 (FormData가 자동으로 설정)
				...Object.fromEntries(
					Object.entries(this.defaultHeaders).filter(([key]) => 
						key.toLowerCase() !== 'content-type'
					)
				)
			}
		});
	}
}

// 기본 API 클라이언트 인스턴스
export const apiClient = new ApiClient();

/**
 * 인증 관련 API
 */
export const authApi = {
	login: (credentials) => apiClient.post('/auth/login', credentials),
	register: (userData) => apiClient.post('/auth/register', userData),
	logout: () => apiClient.post('/auth/logout'),
	refresh: () => apiClient.post('/auth/refresh'),
	profile: () => apiClient.get('/auth/profile'),
	updateProfile: (data) => apiClient.patch('/auth/profile', data),
	changePassword: (data) => apiClient.patch('/auth/password', data)
};

/**
 * 리뷰/체험단 관련 API
 */
export const reviewApi = {
	getReviews: (params = {}) => apiClient.get('/experiences', params),
	getReview: (id) => apiClient.get(`/experiences/${id}`),
	createReview: (data) => apiClient.post('/experiences', data),
	updateReview: (id, data) => apiClient.put(`/experiences/${id}`, data),
	deleteReview: (id) => apiClient.delete(`/experiences/${id}`),
	likeReview: (id) => apiClient.post(`/experiences/${id}/like`),
	applyReview: (id, data) => apiClient.post(`/experiences/${id}/apply`, data),
	getApplications: (params = {}) => apiClient.get('/experiences/applications', params),
	updateApplication: (id, data) => apiClient.patch(`/experiences/applications/${id}`, data)
};

/**
 * 커뮤니티 관련 API
 */
export const communityApi = {
	getPosts: (params = {}) => apiClient.get('/community/posts', params),
	getPost: (id) => apiClient.get(`/community/posts/${id}`),
	createPost: (data) => apiClient.post('/community/posts', data),
	updatePost: (id, data) => apiClient.put(`/community/posts/${id}`, data),
	deletePost: (id) => apiClient.delete(`/community/posts/${id}`),
	likePost: (id) => apiClient.post(`/community/posts/${id}/like`),
	getComments: (postId) => apiClient.get(`/community/posts/${postId}/comments`),
	createComment: (postId, data) => apiClient.post(`/community/posts/${postId}/comments`, data),
	updateComment: (postId, commentId, data) => apiClient.put(`/community/posts/${postId}/comments/${commentId}`, data),
	deleteComment: (postId, commentId) => apiClient.delete(`/community/posts/${postId}/comments/${commentId}`)
};

/**
 * 이벤트/공지사항 관련 API
 */
export const eventApi = {
	getEvents: (params = {}) => apiClient.get('/events', params),
	getEvent: (id) => apiClient.get(`/events/${id}`),
	getNotices: (params = {}) => apiClient.get('/notices', params),
	getNotice: (id) => apiClient.get(`/notices/${id}`)
};

/**
 * 가이드/FAQ 관련 API
 */
export const guideApi = {
	getGuides: (params = {}) => apiClient.get('/guides', params),
	getGuide: (id) => apiClient.get(`/guides/${id}`),
	getFaqs: (params = {}) => apiClient.get('/faqs', params),
	getFaq: (id) => apiClient.get(`/faqs/${id}`)
};

/**
 * 포인트 관련 API
 */
export const pointApi = {
	getPoints: () => apiClient.get('/points'),
	getPointHistory: (params = {}) => apiClient.get('/points/history', params),
	requestWithdrawal: (data) => apiClient.post('/points/withdrawal', data),
	getWithdrawals: (params = {}) => apiClient.get('/points/withdrawals', params)
};

/**
 * 파일 업로드 관련 API
 */
export const fileApi = {
	uploadImage: (file) => apiClient.upload('/files/images', file),
	uploadDocument: (file) => apiClient.upload('/files/documents', file),
	deleteFile: (id) => apiClient.delete(`/files/${id}`)
};

/**
 * 통계 관련 API
 */
export const statsApi = {
	getDashboard: () => apiClient.get('/stats/dashboard'),
	getReviewStats: (params = {}) => apiClient.get('/stats/reviews', params),
	getUserStats: (userId) => apiClient.get(`/stats/users/${userId}`)
};

/**
 * 에러 핸들링 유틸리티
 */
export const handleApiError = (error) => {
	console.error('API Error:', error);

	if (error instanceof ApiError) {
		switch (error.status) {
			case 401:
				// 인증 오류 - 로그인 페이지로 리다이렉트
				if (typeof window !== 'undefined') {
					window.location.href = '/login';
				}
				return '로그인이 필요합니다.';
			
			case 403:
				return '접근 권한이 없습니다.';
			
			case 404:
				return '요청한 리소스를 찾을 수 없습니다.';
			
			case 408:
				return '요청 시간이 초과되었습니다.';
			
			case 422:
				return '입력 데이터를 확인해주세요.';
			
			case 429:
				return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
			
			case 500:
				return '서버 오류가 발생했습니다.';
			
			default:
				return error.message || '알 수 없는 오류가 발생했습니다.';
		}
	}

	return '네트워크 연결을 확인해주세요.';
};

/**
 * 로컬 스토리지 토큰 관리
 */
export const tokenManager = {
	get: () => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('auth_token');
		}
		return null;
	},
	
	set: (token) => {
		if (typeof window !== 'undefined' && token) {
			localStorage.setItem('auth_token', token);
			apiClient.setAuthToken(token);
		}
	},
	
	remove: () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('auth_token');
			apiClient.setAuthToken(null);
		}
	}
};

// 앱 초기화 시 토큰 설정
if (typeof window !== 'undefined') {
	const token = tokenManager.get();
	if (token) {
		apiClient.setAuthToken(token);
	}
}

export { ApiError, ApiResponse };
