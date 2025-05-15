<!-- src/lib/components/common/Footer.svelte -->
<script>
	// 현재 연도
	const currentYear = new Date().getFullYear();

	// 푸터 링크 목록
	const footerLinks = [
		{ title: '회사 소개', url: '/about' },
		{ title: '이용약관', url: '/terms' },
		{ title: '개인정보처리방침', url: '/privacy' },
		{ title: '고객센터', url: '/support' },
		{ title: '광고/제휴 문의', url: '/advertise' }
	];

	// 소셜 미디어 링크
	const socialLinks = [
		{ name: 'Facebook', icon: 'facebook', url: '#' },
		{ name: 'Instagram', icon: 'instagram', url: '#' },
		{ name: 'Twitter', icon: 'twitter', url: '#' },
		{ name: 'YouTube', icon: 'youtube', url: '#' }
	];

	// 아이콘 SVG 데이터
	const icons = {
		facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`,
		instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>`,
		twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>`,
		youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`
	};
</script>

<footer class="footer">
	<div class="footer-container">
		<div class="footer-top">
			<div class="footer-logo">
				<span class="logo-green">FM</span><span class="logo-blue">Marketing</span>
			</div>

			<div class="footer-links">
				{#each footerLinks as link}
					<a href={link.url} class="footer-link">{link.title}</a>
				{/each}
			</div>
		</div>

		<div class="footer-middle">
			<div class="company-info">
				<p>
					<strong>회사명:</strong> (주)FMMarketing | <strong>대표:</strong> 홍길동 | <strong>사업자등록번호:</strong> 123-45-67890
				</p>
				<p>
					<strong>주소:</strong> 서울특별시 강남구 테헤란로 123, FMMarketing빌딩
				</p>
				<p>
					<strong>이메일:</strong> support@fmmarketing.com | <strong>전화:</strong> 02-123-4567
				</p>
			</div>

			<div class="social-links">
				{#each socialLinks as social}
					<a href={social.url} class="social-link" aria-label={social.name}>
						{@html icons[social.icon]}
					</a>
				{/each}
			</div>
		</div>

		<div class="footer-bottom">
			<div class="copyright">
				&copy; {currentYear} FMMarketing. All rights reserved.
			</div>
		</div>
	</div>
</footer>

<style>
    .footer {
        background-color: #f9fafb;
        border-top: 1px solid #e5e7eb;
        padding: 3rem 0 1.5rem;
        margin-top: 3rem;
    }

    .footer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .footer-top {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .footer-logo {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .logo-green {
        color: #6bb546;
    }

    .logo-blue {
        color: #4c96d7;
    }

    .footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
    }

    .footer-link {
        color: #4b5563;
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s;
    }

    .footer-link:hover {
        color: #4c96d7;
    }

    .footer-middle {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 2rem;
    }

    .company-info {
        max-width: 700px;
        color: #6b7280;
        font-size: 0.875rem;
        line-height: 1.5;
    }

    .company-info p {
        margin: 0.5rem 0;
    }

    .social-links {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background-color: #e5e7eb;
        border-radius: 50%;
        color: #4b5563;
        transition: all 0.2s;
    }

    .social-link:hover {
        background-color: #4c96d7;
        color: white;
    }

    .footer-bottom {
        border-top: 1px solid #e5e7eb;
        padding-top: 1.5rem;
        text-align: center;
        color: #9ca3af;
        font-size: 0.75rem;
    }

    @media (max-width: 768px) {
        .footer-top, .footer-middle {
            flex-direction: column;
            align-items: flex-start;
        }

        .footer-links, .social-links {
            margin-top: 1rem;
        }

        .footer-links {
            gap: 1rem;
        }
    }
</style>