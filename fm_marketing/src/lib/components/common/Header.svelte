<!-- src/lib/components/common/Header.svelte -->
<script>
	// 로그인 상태 관리를 위한 스토어 (예시)
	// import { userStore } from '$lib/stores/userStore';

	let searchQuery = '';
	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleSearch() {
		console.log('검색어:', searchQuery);
		// 검색 로직 구현
	}
</script>

<header class="header">
	<div class="header-container">
		<div class="logo-wrapper">
			<a href="/" class="logo">
				<span class="logo-green">FM</span><span class="logo-blue">Marketing</span>
			</a>
		</div>

		<div class="search-bar">
			<input
				type="text"
				placeholder="어떤 체험담을 찾고 있나요?"
				bind:value={searchQuery}
				on:keydown={(e) => e.key === 'Enter' && handleSearch()}
			/>
			<button class="search-button" on:click={handleSearch} aria-label="검색">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			</button>
		</div>

		<nav class="main-nav">
			<ul class="nav-links">
				<li><a href="/checklist">체험단 검색</a></li>
				<li><a href="/community">커뮤니티</a></li>
				<li><a href="/event">공지/이벤트</a></li>
				<li><a href="/guide">이용가이드</a></li>
			</ul>
		</nav>

		<div class="auth-buttons">
			<a href="/login" class="login-button">로그인</a>
		</div>

		<button class="menu-toggle" on:click={toggleMenu} aria-label="메뉴 토글">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="3" y1="12" x2="21" y2="12"></line>
				<line x1="3" y1="6" x2="21" y2="6"></line>
				<line x1="3" y1="18" x2="21" y2="18"></line>
			</svg>
		</button>
	</div>

	{#if isMenuOpen}
		<div class="mobile-menu">
			<ul class="mobile-nav-links">
				<li><a href="/checklist">체험단 검색</a></li>
				<li><a href="/community">커뮤니티</a></li>
				<li><a href="/event">공지/이벤트</a></li>
				<li><a href="/guide">이용가이드</a></li>
				<li><a href="/login">로그인</a></li>
			</ul>
		</div>
	{/if}
</header>

<style>
    .header {
        position: sticky;
        top: 0;
        z-index: 1000;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .header-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .logo-wrapper {
        flex-shrink: 0;
    }

    .logo {
        font-size: 1.5rem;
        font-weight: bold;
        text-decoration: none;
        display: flex;
        align-items: center;
    }

    .logo-green {
        color: #5ce0c6; /* 민트색 */
    }

    .logo-blue {
        color: #ff7eb6; /* 핑크색 */
    }

    .search-bar {
        flex-grow: 1;
        max-width: 400px;
        margin: 0 1rem;
        position: relative;
        display: flex;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        overflow: hidden;
    }

    .search-bar input {
        flex-grow: 1;
        padding: 0.5rem 1rem;
        border: none;
        outline: none;
        font-size: 0.875rem;
    }

    .search-button {
        background-color: white;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        color: #9ca3af;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .search-button:hover {
        color: #4c96d7;
    }

    .main-nav {
        margin-left: auto;
    }

    .nav-links {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
        gap: 1.5rem;
    }

    .nav-links a {
        color: #4b5563;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: color 0.2s;
    }

    .nav-links a:hover {
        color: #4c96d7;
    }

    .auth-buttons {
        margin-left: 1.5rem;
    }

    .login-button {
        display: inline-flex;
        padding: 0.5rem 1rem;
        background-color: #5ce0c6; /* 민트색 */
        color: white;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.375rem;
        transition: all 0.2s;
        text-decoration: none;
        box-shadow: 0 1px 3px rgba(92, 224, 198, 0.3);
    }

    .login-button:hover {
        background-color: #4bc0a9;
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(92, 224, 198, 0.3);
    }

    .menu-toggle {
        display: none;
        background: none;
        border: none;
        color: #4b5563;
        cursor: pointer;
        padding: 0.5rem;
    }

    .mobile-menu {
        display: none;
        padding: 1rem;
        background-color: white;
        border-top: 1px solid #e5e7eb;
    }

    .mobile-nav-links {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .mobile-nav-links li {
        margin-bottom: 0.75rem;
    }

    .mobile-nav-links a {
        color: #4b5563;
        text-decoration: none;
        font-size: 1rem;
        display: block;
        padding: 0.5rem 0;
    }

    @media (max-width: 800px) {
        .main-nav, .auth-buttons {
            display: none;
        }

        .menu-toggle {
            display: block;
        }

        .mobile-menu {
            display: block;
        }

        .search-bar {
            max-width: none;
            margin: 0 0.5rem;
        }
    }
</style>