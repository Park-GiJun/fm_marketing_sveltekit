<!-- src/routes/admin/+layout.svelte -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/userStore.js';
  
  let isAuthenticated = false;
  let user = null;
  let sidebarOpen = true;
  
  // 관리자 네비게이션 메뉴
  const adminMenus = [
    {
      title: '대시보드',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>`,
      href: '/admin',
      active: true
    },
    {
      title: '체험단 관리',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="23" y1="11" x2="17" y2="11"></line>
      </svg>`,
      href: '/admin/experiences'
    },
    {
      title: '사용자 관리',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`,
      href: '/admin/users'
    },
    {
      title: '커뮤니티 관리',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>`,
      href: '/admin/community'
    },
    {
      title: '이벤트 관리',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>`,
      href: '/admin/events'
    },
    {
      title: '통계',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>`,
      href: '/admin/stats'
    }
  ];
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
  
  function handleLogout() {
    userStore.logout();
    goto('/');
  }
  
  onMount(() => {
    const unsubscribe = userStore.subscribe(state => {
      isAuthenticated = state.isAuthenticated;
      user = state.user;
      
      // 관리자 권한 체크 (실제로는 서버에서 검증해야 함)
      if (!isAuthenticated) {
        goto('/login?redirect=' + encodeURIComponent(window.location.pathname));
      }
    });
    
    return () => {
      unsubscribe();
    };
  });
</script>

<svelte:head>
  <title>관리자 대시보드 - FM마케팅</title>
</svelte:head>

<div class="admin-layout">
  <!-- 사이드바 -->
  <aside class="sidebar {sidebarOpen ? 'open' : 'closed'}">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-green">FM</span><span class="logo-blue">Admin</span>
      </div>
      
      <button class="sidebar-toggle" on:click={toggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <ul class="nav-list">
        {#each adminMenus as menu}
          <li class="nav-item">
            <a 
              href={menu.href} 
              class="nav-link {menu.active ? 'active' : ''}"
              class:collapsed={!sidebarOpen}
            >
              <span class="nav-icon">{@html menu.icon}</span>
              {#if sidebarOpen}
                <span class="nav-text">{menu.title}</span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
    
    <div class="sidebar-footer">
      {#if user}
        <div class="user-info" class:collapsed={!sidebarOpen}>
          <div class="user-avatar">
            {user.name ? user.name.charAt(0) : 'A'}
          </div>
          {#if sidebarOpen}
            <div class="user-details">
              <div class="user-name">{user.name || '관리자'}</div>
              <div class="user-role">관리자</div>
            </div>
          {/if}
        </div>
        
        {#if sidebarOpen}
          <button class="logout-button" on:click={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            로그아웃
          </button>
        {/if}
      {/if}
    </div>
  </aside>
  
  <!-- 메인 콘텐츠 -->
  <main class="main-content">
    <header class="content-header">
      <button class="mobile-menu-toggle" on:click={toggleSidebar}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      <div class="header-actions">
        <a href="/" class="back-to-site">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          사이트로 돌아가기
        </a>
      </div>
    </header>
    
    <div class="content-body">
      <slot />
    </div>
  </main>
</div>

<!-- 모바일 오버레이 -->
{#if sidebarOpen}
  <div class="mobile-overlay" on:click={toggleSidebar}></div>
{/if}

<style>
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f9fafb;
  }
  
  .sidebar {
    width: 280px;
    background-color: #1f2937;
    color: white;
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 40;
  }
  
  .sidebar.closed {
    width: 80px;
  }
  
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #374151;
  }
  
  .logo {
    font-size: 1.25rem;
    font-weight: bold;
    white-space: nowrap;
  }
  
  .logo-green {
    color: #5ce0c6;
  }
  
  .logo-blue {
    color: #ff7eb6;
  }
  
  .sidebar-toggle {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
  }
  
  .sidebar-toggle:hover {
    background-color: #374151;
    color: white;
  }
  
  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
  }
  
  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .nav-item {
    margin-bottom: 0.25rem;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #d1d5db;
    text-decoration: none;
    transition: all 0.2s;
    border-radius: 0;
    margin: 0 0.5rem;
    border-radius: 0.375rem;
  }
  
  .nav-link:hover {
    background-color: #374151;
    color: white;
  }
  
  .nav-link.active {
    background-color: #5ce0c6;
    color: #1f2937;
  }
  
  .nav-link.collapsed {
    justify-content: center;
  }
  
  .nav-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
  
  .nav-text {
    white-space: nowrap;
  }
  
  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid #374151;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .user-info.collapsed {
    justify-content: center;
  }
  
  .user-avatar {
    width: 2rem;
    height: 2rem;
    background-color: #5ce0c6;
    color: #1f2937;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    flex-shrink: 0;
  }
  
  .user-details {
    min-width: 0;
  }
  
  .user-name {
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .user-role {
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  .logout-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    background: none;
    border: 1px solid #374151;
    border-radius: 0.375rem;
    color: #9ca3af;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .logout-button:hover {
    background-color: #374151;
    border-color: #4b5563;
    color: white;
  }
  
  .main-content {
    flex: 1;
    margin-left: 280px;
    transition: margin-left 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar.closed + .main-content {
    margin-left: 80px;
  }
  
  .content-header {
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    color: #4b5563;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .back-to-site {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;
  }
  
  .back-to-site:hover {
    color: #4b5563;
  }
  
  .content-body {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }
  
  .mobile-overlay {
    display: none;
  }
  
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
      width: 280px;
      z-index: 50;
    }
    
    .sidebar.open {
      transform: translateX(0);
    }
    
    .main-content {
      margin-left: 0;
    }
    
    .sidebar.closed + .main-content {
      margin-left: 0;
    }
    
    .mobile-menu-toggle {
      display: block;
    }
    
    .mobile-overlay {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 40;
    }
  }
</style>
