<!-- src/routes/privacy/+page.svelte -->
<script>
	import MainLayout from '$lib/components/layout/MainLayout.svelte';
</script>

<svelte:head>
	<title>개인정보처리방침 - FM마케팅</title>
</svelte:head>

<MainLayout>
	<div class="privacy-container">
		<div class="privacy-header">
			<h1 class="privacy-title">개인정보처리방침</h1>
			<p class="privacy-date">시행일: 2025년 1월 1일</p>
		</div>

		<div class="privacy-content">
			<section class="privacy-section">
				<p class="intro">
					FM마케팅(이하 "회사")은 회원의 개인정보를 중요시하며, 「개인정보 보호법」,
					「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하고
					있습니다.
				</p>
			</section>

			<section class="privacy-section">
				<h2>1. 개인정보의 수집 및 이용목적</h2>
				<p>회사는 다음과 같은 목적으로 개인정보를 수집 및 이용합니다.</p>
				<ul>
					<li>회원 가입 및 관리</li>
					<li>체험단 서비스 제공 및 운영</li>
					<li>고지사항 전달 및 민원 처리</li>
					<li>마케팅 및 광고에 활용</li>
					<li>서비스 개선 및 신규 서비스 개발</li>
				</ul>
			</section>

			<section class="privacy-section">
				<h2>2. 수집하는 개인정보 항목</h2>
				<div class="subsection">
					<h3>필수 항목</h3>
					<ul>
						<li>아이디, 비밀번호, 이름, 이메일 주소</li>
						<li>닉네임, 휴대전화번호</li>
						<li>서비스 이용기록, 접속 로그, IP 주소</li>
					</ul>
				</div>
				<div class="subsection">
					<h3>선택 항목</h3>
					<ul>
						<li>생년월일, 성별</li>
						<li>주소, 블로그/SNS 주소</li>
						<li>관심 카테고리</li>
					</ul>
				</div>
			</section>

			<section class="privacy-section">
				<h2>3. 개인정보의 보유 및 이용기간</h2>
				<p>
					회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이
					파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
				</p>
				<div class="subsection">
					<h3>회사 내부 방침에 의한 정보 보유</h3>
					<ul>
						<li>부정 이용 기록: 5년</li>
						<li>체험단 활동 이력: 3년</li>
					</ul>
				</div>
				<div class="subsection">
					<h3>관련 법령에 의한 정보 보유</h3>
					<ul>
						<li>계약 또는 청약철회 등에 관한 기록: 5년</li>
						<li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
						<li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
						<li>웹사이트 방문기록: 3개월</li>
					</ul>
				</div>
			</section>

			<section class="privacy-section">
				<h2>4. 개인정보의 제3자 제공</h2>
				<p>
					회사는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는
					예외로 합니다.
				</p>
				<ul>
					<li>회원이 사전에 동의한 경우</li>
					<li>체험단 운영을 위해 해당 기업에 필요한 최소한의 정보를 제공하는 경우</li>
					<li>법령의 규정에 의거하거나 수사기관의 요구가 있는 경우</li>
				</ul>
			</section>

			<section class="privacy-section">
				<h2>5. 개인정보의 안전성 확보 조치</h2>
				<p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
				<ul>
					<li>개인정보의 암호화</li>
					<li>해킹 등에 대비한 보안 시스템 구축</li>
					<li>개인정보 접근 권한의 제한 및 관리</li>
					<li>개인정보 처리 직원의 교육</li>
				</ul>
			</section>

			<section class="privacy-section">
				<h2>6. 회원의 권리와 행사 방법</h2>
				<p>회원은 언제든지 다음과 같은 권리를 행사할 수 있습니다.</p>
				<ul>
					<li>개인정보 열람 요구</li>
					<li>오류 등이 있을 경우 정정 요구</li>
					<li>삭제 요구</li>
					<li>처리 정지 요구</li>
				</ul>
				<p>
					권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에
					대해 지체 없이 조치하겠습니다.
				</p>
			</section>

			<section class="privacy-section">
				<h2>7. 개인정보 자동 수집 장치의 설치·운영 및 거부</h2>
				<p>
					회사는 서비스 이용과정에서 쿠키(cookie)를 사용합니다. 쿠키는 웹사이트가 회원의
					브라우저에 전송하는 소량의 정보입니다.
				</p>
				<p>
					회원은 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹브라우저에서 옵션을 설정함으로써
					모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의
					저장을 거부할 수도 있습니다.
				</p>
			</section>

			<section class="privacy-section">
				<h2>8. 개인정보 보호책임자</h2>
				<p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고 있습니다.</p>
				<div class="contact-info">
					<p><strong>개인정보 보호책임자</strong></p>
					<ul>
						<li>성명: 홍길동</li>
						<li>직책: 개인정보보호팀장</li>
						<li>이메일: privacy@fmmarketing.com</li>
						<li>전화번호: 02-123-4567</li>
					</ul>
				</div>
			</section>

			<section class="privacy-section">
				<h2>9. 개인정보처리방침의 변경</h2>
				<p>
					이 개인정보처리방침은 2025년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의
					추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여
					고지할 것입니다.
				</p>
			</section>
		</div>

		<div class="privacy-footer">
			<a href="/register" class="back-link">회원가입으로 돌아가기</a>
		</div>
	</div>
</MainLayout>

<style>
	.privacy-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.privacy-header {
		text-align: center;
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.privacy-title {
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.privacy-date {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.privacy-content {
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 2rem;
	}

	.privacy-section {
		margin-bottom: 2.5rem;
	}

	.privacy-section:last-child {
		margin-bottom: 0;
	}

	.privacy-section h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.privacy-section h3 {
		font-size: 1rem;
		font-weight: 600;
		color: #4b5563;
		margin-bottom: 0.5rem;
	}

	.privacy-section p {
		font-size: 0.875rem;
		line-height: 1.6;
		color: #4b5563;
		margin-bottom: 1rem;
	}

	.intro {
		font-size: 0.875rem;
		line-height: 1.6;
		color: #4b5563;
		background-color: #f0f9ff;
		padding: 1rem;
		border-radius: 0.375rem;
		margin-bottom: 0;
	}

	.privacy-section ul {
		padding-left: 1.5rem;
		margin: 0.5rem 0;
	}

	.privacy-section li {
		font-size: 0.875rem;
		line-height: 1.6;
		color: #4b5563;
		margin-bottom: 0.5rem;
	}

	.subsection {
		margin-bottom: 1.5rem;
	}

	.subsection:last-child {
		margin-bottom: 0;
	}

	.contact-info {
		background-color: #f9fafb;
		padding: 1rem;
		border-radius: 0.375rem;
		margin-top: 1rem;
	}

	.contact-info p {
		margin-bottom: 0.5rem;
	}

	.contact-info ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.contact-info li {
		font-size: 0.875rem;
		color: #4b5563;
		margin-bottom: 0.25rem;
	}

	.privacy-footer {
		text-align: center;
		margin-top: 2rem;
	}

	.back-link {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background-color: #5ce0c6;
		color: white;
		text-decoration: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.back-link:hover {
		background-color: #4bc0a9;
	}

	@media (max-width: 640px) {
		.privacy-content {
			padding: 1.5rem;
		}

		.privacy-section h2 {
			font-size: 1.125rem;
		}
	}
</style>
