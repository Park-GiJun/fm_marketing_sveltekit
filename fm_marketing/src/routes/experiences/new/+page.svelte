<!-- 체험단 등록 페이지 (사용자용) -->
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/userStore.js';
  import { reviewApi } from '$lib/utils/api.js';
  import MainLayout from '$lib/components/layout/MainLayout.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import { toast } from '$lib/stores/toastStore.js';
  
  let isAdmin = false;
  let saving = false;
  
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
  
  // 체험단 저장
  async function saveExperience() {
    try {
      saving = true;
      
      // 유효성 검사
      if (!formData.title || !formData.content || !formData.category || !formData.region) {
        toast.error('필수 정보를 모두 입력해주세요.');
        return;
      }
      
      const response = await reviewApi.createReview(formData);
      toast.success('체험단이 등록되었습니다.');
      
      if (isAdmin) {
        goto(`/admin/experiences/${response.data.id}`);
      } else {
        goto(`/review/${response.data.id}`);
      }
      
    } catch (error) {
      console.error('체험단 저장 실패:', error);
      toast.error('체험단 저장에 실패했습니다.');
    } finally {
      saving = false;
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
  
  onMount(() => {
    // 관리자 권한 확인
    const unsubscribe = userStore.subscribe(state => {
      isAdmin = state.user?.role === 'admin';
      
      // 로그인하지 않은 경우 로그인 페이지로
      if (!state.isAuthenticated) {
        goto('/login?redirect=/experiences/new');
      }
    });
    
    return () => {
      unsubscribe();
    };
  });
</script>

<svelte:head>
  <title>체험단 등록 - FM마케팅</title>
</svelte:head>

<MainLayout>
  <div class="experience-form-container">
    <div class="page-header">
      <h1 class="page-title">체험단 등록</h1>
      <p class="page-description">새로운 체험단을 등록해보세요.</p>
    </div>
    
    <form class="experience-form" on:submit|preventDefault={saveExperience}>
      <!-- 기본 정보 섹션 -->
      <div class="form-section">
        <h2 class="section-title">기본 정보</h2>
        
        <div class="form-group">
          <label for="title">제목 *</label>
          <input
            id="title"
            type="text"
            bind:value={formData.title}
            placeholder="체험단 제목을 입력하세요"
            required
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="category">카테고리 *</label>
            <select id="category" bind:value={formData.category} required>
              <option value="">선택하세요</option>
              {#each categoryOptions as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
          
          <div class="form-group">
            <label for="type">유형 *</label>
            <select id="type" bind:value={formData.type} required>
              <option value="체험단">체험단</option>
              <option value="기자단">기자단</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="region">지역 *</label>
            <select id="region" bind:value={formData.region} required>
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
            placeholder="상세 주소를 입력하세요"
          />
        </div>
        
        <div class="form-group">
          <label for="content">내용 *</label>
          <textarea
            id="content"
            bind:value={formData.content}
            rows="10"
            placeholder="체험단 내용을 입력하세요"
            required
          ></textarea>
        </div>
      </div>
      
      <!-- 일정 및 모집 정보 섹션 -->
      <div class="form-section">
        <h2 class="section-title">일정 및 모집 정보</h2>
        
        <div class="form-row">
          <div class="form-group">
            <label for="startDate">시작일</label>
            <input
              id="startDate"
              type="date"
              bind:value={formData.startDate}
            />
          </div>
          
          <div class="form-group">
            <label for="endDate">종료일</label>
            <input
              id="endDate"
              type="date"
              bind:value={formData.endDate}
            />
          </div>
          
          <div class="form-group">
            <label for="applicationDeadline">신청 마감일</label>
            <input
              id="applicationDeadline"
              type="date"
              bind:value={formData.applicationDeadline}
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
              min="0"
              placeholder="0명 (무제한)"
            />
          </div>
          
          <div class="form-group">
            <label for="requiredPoints">필요 포인트</label>
            <input
              id="requiredPoints"
              type="number"
              bind:value={formData.requiredPoints}
              min="0"
              placeholder="0 포인트"
            />
          </div>
          
          <div class="form-group">
            <label for="rewardPoints">지급 포인트</label>
            <input
              id="rewardPoints"
              type="number"
              bind:value={formData.rewardPoints}
              min="0"
              placeholder="0 포인트"
            />
          </div>
        </div>
      </div>
      
      <!-- 추가 정보 섹션 -->
      <div class="form-section">
        <h2 class="section-title">추가 정보</h2>
        
        <div class="form-group">
          <label for="rewardDescription">제공 혜택</label>
          <textarea
            id="rewardDescription"
            bind:value={formData.rewardDescription}
            rows="3"
            placeholder="제공되는 혜택을 입력하세요"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="requirements">참여 조건</label>
          <textarea
            id="requirements"
            bind:value={formData.requirements}
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
              placeholder="업체명을 입력하세요"
            />
          </div>
          
          <div class="form-group">
            <label for="contactInfo">연락처</label>
            <input
              id="contactInfo"
              type="text"
              bind:value={formData.contactInfo}
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
                <button type="button" class="tag-remove" on:click={() => removeTag(tag)}>×</button>
              </span>
            {/each}
            <input
              type="text"
              class="tag-input"
              placeholder="태그 입력 후 Enter"
              on:keydown={addTag}
            />
          </div>
        </div>
      </div>
      
      <!-- 폼 액션 -->
      <div class="form-actions">
        <Button 
          type="button" 
          variant="outline" 
          size="lg" 
          on:click={() => window.history.back()}
        >
          취소
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          disabled={saving}
        >
          {saving ? '등록 중...' : '등록하기'}
        </Button>
      </div>
    </form>
  </div>
</MainLayout>

<style>
  .experience-form-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  
  .page-description {
    font-size: 1rem;
    color: #6b7280;
  }
  
  .experience-form {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  .form-section {
    margin-bottom: 3rem;
  }
  
  .form-section:last-of-type {
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1.5rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #5ce0c6;
    box-shadow: 0 0 0 2px rgba(92, 224, 198, 0.2);
  }
  
  /* 태그 스타일 */
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
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
  }
  
  /* 폼 액션 */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }
  
  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .form-actions {
      flex-direction: column-reverse;
    }
  }
</style>
