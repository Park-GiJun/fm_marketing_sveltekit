<!-- 관리자 체험단 상세/편집 페이지 -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { reviewApi } from '$lib/utils/api.js';
  import { formatKoreanDate, formatDDay } from '$lib/utils/date.js';
  import { toast } from '$lib/stores/toastStore.js';
  import ImageUpload from '$lib/components/common/ImageUpload.svelte';
  
  let experienceId = $page.params.id;
  let experience = null;
  let applications = [];
  let loading = true;
  let saving = false;
  let isEditMode = false;
  
  // 폼 데이터
  let formData = {
    title: '',
    content: '',
    category: '',
    type: '체험단',
    region: '',
    location: '',
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    maxParticipants: 0,
    requiredPoints: 0,
    rewardPoints: 0,
    rewardDescription: '',
    requirements: '',
    companyName: '',
    contactInfo: '',
    tags: [],
    images: []
  };
  
  // 카테고리 옵션
  const categoryOptions = ['음식점', '카페', '뷰티', '패션', '여행', '문화', '생활', '기타'];
  
  // 지역 옵션
  const regionOptions = [
    '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산',
    '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  ];
  
  // 체험단 정보 로드
  async function loadExperience() {
    try {
      loading = true;
      
      if (experienceId === 'new') {
        isEditMode = true;
        return;
      }
      
      const response = await reviewApi.getReview(experienceId);
      experience = response.data;
      
      // 폼 데이터 설정
      formData = {
        title: experience.title || '',
        content: experience.content || '',
        category: experience.category || '',
        type: experience.type || '체험단',
        region: experience.region || '',
        location: experience.location || '',
        startDate: experience.startDate ? experience.startDate.split('T')[0] : '',
        endDate: experience.endDate ? experience.endDate.split('T')[0] : '',
        applicationDeadline: experience.applicationDeadline ? experience.applicationDeadline.split('T')[0] : '',
        maxParticipants: experience.maxParticipants || 0,
        requiredPoints: experience.requiredPoints || 0,
        rewardPoints: experience.rewardPoints || 0,
        rewardDescription: experience.rewardDescription || '',
        requirements: experience.requirements || '',
        companyName: experience.companyName || '',
        contactInfo: experience.contactInfo || '',
        tags: experience.tags || [],
        images: experience.images || []
      };
      
      // 신청자 목록 로드
      await loadApplications();
      
    } catch (error) {
      console.error('체험단 정보 로드 실패:', error);
      toast.error('체험단 정보를 불러오는데 실패했습니다.');
    } finally {
      loading = false;
    }
  }
  
  // 신청자 목록 로드
  async function loadApplications() {
    try {
      const response = await reviewApi.getApplications({ experienceId });
      applications = response.data.applications || [];
    } catch (error) {
      console.error('신청자 목록 로드 실패:', error);
    }
  }
  
  // 체험단 저장
  async function saveExperience() {
    try {
      saving = true;
      
      if (experienceId === 'new') {
        const response = await reviewApi.createReview(formData);
        toast.success('체험단이 등록되었습니다.');
        goto(`/admin/experiences/${response.data.id}`);
      } else {
        await reviewApi.updateReview(experienceId, formData);
        toast.success('체험단이 수정되었습니다.');
        isEditMode = false;
        await loadExperience();
      }
      
    } catch (error) {
      console.error('체험단 저장 실패:', error);
      toast.error('체험단 저장에 실패했습니다.');
    } finally {
      saving = false;
    }
  }
  
  // 신청 상태 변경
  async function updateApplicationStatus(applicationId, newStatus) {
    try {
      await reviewApi.updateApplication(applicationId, { status: newStatus });
      toast.success('신청 상태가 변경되었습니다.');
      await loadApplications();
    } catch (error) {
      console.error('신청 상태 변경 실패:', error);
      toast.error('신청 상태 변경에 실패했습니다.');
    }
  }
  
  // 태그 추가
  function addTag(event) {
    if (event.key === 'Enter' && event.target.value.trim()) {
      event.preventDefault();
      const newTag = event.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        formData.tags = [...formData.tags, newTag];
      }
      event.target.value = '';
    }
  }
  
  // 태그 삭제
  function removeTag(tag) {
    formData.tags = formData.tags.filter(t => t !== tag);
  }
  
  // 이미지 변경 핸들러
  function handleImageChange(images) {
    formData.images = images;
  }
  
  onMount(() => {
    loadExperience();
  });
</script>

