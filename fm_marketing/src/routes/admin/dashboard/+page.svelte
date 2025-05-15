
<script>
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/authStore';
  import { campaignStore } from '$lib/stores/campaignStore';
  import { applicationStore } from '$lib/stores/applicationStore';

  let user;
  let campaigns = [];
  let applications = [];
  let campaignsLoading = true;
  let applicationsLoading = true;
  
  let stats = {
    totalCampaigns: 0,
    activeCampaigns: 0,
    pendingApplications: 0,
    totalStores: 0,
    totalBloggers: 0
  };

  // Subscribe to auth store for user data
  $: user = $authStore.user;

  onMount(async () => {
    // Fetch campaigns data
    campaignsLoading = true;
    campaigns = await campaignStore.fetchCampaigns();
    campaignsLoading = false;
    
    // For demonstration, fetch applications for the first campaign if available
    if (campaigns.length > 0) {
      applicationsLoading = true;
      applications = await applicationStore.fetchCampaignApplications(campaigns[0].id);
      applicationsLoading = false;
    }
    
    // Mock statistics data (in a real app, this would come from API)
    stats = {
      totalCampaigns: 24,
      activeCampaigns: 12,
      pendingApplications: 47,
      totalStores: 15,
      totalBloggers: 86
    };
  });

  function handleApproveApplication(applicationId) {
    console.log(`Approve application ${applicationId}`);
  }

  function handleRejectApplication(applicationId) {
    console.log(`Reject application ${applicationId}`);
  }
</script>

<div class="p-6">
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-gray-800">관리자 대시보드</h1>
    <p class="text-gray-600">안녕하세요, {user?.name || '관리자'}님! 오늘의 현황을 확인하세요.</p>
  </div>
  
  <!-- Statistics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-sky-100 text-sky-600 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500">전체 캠페인</p>
          <p class="text-xl font-semibold">{stats.totalCampaigns}</p>
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
          <p class="text-sm text-gray-500">활성 캠페인</p>
          <p class="text-xl font-semibold">{stats.activeCampaigns}</p>
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
          <p class="text-sm text-gray-500">대기 중인 지원</p>
          <p class="text-xl font-semibold">{stats.pendingApplications}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500">등록된 매장</p>
          <p class="text-xl font-semibold">{stats.totalStores}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500">등록된 블로거</p>
          <p class="text-xl font-semibold">{stats.totalBloggers}</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Recent Campaigns -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
    <div class="flex justify-between items-center p-6 border-b border-gray-100">
      <h2 class="text-lg font-semibold text-gray-800">최근 캠페인</h2>
      <a 
        href="/pc/admin/campaigns" 
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
              제목
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              매장
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              신청 기한
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              신청/승인
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#if campaignsLoading}
            <tr>
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                데이터를 불러오는 중...
              </td>
            </tr>
          {:else if campaigns.length === 0}
            <tr>
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                등록된 캠페인이 없습니다.
              </td>
            </tr>
          {:else}
            {#each campaigns.slice(0, 5) as campaign}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <a 
                    href="/pc/admin/campaigns/{campaign.id}"
                    class="text-sky-600 hover:text-sky-800 font-medium"
                  >
                    {campaign.title}
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                  {campaign.storeName}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                  {new Date(campaign.applicationDeadline).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                  {campaign.appliedCount} / {campaign.approvedCount}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    {new Date(campaign.applicationDeadline) > new Date() 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'}"
                  >
                    {new Date(campaign.applicationDeadline) > new Date() ? '모집중' : '모집완료'}
                  </span>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- Recent Applications -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-100">
    <div class="flex justify-between items-center p-6 border-b border-gray-100">
      <h2 class="text-lg font-semibold text-gray-800">최근 지원자</h2>
      <a 
        href="/pc/admin/applications" 
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
              블로거
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              캠페인
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              신청일
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              관리
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#if applicationsLoading}
            <tr>
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                데이터를 불러오는 중...
              </td>
            </tr>
          {:else if applications.length === 0}
            <tr>
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                지원자가 없습니다.
              </td>
            </tr>
          {:else}
            {#each applications.slice(0, 5) as application}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 bg-sky-100 rounded-full flex items-center justify-center">
                      <span class="text-sky-600 font-medium">
                        {application.bloggerName?.charAt(0) || 'B'}
                      </span>
                    </div>
                    <div class="ml-3">
                      <p class="text-gray-900 font-medium">{application.bloggerName}</p>
                      <p class="text-gray-500 text-xs">{application.bloggerEmail}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                  {application.campaignTitle}
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
                  <a 
                    href="/pc/admin/applications/{application.id}"
                    class="text-sky-600 hover:text-sky-800 mr-3"
                  >
                    보기
                  </a>
                  {#if application.status === 'PENDING'}
                    <button 
                      class="text-green-600 hover:text-green-800 mr-3"
                      on:click={() => handleApproveApplication(application.id)}
                    >
                      승인
                    </button>
                    <button 
                      class="text-red-600 hover:text-red-800"
                      on:click={() => handleRejectApplication(application.id)}
                    >
                      거절
                    </button>
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
