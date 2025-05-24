<!-- src/routes/find-password/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/common/Button.svelte';

	let step = 1; // 1: 정보 입력, 2: 인증코드, 3: 비밀번호 재설정
	let formData = {
		username: '',
		email: '',
		verificationCode: '',
		newPassword: '',
		confirmPassword: ''
	};
	let loading = false;
	let error = '';
	let sentEmail = '';

	async function handleFindPassword() {
		error = '';

		// 유효성 검사
		if (!formData.username) {
			error = '아이디를 입력해주세요.';
			return;
		}

		if (!formData.email) {
			error = '이메일을 입력해주세요.';
			return;
		}

		loading = true;

		// 실제로는 API 호출
		setTimeout(() => {
			// 더미 데이터
			if (formData.username === 'user1' && formData.email === 'user1@example.com') {
				sentEmail = formData.email;
				step = 2;
			} else {
				error = '입력하신 정보와 일치하는 계정이 없습니다.';
			}
			loading = false;
		}, 1000);
	}

	async function handleVerifyCode() {
		error = '';

		if (!formData.verificationCode) {
			error = '인증코드를 입력해주세요.';
			return;
		}

		loading = true;

		// 실제로는 API 호출
		setTimeout(() => {
			// 더미 인증코드 확인
			if (formData.verificationCode === '123456') {
				step = 3;
			} else {
				error = '인증코드가 일치하지 않습니다.';
			}
			loading = false;
		}, 1000);
	}

	async function handleResetPassword() {
		error = '';

		if (!formData.newPassword) {
			error = '새 비밀번호를 입력해주세요.';
			return;
		}

		if (formData.newPassword.length < 8) {
			error = '비밀번호는 8자 이상이어야 합니다.';
			return;
		}

		if (formData.newPassword !== formData.confirmPassword) {
			error = '비밀번호가 일치하지 않습니다.';
			return;
		}

		loading = true;

		// 실제로는 API 호출
		setTimeout(() => {
			alert('비밀번호가 성공적으로 변경되었습니다.');
			goto('/login');
		}, 1000);
	}

	function resendCode() {
		alert('인증코드가 재발송되었습니다.');
	}
</script>

<svelte:head>
	<title>비밀번호 찾기 - FM마케팅</title>
</svelte:head>

