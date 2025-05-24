<!-- src/lib/components/common/Header.svelte -->
<script>
	import { userStore } from '$lib/stores/userStore.js';
	import NotificationDropdown from './NotificationDropdown.svelte';

	let searchQuery = '';
	let isMenuOpen = false;
	let isAuthenticated = false;
	let user = null;

	// 사용자 상태 구독
	userStore.subscribe(state => {
		isAuthenticated = state.isAuthenticated;
		user = state.user;
	});

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleSearch() {
		if (searchQuery.trim()) {
			window.location.href = `/checklist?search=${encodeURIComponent(searchQuery)}`;
		}
	}

	function handleLogout() {
		userStore.logout();
		window.location.href = '/';
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
				{#if user?.role === 'admin'}
					<li><a href="/experiences/new" class="nav-new">체험단 등록</a></li>
				{/if}
			</ul>
		</nav>

		<div class="header-actions">
			{#if isAuthenticated}
				<!-- 로그인 상태 -->
				<NotificationDropdown />
				
				<div class="user-menu">
					<button class="user-button" on:click={toggleMenu}>
						<div class="user-avatar">
							{user?.name ? user.name.charAt(0) : 'U'}
						</div>
						<span class="user-name">{user?.nickname || '사용자'}</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					</button>
					
					{#if isMenuOpen}
						<div class="user-dropdown">
							<a href="/mypage" class="dropdown-item">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</svg>
								마이페이지
							</a>
							<a href="/user/profile" class="dropdown-item">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
								</svg>
								프로필 수정
							</a>
							<a href="/notifications" class="dropdown-item">
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
									<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
								</svg>
								알림 설정
							</a>
							<hr class="dropdown-divider" />
							<button class="dropdown-item logout" on:click={handleLogout}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
									<polyline points="16 17 21 12 16 7"></polyline>
									<line x1="21" y1="12" x2="9" y2="12"></line>
								</svg>
								로그아웃
							</button>
						</div>
					{/if}
				</div>
			{:else}
				<!-- 비로그인 상태 -->
				<div class="auth-buttons">
					<a href="/login" class="login-button">로그인</a>
					<a href="/register" class="register-button">회원가입</a>
				</div>
			{/if}
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
					{#if user?.role === 'admin'}
						<li><a href="/experiences/new">체험단 등록</a></li>
					{/if}
					{#if isAuthenticated}
						<li><a href="/mypage">마이페이지</a></li>
						<li><a href="/notifications">알림 설정</a></li>
						<li><button class="mobile-logout" on:click={handleLogout}>로그아웃</button></li>
					{:else}
						<li><a href="/login">로그인</a></li>
						<li><a href="/register">회원가입</a></li>
					{/if}
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

    .nav-new {
        color: #5ce0c6 !important;
        font-weight: 600;
    }

    .nav-new:hover {
        color: #4bc0a9 !important;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-left: 1.5rem;
    }

    .auth-buttons {
        display: flex;
        gap: 0.75rem;
    }

    .login-button {
        display: inline-flex;
        padding: 0.5rem 1rem;
        background-color: transparent;
        color: #4b5563;
        font-size: 0.875rem;
        font-weight: 500;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        transition: all 0.2s;
        text-decoration: none;
    }

    .login-button:hover {
        background-color: #f9fafb;
        border-color: #9ca3af;
    }

    .register-button {
        display: inline-flex;
        padding: 0.5rem 1rem;
        background-color: #5ce0c6;
        color: white;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.375rem;
        transition: all 0.2s;
        text-decoration: none;
        box-shadow: 0 1px 3px rgba(92, 224, 198, 0.3);
    }

    .register-button:hover {
        background-color: #4bc0a9;
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(92, 224, 198, 0.3);
    }

    /* 사용자 메뉴 */
    .user-menu {
        position: relative;
    }

    .user-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: none;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .user-button:hover {
        background-color: #f3f4f6;
    }

    .user-avatar {
        width: 2rem;
        height: 2rem;
        background-color: #5ce0c6;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        font-weight: 600;
    }

    .user-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: #1f2937;
    }

    .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 50;
        margin-top: 0.5rem;
        min-width: 12rem;
        background-color: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        padding: 0.5rem 0;
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        color: #4b5563;
        text-decoration: none;
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .dropdown-item:hover {
        background-color: #f9fafb;
    }

    .dropdown-item.logout {
        color: #dc2626;
    }

    .dropdown-item.logout:hover {
        background-color: #fee2e2;
    }

    .dropdown-divider {
        margin: 0.5rem 0;
        border: none;
        border-top: 1px solid #e5e7eb;
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
        .main-nav, .header-actions {
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

    .mobile-logout {
        width: 100%;
        background: none;
        border: none;
        text-align: left;
        padding: 0.75rem 0;
        color: #dc2626;
        font-size: 1rem;
        cursor: pointer;
    }
</style>