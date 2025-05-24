<!-- src/routes/terms/+page.svelte -->
<script>
	import MainLayout from '$lib/components/layout/MainLayout.svelte';
</script>

<svelte:head>
	<title>이용약관 - FM마케팅</title>
</svelte:head>

<MainLayout>
	<div class="terms-container">
		<div class="terms-header">
			<h1 class="terms-title">이용약관</h1>
			<p class="terms-date">시행일: 2025년 1월 1일</p>
		</div>

		<div class="terms-content">
			<section class="terms-section">
				<h2>제1조 (목적)</h2>
				<p>
					이 약관은 FM마케팅(이하 "회사")이 제공하는 체험단 마케팅 플랫폼 서비스(이하
					"서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항, 기타 필요한
					사항을 규정함을 목적으로 합니다.
				</p>
			</section>

			<section class="terms-section">
				<h2>제2조 (정의)</h2>
				<ol>
					<li>
						"서비스"란 회사가 제공하는 체험단 모집, 운영, 관리 등의 마케팅 플랫폼을
						말합니다.
					</li>
					<li>"회원"이란 서비스에 가입하여 이용계약을 체결한 자를 말합니다.</li>
					<li>
						"체험단"이란 기업이 제공하는 제품이나 서비스를 체험하고 리뷰를 작성하는 활동을
						말합니다.
					</li>
					<li>
						"포인트"란 서비스 내에서 사용할 수 있는 가상의 화폐를 말하며, 현금으로 환급
						가능합니다.
					</li>
				</ol>
			</section>

			<section class="terms-section">
				<h2>제3조 (약관의 게시와 개정)</h2>
				<ol>
					<li>회사는 이 약관을 서비스 초기 화면에 게시합니다.</li>
					<li>
						회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수
						있습니다.
					</li>
					<li>
						개정된 약관은 공지사항을 통해 공지하며, 공지일로부터 7일 후부터 적용됩니다.
					</li>
				</ol>
			</section>

			<section class="terms-section">
				<h2>제4조 (이용계약의 체결)</h2>
				<ol>
					<li>이용계약은 회원가입 신청자가 약관에 동의하고 가입을 완료함으로써 체결됩니다.</li>
					<li>
						회사는 다음 각 호에 해당하는 경우 가입을 거부하거나 사후에 이용계약을 해지할 수
						있습니다.
						<ul>
							<li>타인의 정보를 도용한 경우</li>
							<li>허위 정보를 기재한 경우</li>
							<li>이전에 회원자격을 상실한 적이 있는 경우</li>
						</ul>
					</li>
				</ol>
			</section>

			<section class="terms-section">
				<h2>제5조 (회원의 의무)</h2>
				<ol>
					<li>회원은 다음 행위를 하여서는 안 됩니다.
						<ul>
							<li>타인의 정보 도용</li>
							<li>서비스에 게시된 정보의 변경</li>
							<li>허위 리뷰 작성</li>
							<li>기타 불법적이거나 부당한 행위</li>
						</ul>
					</li>
					<li>체험단 선정 시 성실히 활동을 수행해야 합니다.</li>
					<li>체험 후기는 정해진 기간 내에 작성해야 합니다.</li>
				</ol>
			</section>

			<section class="terms-section">
				<h2>제6조 (회사의 의무)</h2>
				<ol>
					<li>회사는 안정적인 서비스 제공을 위해 노력합니다.</li>
					<li>회원의 개인정보를 보호하기 위해 보안 시스템을 구축합니다.</li>
					<li>서비스 이용과 관련한 회원의 불만사항을 신속히 처리합니다.</li>
				</ol>
			</section>

			<section class="terms-section">
				<h2>제7조 (포인트)</h2>
				<ol>
					<li>포인트는 체험단 활동, 이벤트 참여 등을 통해 적립됩니다.</li>
					<li>포인트의 유효기간은 적립일로부터 1년입니다.</li>
					<li>최소 10,000포인트부터 현금으로 환급 가능합니다.</li>
					<li>부정한 방법으로 적립된 포인트는 회수될 수 있습니다.</li>
				</ol>
			</section>

			<section class="terms-section">
				<h2>제8조 (서비스의 중단)</h2>
				<p>
					회사는 다음 각 호에 해당하는 경우 서비스 제공을 일시적으로 중단할 수 있습니다.
				</p>
				<ol>
					<li>시스템 점검이나 보수가 필요한 경우</li>
					<li>전기통신사업법에 규정된 기간통신사업자가 서비스를 중지한 경우</li>
					<li>기타 불가항력적 사유가 있는 경우</li>
				</ol>
			</section>

			<section class="terms-section">
				<h2>제9조 (면책조항)</h2>
				<ol>
					<li>회사는 천재지변 또는 이에 준하는 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
					<li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대해 책임을 지지 않습니다.</li>
					<li>회사는 회원이 서비스를 이용하여 얻은 정보에 대해 책임을 지지 않습니다.</li>
				</ol>
			</section>

			<section class="terms-section">
				<h2>제10조 (분쟁해결)</h2>
				<ol>
					<li>회사와 회원 간 발생한 분쟁은 상호 협의하여 해결합니다.</li>
					<li>협의가 되지 않을 경우 관할 법원은 회사 소재지를 관할하는 법원으로 합니다.</li>
				</ol>
			</section>

			<section class="terms-section">
				<h2>부칙</h2>
				<p>이 약관은 2025년 1월 1일부터 시행됩니다.</p>
			</section>
		</div>

		<div class="terms-footer">
			<a href="/register" class="back-link">회원가입으로 돌아가기</a>
		</div>
	</div>
</MainLayout>

<style>
	.terms-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.terms-header {
		text-align: center;
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.terms-title {
		font-size: 2rem;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 0.5rem;
	}

	.terms-date {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.terms-content {
		background-color: white;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 2rem;
	}

	.terms-section {
		margin-bottom: 2.5rem;
	}

	.terms-section:last-child {
		margin-bottom: 0;
	}

	.terms-section h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.terms-section p {
		font-size: 0.875rem;
		line-height: 1.6;
		color: #4b5563;
		margin-bottom: 1rem;
	}

	.terms-section ol {
		padding-left: 1.5rem;
		margin: 0;
	}

	.terms-section li {
		font-size: 0.875rem;
		line-height: 1.6;
		color: #4b5563;
		margin-bottom: 0.75rem;
	}

	.terms-section ul {
		padding-left: 1.5rem;
		margin: 0.5rem 0;
	}

	.terms-section ul li {
		font-size: 0.875rem;
		line-height: 1.5;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}

	.terms-footer {
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
		.terms-content {
			padding: 1.5rem;
		}

		.terms-section h2 {
			font-size: 1.125rem;
		}
	}
</style>
