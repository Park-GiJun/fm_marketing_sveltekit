
<script>
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/authStore';
  import { applicationStore } from '$lib/stores/applicationStore';

  let user;
  let applications = [];
  let isLoading = true;
  
  let stats = {
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    completedReviews: 0
  };

  // Subscribe to auth store for user data
  $: user = $authStore.user;

  onMount(async () => {
    isLoading = true;
    applications = await applicationStore.fetchMyApplications();
    isLoading = false;
    
    // This would normally be calculated from the applications data
    stats = {
      totalApplications: 15,
      approvedApplications: 7,
      pendingApplications: 5,
      completedReviews: 3
    };
  });
</script>

<div class="p-6">
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-gray-800">블로거 대시보드</h1>
    <p class="text-gray-600">안녕하세요, {user?.name || '블로거'}님! 캠페인 참여 현황을 확인하세요.</p>
  </div>
  
  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-sky-100 text-sky-600 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500">전체 지원</p>
          <p class="text-xl font-semibold">{stats.totalApplications}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500">승인됨</p>
          <p class="text-xl font-semibold">{stats.approvedApplications}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500">대기중</p>
          <p class="text-xl font-semibold">{stats.pendingApplications}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500">작성한 리뷰</p>
          <p class="text-xl font-semibold">{stats.completedReviews}</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Quick Actions -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 mb-8 p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">빠른 액션</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <a 
        href="/pc/blogger/campaigns"
        class="bg-sky-50 hover:bg-sky-100 p-4 rounded-lg flex items-center text-sky-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>신규 캠페인 찾기</span>
      </a>
      
      <a 
        href="/pc/blogger/applications"
        class="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex items-center text-green-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>지원 현황 보기</span>
      </a>
      
      <a 
        href="/pc/blogger/profile"
        class="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex items-center text-purple-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>내 프로필 수정</span>
      </a>
    </div>
  </div>
  
  <!-- My Applications -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-100">
    <div class="flex justify-between items-center p-6 border-b border-gray-100">
      <h2 class="text-lg font-semibold text-gray-800">최근 지원 현황</h2>
      <a 
        href="/pc/blogger/applications" 
        class="text-sky-600 hover:text-sky-800 text-sm font-medium"
      >
        모두 보기
      </a>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              캠페인
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              매장
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              신청일
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              액션
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#if isLoading}
            <tr>
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                데이터를 불러오는 중...
              </td>
            </tr>
          {:else if applications.length === 0}
            <tr>
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                아직 지원한 캠페인이 없습니다.
              </td>
            </tr>
          {:else}
            {#each applications.slice(0, 5) as application}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <a 
                    href="/pc/blogger/campaigns/{application.campaignId}"
                    class="text-sky-600 hover:text-sky-800 font-medium"
                  >
                    {application.campaignTitle}
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                  {application.storeName}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                  {new Date(application.createdAt).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    {application.status === 'PENDING' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : application.status === 'APPROVED' 
                      ? 'bg-green-100 text-green-800' 
                      : application.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'}"
                  >
                    {application.status === 'PENDING' 
                      ? '대기중' 
                      : application.status === 'APPROVED' 
                      ? '승인됨' 
                      : application.status === 'REJECTED'
                      ? '거절됨'
                      : '완료됨'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  {#if application.status === 'APPROVED' && !application.reviewUrl}
                    <a 
                      href="/pc/blogger/campaigns/{application.campaignId}/review"
                      class="text-sky-600 hover:text-sky-800"
                    >
                      리뷰 작성
                    </a>
                  {/if}
                  {#if application.status === 'COMPLETED'}
                    <a 
                      href={application.reviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sky-600 hover:text-sky-800"
                    >
                      리뷰 보기
                    </a>
                  {/if}
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
