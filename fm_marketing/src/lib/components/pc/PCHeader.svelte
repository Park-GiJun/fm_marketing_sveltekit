<script>
  import { page } from '$app/stores';
</script>

<header class="main-header">
  <div class="container">
    <div class="header-inner">
      <div class="logo">
        <a href="/" class="logo-text">FM 마케팅</a>
      </div>
      
      <nav class="main-nav">
        <ul class="nav-links">
          <li><a href="/" class="nav-link {$page.url.pathname === '/' ? 'active' : ''}">홈</a></li>
          <li><a href="/regions" class="nav-link {$page.url.pathname === '/regions' ? 'active' : ''}">지역</a></li>
          <li><a href="/login" class="nav-link {$page.url.pathname === '/login' ? 'active' : ''}">로그인</a></li>
        </ul>
      </nav>
    </div>
  </div>
</header>

<style>
  .main-header {
    background-color: #0369a1; /* sky-700 */
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
  }
  
  .logo-text {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
  }
  
  .nav-links {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    padding: 0;
    margin: 0;
  }
  
  .nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 0;
    font-weight: 500;
    position: relative;
    transition: color 0.3s ease;
  }
  
  .nav-link:hover {
    color: #bae6fd; /* sky-200 */
  }
  
  .nav-link.active {
    font-weight: bold;
  }
  
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: white;
  }
</style>
