<script>
  // 예시 콘텐츠 데이터
  const contents = [
    {
      id: 1,
      title: '디지털 마케팅 전략 가이드',
      image: '/images/content1.jpg',
      category: '가이드',
      date: '2025-04-10'
    },
    {
      id: 2,
      title: 'SNS 마케팅 성공 사례 분석',
      image: '/images/content2.jpg',
      category: '사례 연구',
      date: '2025-04-05'
    },
    {
      id: 3,
      title: '이메일 마케팅 최적화 방법',
      image: '/images/content3.jpg',
      category: '팁',
      date: '2025-03-28'
    },
    {
      id: 4,
      title: '마케팅 ROI 측정 방법',
      image: '/images/content4.jpg', 
      category: '가이드',
      date: '2025-03-15'
    },
    {
      id: 5,
      title: '콘텐츠 마케팅의 중요성',
      image: '/images/content5.jpg',
      category: '전략',
      date: '2025-03-08'
    },
    {
      id: 6,
      title: '효과적인 브랜딩 전략',
      image: '/images/content6.jpg',
      category: '전략',
      date: '2025-02-25'
    }
  ];
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each contents as content}
    <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div class="h-48 bg-gray-200 relative">
        <!-- 이미지 없을 경우를 대비한 기본 배경 -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-gray-500">이미지 준비 중</span>
        </div>
      </div>
      <div class="p-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-sky-600">{content.category}</span>
          <span class="text-xs text-gray-500">{content.date}</span>
        </div>
        <h3 class="text-lg font-semibold mb-2">{content.title}</h3>
        <a href="/content/{content.id}" class="text-sky-700 text-sm hover:underline">자세히 보기 →</a>
      </div>
    </div>
  {/each}
</div>

<div class="mt-8 text-center">
  <a href="/contents" class="inline-block bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors">
    모든 콘텐츠 보기
  </a>
</div>
