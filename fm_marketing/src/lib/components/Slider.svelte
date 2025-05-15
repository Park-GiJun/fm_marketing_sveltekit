<script>
  import { onMount } from 'svelte';
  
  let currentSlide = 0;
  let slides = [
    {
      image: '/images/slider1.jpg',
      title: '효과적인 마케팅 전략',
      description: '귀사의 비즈니스에 맞는 최적의 마케팅 전략을 제공합니다.',
      cta: '자세히 보기'
    },
    {
      image: '/images/slider2.jpg',
      title: '다양한 성공 사례',
      description: '다양한 업종에서의 성공적인 마케팅 사례를 확인하세요.',
      cta: '사례 보기'
    },
    {
      image: '/images/slider3.jpg',
      title: '전문 마케팅 컨설팅',
      description: '전문가의 컨설팅으로 비즈니스 성장을 가속화하세요.',
      cta: '상담 신청'
    }
  ];
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  }
  
  onMount(() => {
    const interval = setInterval(nextSlide, 5000); // 5초마다 슬라이드 자동 전환
    
    return () => {
      clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 제거
    };
  });
</script>

<div class="relative w-full h-[500px] overflow-hidden bg-gray-200">
  <!-- 슬라이드 이미지가 없는 경우를 대비한 기본 배경 -->
  <div class="absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-500"
       style="opacity: {currentSlide === 0 ? '1' : '0'}">
    <h2 class="text-4xl font-bold text-sky-800 mb-4 text-center">{slides[0].title}</h2>
    <p class="text-xl text-gray-700 mb-6 text-center max-w-2xl">{slides[0].description}</p>
    <button class="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors">
      {slides[0].cta}
    </button>
  </div>
  
  {#each slides.slice(1) as slide, i}
    <div class="absolute inset-0 flex flex-col items-center justify-center p-8 transition-opacity duration-500"
         style="opacity: {currentSlide === i + 1 ? '1' : '0'}">
      <h2 class="text-4xl font-bold text-sky-800 mb-4 text-center">{slide.title}</h2>
      <p class="text-xl text-gray-700 mb-6 text-center max-w-2xl">{slide.description}</p>
      <button class="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors">
        {slide.cta}
      </button>
    </div>
  {/each}
  
  <!-- 네비게이션 버튼 -->
  <button 
    class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
    on:click={prevSlide}
    aria-label="이전 슬라이드">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  
  <button 
    class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
    on:click={nextSlide}
    aria-label="다음 슬라이드">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
  
  <!-- 인디케이터 -->
  <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
    {#each slides as _, i}
      <button 
        class="w-3 h-3 rounded-full {currentSlide === i ? 'bg-sky-600' : 'bg-gray-300'}"
        on:click={() => currentSlide = i}
        aria-label="슬라이드 {i+1}로 이동">
      </button>
    {/each}
  </div>
</div>