<div class="find-password-container">
	<div class="find-password-card">
		<div class="find-password-header">
			<h1 class="find-password-title">
				<span class="logo-green">FM</span><span class="logo-blue">Marketing</span>
			</h1>
			<p class="find-password-subtitle">비밀번호 찾기</p>
		</div>

		{#if step === 1}
			<form class="find-password-form" on:submit|preventDefault={handleFindPassword}>
				{#if error}
					<div class="error-message">{error}</div>
				{/if}

				<p class="form-description">
					가입시 등록한 아이디와 이메일을 입력하면 비밀번호 재설정을 위한 인증코드를
					보내드립니다.
				</p>

				<div class="form-group">
					<label for="username">아이디</label>
					<input
						type="text"
						id="username"
						bind:value={formData.username}
						placeholder="아이디를 입력하세요"
						disabled={loading}
					/>
				</div>

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

				<div class="form-actions">
					<Button type="submit" variant="primary" size="lg" fullWidth={true} disabled={loading}>
						{loading ? '확인 중...' : '인증코드 받기'}
					</Button>
				</div>

				<div class="form-links">
					<a href="/login" class="form-link">로그인</a>
					<span class="divider">|</span>
					<a href="/find-id" class="form-link">아이디 찾기</a>
					<span class="divider">|</span>
					<a href="/register" class="form-link">회원가입</a>
				</div>

				<div class="help-text">
					<p>테스트 계정: user1 / user1@example.com</p>
				</div>
			</form>
		{:else if step === 2}
			<form class="find-password-form" on:submit|preventDefault={handleVerifyCode}>
				{#if error}
					<div class="error-message">{error}</div>
				{/if}

				<div class="verification-info">
					<p class="info-text">
						<strong>{sentEmail}</strong>로<br />
						인증코드를 발송했습니다.
					</p>
					<p class="info-subtext">이메일을 확인하고 인증코드를 입력해주세요.</p>
				</div>

				<div class="form-group">
					<label for="verificationCode">인증코드</label>
					<input
						type="text"
						id="verificationCode"
						bind:value={formData.verificationCode}
						placeholder="6자리 인증코드"
						maxlength="6"
						disabled={loading}
					/>
				</div>

				<div class="form-actions">
					<Button type="submit" variant="primary" size="lg" fullWidth={true} disabled={loading}>
						{loading ? '확인 중...' : '인증하기'}
					</Button>
				</div>

				<div class="resend-section">
					<p>인증코드를 받지 못하셨나요?</p>
					<button type="button" class="resend-button" on:click={resendCode}>
						인증코드 재발송
					</button>
				</div>

				<div class="help-text">
					<p>테스트 인증코드: 123456</p>
				</div>
			</form>
		{:else}
			<form class="find-password-form" on:submit|preventDefault={handleResetPassword}>
				{#if error}
					<div class="error-message">{error}</div>
				{/if}

				<p class="form-description">새로운 비밀번호를 입력해주세요.</p>

				<div class="form-group">
					<label for="newPassword">새 비밀번호</label>
					<input
						type="password"
						id="newPassword"
						bind:value={formData.newPassword}
						placeholder="8자 이상, 영문/숫자 조합"
						disabled={loading}
					/>
				</div>

				<div class="form-group">
					<label for="confirmPassword">비밀번호 확인</label>
					<input
						type="password"
						id="confirmPassword"
						bind:value={formData.confirmPassword}
						placeholder="비밀번호를 다시 입력하세요"
						disabled={loading}
					/>
				</div>

				<div class="password-requirements">
					<p class="requirement-title">비밀번호 요구사항</p>
					<ul class="requirement-list">
						<li>최소 8자 이상</li>
						<li>영문과 숫자를 포함</li>
						<li>특수문자 사용 권장</li>
					</ul>
				</div>

				<div class="form-actions">
					<Button type="submit" variant="primary" size="lg" fullWidth={true} disabled={loading}>
						{loading ? '변경 중...' : '비밀번호 변경'}
					</Button>
				</div>
			</form>
		{/if}
	</div>
</div>

<style>
	.find-password-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 2rem;
		background-color: #f9fafb;
	}

	.find-password-card {
		width: 100%;
		max-width: 450px;
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2.5rem;
	}

	.find-password-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.find-password-title {
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

	.find-password-subtitle {
		color: #6b7280;
		font-size: 1rem;
	}

	.find-password-form {
		width: 100%;
	}

	.form-description {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 1.5rem;
		line-height: 1.5;
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

	.help-text {
		text-align: center;
		font-size: 0.75rem;
		color: #9ca3af;
		background-color: #f3f4f6;
		padding: 0.5rem;
		border-radius: 0.25rem;
		margin-top: 1rem;
	}

	.verification-info {
		text-align: center;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background-color: #f0f9ff;
		border-radius: 0.375rem;
	}

	.info-text {
		font-size: 0.875rem;
		color: #1f2937;
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	.info-subtext {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.resend-section {
		text-align: center;
		margin-top: 1rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.resend-button {
		background: none;
		border: none;
		color: #5ce0c6;
		text-decoration: underline;
		cursor: pointer;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.resend-button:hover {
		color: #4bc0a9;
	}

	.password-requirements {
		background-color: #f9fafb;
		border-radius: 0.375rem;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.requirement-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: #4b5563;
		margin-bottom: 0.5rem;
	}

	.requirement-list {
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.requirement-list li {
		margin-bottom: 0.25rem;
		padding-left: 1rem;
		position: relative;
	}

	.requirement-list li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: #5ce0c6;
	}

	@media (max-width: 640px) {
		.find-password-card {
			padding: 1.5rem;
		}
	}
</style>
