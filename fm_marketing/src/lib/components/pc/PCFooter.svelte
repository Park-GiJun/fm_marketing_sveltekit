<footer class="main-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-section">
        <h3 class="footer-heading">FM 마케팅</h3>
        <p class="footer-text">효과적인 마케팅 솔루션을 제공하는 전문 기업입니다.</p>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-heading">빠른 링크</h3>
        <ul class="footer-links">
          <li><a href="/" class="footer-link">홈</a></li>
          <li><a href="/regions" class="footer-link">지역</a></li>
          <li><a href="/login" class="footer-link">로그인</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-heading">연락처</h3>
        <address class="footer-address">
          <p>서울특별시 강남구 테헤란로 123</p>
          <p>이메일: info@fmmarketing.com</p>
          <p>전화: 02-123-4567</p>
        </address>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} FM 마케팅. All rights reserved.</p>
    </div>
  </div>
</footer>

<style>
  .main-footer {
    background-color: #1f2937; /* gray-800 */
    color: white;
    padding: 3rem 0 1.5rem;
    margin-top: 3rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .footer-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  @media (min-width: 768px) {
    .footer-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  .footer-heading {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: white;
  }
  
  .footer-text, .footer-address {
    color: #d1d5db; /* gray-300 */
    line-height: 1.6;
    font-style: normal;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .footer-link {
    color: #d1d5db; /* gray-300 */
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-link:hover {
    color: white;
  }
  
  .footer-bottom {
    border-top: 1px solid #374151; /* gray-700 */
    margin-top: 2.5rem;
    padding-top: 1.5rem;
    text-align: center;
    color: #9ca3af; /* gray-400 */
    font-size: 0.875rem;
  }
</style>
