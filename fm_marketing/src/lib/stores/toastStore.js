// src/lib/stores/toastStore.js
import { writable } from 'svelte/store';

function createToastStore() {
	const { subscribe, update } = writable([]);

	return {
		subscribe,

		// 토스트 추가
		add: (toast) => {
			const id = Date.now() + Math.random();
			const newToast = {
				id,
				type: 'info',
				duration: 5000,
				closable: true,
				position: 'top-right',
				...toast
			};

			update(toasts => [...toasts, newToast]);

			// 자동 제거
			if (newToast.duration > 0) {
				setTimeout(() => {
					update(toasts => toasts.filter(t => t.id !== id));
				}, newToast.duration);
			}

			return id;
		},

		// 토스트 제거
		remove: (id) => {
			update(toasts => toasts.filter(t => t.id !== id));
		},

		// 모든 토스트 제거
		clear: () => {
			update(() => []);
		},

		// 편의 메서드들
		success: (message, options = {}) => {
			return createToastStore().add({
				type: 'success',
				message,
				...options
			});
		},

		error: (message, options = {}) => {
			return createToastStore().add({
				type: 'error',
				message,
				duration: 0, // 에러는 수동으로 닫기
				...options
			});
		},

		warning: (message, options = {}) => {
			return createToastStore().add({
				type: 'warning',
				message,
				...options
			});
		},

		info: (message, options = {}) => {
			return createToastStore().add({
				type: 'info',
				message,
				...options
			});
		}
	};
}

export const toastStore = createToastStore();

// 전역 토스트 함수들
export const toast = {
	success: (message, options) => toastStore.add({ type: 'success', message, ...options }),
	error: (message, options) => toastStore.add({ type: 'error', message, duration: 0, ...options }),
	warning: (message, options) => toastStore.add({ type: 'warning', message, ...options }),
	info: (message, options) => toastStore.add({ type: 'info', message, ...options })
};
