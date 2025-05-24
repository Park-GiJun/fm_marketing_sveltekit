<!-- src/routes/find-id/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/common/Button.svelte';

	let step = 1; // 1: 정보 입력, 2: 결과
	let method = 'email'; // email, phone
	let formData = {
		name: '',
		email: '',
		phone: ''
	};
	let loading = false;
	let error = '';
	let foundUsername = '';

	async function handleSubmit() {
		error = '';

		// 유효성 검사
		if (!formData.name) {
			error = '이름을 입력해주세요.';
			return;
		}

		if (method === 'email' && !formData.email) {
			error = '이메일을 입력해주세요.';
			return;
		}

		if (method === 'phone' && !formData.phone) {
			error = '전화번호를 입력해주세요.';
			return;
		}

		loading = true;

		// 실제로는 API 호출
		setTimeout(() => {
			// 더미 데이터
			if (formData.name === '김철수' && formData.email === 'user1@example.com') {
				foundUsername = 'user1';
				step = 2;
			} else {
				error = '입력하신 정보와 일치하는 아이디가 없습니다.';
			}
			loading = false;
		}, 1000);
	}

	function goToLogin() {
		goto('/login');
	}

	function reset() {
		step = 1;
		formData = {
			name: '',
			email: '',
			phone: ''
		};
		foundUsername = '';
		error = '';
	}
</script>

<svelte:head>
	<title>아이디 찾기 - FM마케팅</title>
</svelte:head>

<div class="find-id-container">
	<div class="find-id-card">
		<div class="find-id-header">
			<h1 class="find-id-title">
				<span class="logo-green">FM</span><span class="logo-blue">Marketing</span>
			</h1>
			<p class="find-id-subtitle">아이디 찾기</p>
		</div>

		{#if step === 1}
			<form class="find-id-form" on:submit|preventDefault={handleSubmit}>
				{#if error}
					<div class="error-message">{error}</div>
				{/if}

				<div class="method-tabs">
					<button
						type="button"
						class="method-tab {method === 'email' ? 'active' : ''}"
						on:click={() => (method = 'email')}
					>
						이메일로 찾기
					</button>
					<button
						type="button"
						class="method-tab {method === 'phone' ? 'active' : ''}"
						on:click={() => (method = 'phone')}
					>
						전화번호로 찾기
					</button>
				</div>

				<div class="form-group">
					<label for="name">이름</label>
					<input
						type="text"
						id="name"
						bind:value={formData.name}
						placeholder="이름을 입력하세요"
						disabled={loading}
					/>
				</div>

				{#if method === 'email'}
					<div class="form-group">
						<label for="email">이메일</label>
						<input
							type="email"
							id="email"
							bind:value={formData.email}
							placeholder="가입시 등록한 이메일"
							disabled={loading}
						/>
					</div>
				{:else}
					<div class="form-group">
						<label for="phone">전화번호</label>
						<input
							type="tel"
							id="phone"
							bind:value={formData.phone}
							placeholder="010-0000-0000"
							disabled={loading}
						/>
					</div>
				{/if}

				<div class="form-actions">
					<Button type="submit" variant="primary" size="lg" fullWidth={true} disabled={loading}>
						{loading ? '확인 중...' : '아이디 찾기'}
					</Button>
				</div>

				<div class="form-links">
					<a href="/login" class="form-link">로그인</a>
					<span class="divider">|</span>
					<a href="/find-password" class="form-link">비밀번호 찾기</a>
					<span class="divider">|</span>
					<a href="/register" class="form-link">회원가입</a>
				</div>
			</form>
		{:else}
			<div class="result-section">
				<div class="result-icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="64"
						height="64"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
						<polyline points="22 4 12 14.01 9 11.01"></polyline>
					</svg>
				</div>

				<h2 class="result-title">아이디를 찾았습니다!</h2>

				<div class="result-box">
					<p class="result-label">회원님의 아이디는</p>
					<p class="result-username">{foundUsername}</p>
					<p class="result-info">입니다.</p>
				</div>

				<div class="result-actions">
					<Button variant="primary" size="lg" fullWidth={true} on:click={goToLogin}>
						로그인하기
					</Button>
					<Button variant="outline" size="lg" fullWidth={true} on:click={reset}>
						다시 찾기
					</Button>
				</div>

				<div class="result-links">
					<a href="/find-password" class="result-link">비밀번호 찾기</a>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.find-id-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 2rem;
		background-color: #f9fafb;
	}

	.find-id-card {
		width: 100%;
		max-width: 450px;
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2.5rem;
	}

	.find-id-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.find-id-title {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.logo-green {
		color: #5ce0c6;
	}

	.logo-blue {
		color: #ff7eb6;
	}

	.find-id-subtitle {
		color: #6b7280;
		font-size: 1rem;
	}

	.find-id-form {
		width: 100%;
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

	.method-tabs {
		display: flex;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.method-tab {
		flex: 1;
		padding: 0.75rem;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		font-size: 0.875rem;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s;
	}

	.method-tab:hover {
		color: #4b5563;
	}

	.method-tab.active {
		color: #5ce0c6;
		border-bottom-color: #5ce0c6;
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
	}

	.form-group input:focus {
		outline: none;
		border-color: #5ce0c6;
		box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
	}

	.form-actions {
		margin: 1.5rem 0;
	}

	.form-links {
		display: flex;
		justify-content: center;
		font-size: 0.875rem;
	}

	.form-link {
		color: #6b7280;
		text-decoration: none;
	}

	.form-link:hover {
		color: #ff7eb6;
		text-decoration: underline;
	}

	.divider {
		margin: 0 0.5rem;
		color: #d1d5db;
	}

	.result-section {
		text-align: center;
	}

	.result-icon {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
		color: #5ce0c6;
	}

	.result-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1.5rem;
	}

	.result-box {
		background-color: #f9fafb;
		border-radius: 0.375rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.result-label {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	.result-username {
		font-size: 1.5rem;
		font-weight: 700;
		color: #5ce0c6;
		margin: 0.5rem 0;
	}

	.result-info {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.result-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.result-links {
		text-align: center;
	}

	.result-link {
		font-size: 0.875rem;
		color: #6b7280;
		text-decoration: none;
	}

	.result-link:hover {
		color: #ff7eb6;
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.find-id-card {
			padding: 1.5rem;
		}
	}
</style>
