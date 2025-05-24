<!-- src/lib/components/user/LoginForm.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import Button from '../common/Button.svelte';

	const dispatch = createEventDispatcher();

	// 폼 데이터
	let formData = {
		username: '',
		password: '',
		rememberMe: false
	};

	// 상태
	let loading = false;
	let errors = {};

	// 로그인 처리
	async function handleLogin() {
		errors = {};

		// 유효성 검사
		if (!formData.username.trim()) {
			errors.username = '아이디를 입력해주세요.';
		}

		if (!formData.password.trim()) {
			errors.password = '비밀번호를 입력해주세요.';
		}

		if (Object.keys(errors).length > 0) {
			return;
		}

		loading = true;

		try {
			// 상위 컴포넌트로 로그인 데이터 전달
			dispatch('login', {
				username: formData.username,
				password: formData.password,
				rememberMe: formData.rememberMe
			});
		} catch (error) {
			errors.general = '로그인에 실패했습니다.';
		} finally {
			loading = false;
		}
	}

	// 엔터키 처리
	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			handleLogin();
		}
	}

	// 외부에서 에러 설정
	export function setError(message) {
		errors.general = message;
		loading = false;
	}

	// 외부에서 로딩 상태 설정
	export function setLoading(state) {
		loading = state;
	}
</script>

<form class="login-form" on:submit|preventDefault={handleLogin}>
	{#if errors.general}
		<div class="error-message">
			{errors.general}
		</div>
	{/if}

	<div class="form-group">
		<label for="username">아이디</label>
		<input 
			type="text" 
			id="username" 
			bind:value={formData.username}
			placeholder="아이디를 입력하세요"
			disabled={loading}
			on:keypress={handleKeyPress}
			class:error={errors.username}
		/>
		{#if errors.username}
			<span class="field-error">{errors.username}</span>
		{/if}
	</div>

	<div class="form-group">
		<label for="password">비밀번호</label>
		<input 
			type="password" 
			id="password" 
			bind:value={formData.password}
			placeholder="비밀번호를 입력하세요"
			disabled={loading}
			on:keypress={handleKeyPress}
			class:error={errors.password}
		/>
		{#if errors.password}
			<span class="field-error">{errors.password}</span>
		{/if}
	</div>

	<div class="form-check">
		<input 
			type="checkbox" 
			id="remember-me" 
			bind:checked={formData.rememberMe}
			disabled={loading}
		/>
		<label for="remember-me">자동 로그인</label>
	</div>

	<div class="form-actions">
		<Button 
			type="submit" 
			variant="primary" 
			size="lg" 
			fullWidth={true}
			disabled={loading}
		>
			{loading ? '로그인 중...' : '로그인'}
		</Button>
	</div>

	<div class="form-links">
		<a href="/register" class="form-link">회원가입</a>
		<span class="divider">|</span>
		<a href="/find-id" class="form-link">아이디 찾기</a>
		<span class="divider">|</span>
		<a href="/find-password" class="form-link">비밀번호 찾기</a>
	</div>

	<div class="demo-account">
		<p>테스트 계정: <strong>user1</strong> / <strong>password123</strong></p>
	</div>
</form>

<style>
	.login-form {
		width: 100%;
		max-width: 400px;
	}

	.error-message {
		background-color: #fee2e2;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
		text-align: center;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: #4b5563;
		margin-bottom: 0.5rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		transition: border-color 0.2s;
	}

	.form-group input:focus {
		outline: none;
		border-color: #5ce0c6;
		box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
	}

	.form-group input.error {
		border-color: #dc2626;
	}

	.form-group input:disabled {
		background-color: #f3f4f6;
		cursor: not-allowed;
	}

	.field-error {
		display: block;
		color: #dc2626;
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}

	.form-check {
		display: flex;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.form-check input {
		margin-right: 0.5rem;
	}

	.form-check label {
		font-size: 0.875rem;
		color: #6b7280;
		cursor: pointer;
	}

	.form-actions {
		margin-bottom: 1.5rem;
	}

	.form-links {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}

	.form-link {
		color: #6b7280;
		text-decoration: none;
		transition: color 0.2s;
	}

	.form-link:hover {
		color: #5ce0c6;
		text-decoration: underline;
	}

	.divider {
		margin: 0 0.75rem;
		color: #d1d5db;
	}

	.demo-account {
		text-align: center;
		font-size: 0.75rem;
		color: #9ca3af;
		background-color: #f3f4f6;
		padding: 0.75rem;
		border-radius: 0.25rem;
	}

	.demo-account strong {
		color: #4b5563;
	}
</style>