<div class="experience-detail">
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>체험단 정보를 불러오는 중...</p>
    </div>
  {:else}
    <div class="page-header">
      <div class="header-left">
        <a href="/admin/experiences" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          목록으로
        </a>
        <h1 class="page-title">
          {experienceId === 'new' ? '새 체험단 등록' : isEditMode ? '체험단 수정' : '체험단 상세'}
        </h1>
      </div>
      
      <div class="header-actions">
        {#if experienceId !== 'new'}
          {#if isEditMode}
            <button class="btn-secondary" on:click={() => isEditMode = false}>취소</button>
            <button class="btn-primary" on:click={saveExperience} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
          {:else}
            <button class="btn-primary" on:click={() => isEditMode = true}>수정</button>
          {/if}
        {:else}
          <button class="btn-secondary" on:click={() => goto('/admin/experiences')}>취소</button>
          <button class="btn-primary" on:click={saveExperience} disabled={saving}>
            {saving ? '등록 중...' : '등록'}
          </button>
        {/if}
      </div>
    </div>
    
    <!-- 체험단 정보 -->
    <div class="content-grid">
      <div class="main-content">
        <div class="section">
          <h2 class="section-title">기본 정보</h2>
          
          <div class="form-group">
            <label for="title">제목</label>
            <input
              id="title"
              type="text"
              bind:value={formData.title}
              disabled={!isEditMode}
              placeholder="체험단 제목을 입력하세요"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="category">카테고리</label>
              <select id="category" bind:value={formData.category} disabled={!isEditMode}>
                <option value="">선택하세요</option>
                {#each categoryOptions as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>
            
            <div class="form-group">
              <label for="type">유형</label>
              <select id="type" bind:value={formData.type} disabled={!isEditMode}>
                <option value="체험단">체험단</option>
                <option value="기자단">기자단</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="region">지역</label>
              <select id="region" bind:value={formData.region} disabled={!isEditMode}>
                <option value="">선택하세요</option>
                {#each regionOptions as region}
                  <option value={region}>{region}</option>
                {/each}
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="location">상세 주소</label>
            <input
              id="location"
              type="text"
              bind:value={formData.location}
              disabled={!isEditMode}
              placeholder="상세 주소를 입력하세요"
            />
          </div>
          
          <div class="form-group">
            <label for="content">내용</label>
            <textarea
              id="content"
              bind:value={formData.content}
              disabled={!isEditMode}
              rows="10"
              placeholder="체험단 내용을 입력하세요"
            ></textarea>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">일정 및 모집 정보</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="startDate">시작일</label>
              <input
                id="startDate"
                type="date"
                bind:value={formData.startDate}
                disabled={!isEditMode}
              />
            </div>
            
            <div class="form-group">
              <label for="endDate">종료일</label>
              <input
                id="endDate"
                type="date"
                bind:value={formData.endDate}
                disabled={!isEditMode}
              />
            </div>
            
            <div class="form-group">
              <label for="applicationDeadline">신청 마감일</label>
              <input
                id="applicationDeadline"
                type="date"
                bind:value={formData.applicationDeadline}
                disabled={!isEditMode}
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="maxParticipants">모집 인원</label>
              <input
                id="maxParticipants"
                type="number"
                bind:value={formData.maxParticipants}
                disabled={!isEditMode}
                min="0"
              />
            </div>
            
            <div class="form-group">
              <label for="requiredPoints">필요 포인트</label>
              <input
                id="requiredPoints"
                type="number"
                bind:value={formData.requiredPoints}
                disabled={!isEditMode}
                min="0"
              />
            </div>
            
            <div class="form-group">
              <label for="rewardPoints">지급 포인트</label>
              <input
                id="rewardPoints"
                type="number"
                bind:value={formData.rewardPoints}
                disabled={!isEditMode}
                min="0"
              />
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">추가 정보</h2>
          
          <div class="form-group">
            <label for="rewardDescription">제공 혜택</label>
            <textarea
              id="rewardDescription"
              bind:value={formData.rewardDescription}
              disabled={!isEditMode}
              rows="3"
              placeholder="제공되는 혜택을 입력하세요"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="requirements">참여 조건</label>
            <textarea
              id="requirements"
              bind:value={formData.requirements}
              disabled={!isEditMode}
              rows="3"
              placeholder="참여 조건을 입력하세요"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="companyName">업체명</label>
              <input
                id="companyName"
                type="text"
                bind:value={formData.companyName}
                disabled={!isEditMode}
                placeholder="업체명을 입력하세요"
              />
            </div>
            
            <div class="form-group">
              <label for="contactInfo">연락처</label>
              <input
                id="contactInfo"
                type="text"
                bind:value={formData.contactInfo}
                disabled={!isEditMode}
                placeholder="연락처를 입력하세요"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>태그</label>
            <div class="tags-container">
              {#each formData.tags as tag}
                <span class="tag">
                  {tag}
                  {#if isEditMode}
                    <button class="tag-remove" on:click={() => removeTag(tag)}>×</button>
                  {/if}
                </span>
              {/each}
              {#if isEditMode}
                <input
                  type="text"
                  class="tag-input"
                  placeholder="태그 입력 후 Enter"
                  on:keydown={addTag}
                />
              {/if}
            </div>
          </div>
        </div>
        
        <!-- 이미지 업로드 섹션 -->
        <div class="section">
          <h2 class="section-title">이미지</h2>
          
          <div class="form-group">
            <label>체험단 이미지</label>
            <ImageUpload 
              images={formData.images}
              maxImages={5}
              uploadType="experience"
              disabled={!isEditMode}
              on:change={(e) => handleImageChange(e.detail)}
            />
          </div>
        </div>
      </div>
      
      <!-- 사이드바 -->
      <div class="sidebar">
        {#if experienceId !== 'new'}
          <!-- 상태 정보 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">상태 정보</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">상태</span>
                <span class="status-badge {experience?.status}">{experience?.status}</span>
              </div>
              <div class="info-item">
                <span class="info-label">조회수</span>
                <span class="info-value">{experience?.views || 0}</span>
              </div>
              <div class="info-item">
                <span class="info-label">좋아요</span>
                <span class="info-value">{experience?.likes || 0}</span>
              </div>
              <div class="info-item">
                <span class="info-label">신청자</span>
                <span class="info-value">{experience?.currentParticipants || 0} / {experience?.maxParticipants || '∞'}</span>
              </div>
              {#if experience?.applicationDeadline}
                <div class="info-item">
                  <span class="info-label">마감까지</span>
                  <span class="info-value">{formatDDay(experience.applicationDeadline)}</span>
                </div>
              {/if}
            </div>
          </div>
          
          <!-- 신청자 목록 -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">신청자 목록 ({applications.length})</h3>
            <div class="applications-list">
              {#if applications.length > 0}
                {#each applications as application}
                  <div class="application-item">
                    <div class="application-info">
                      <p class="applicant-name">{application.userName}</p>
                      <p class="application-date">{formatRelativeTime(application.createdAt)}</p>
                    </div>
                    <div class="application-actions">
                      {#if application.status === 'pending'}
                        <button
                          class="btn-small approve"
                          on:click={() => updateApplicationStatus(application.id, 'approved')}
                        >
                          승인
                        </button>
                        <button
                          class="btn-small reject"
                          on:click={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          거절
                        </button>
                      {:else}
                        <span class="status-text {application.status}">
                          {application.status === 'approved' ? '승인됨' :
                           application.status === 'rejected' ? '거절됨' : '취소됨'}
                        </span>
                      {/if}
                    </div>
                  </div>
                {/each}
              {:else}
                <p class="no-applications">아직 신청자가 없습니다.</p>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .experience-detail {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .back-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;
  }
  
  .back-link:hover {
    color: #4b5563;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    gap: 1rem;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background-color: #5ce0c6;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background-color: #3aaa94;
  }
  
  .btn-secondary {
    background-color: white;
    color: #4b5563;
    border: 1px solid #e5e7eb;
  }
  
  .btn-secondary:hover {
    background-color: #f9fafb;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* 콘텐츠 그리드 */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
  }
  
  .main-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .section {
    background-color: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1.5rem 0;
  }
  
  /* 폼 스타일 */
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group:last-child {
    margin-bottom: 0;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }
  
  input,
  select,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }
  
  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #5ce0c6;
  }
  
  input:disabled,
  select:disabled,
  textarea:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
  
  /* 태그 */
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }
  
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    background-color: #e0f2fe;
    color: #0369a1;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }
  
  .tag-remove {
    background: none;
    border: none;
    color: #0369a1;
    cursor: pointer;
    font-size: 1.25rem;
    line-height: 1;
    padding: 0;
  }
  
  .tag-input {
    flex: 1;
    min-width: 150px;
    max-width: 300px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  /* 사이드바 */
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .sidebar-section {
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
  }
  
  .info-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .info-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .info-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
  }
  
  .status-badge {
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .status-badge.active {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  .status-badge.closed {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  /* 신청자 목록 */
  .applications-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .application-item {
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .application-info {
    min-width: 0;
  }
  
  .applicant-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
    margin: 0;
  }
  
  .application-date {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0.25rem 0 0 0;
  }
  
  .application-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-small.approve {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  .btn-small.approve:hover {
    background-color: #a7f3d0;
  }
  
  .btn-small.reject {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  .btn-small.reject:hover {
    background-color: #fecaca;
  }
  
  .status-text {
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .status-text.approved {
    color: #065f46;
  }
  
  .status-text.rejected {
    color: #991b1b;
  }
  
  .no-applications {
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
    padding: 1rem 0;
  }
  
  /* 로딩 */
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background-color: white;
    border-radius: 0.75rem;
    color: #9ca3af;
  }
  
  .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid #e5e7eb;
    border-top-color: #5ce0c6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
    
    .sidebar {
      order: -1;
    }
  }
  
  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
