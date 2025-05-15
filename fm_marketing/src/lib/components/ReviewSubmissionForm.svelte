
<script>
  import { navigate } from '$app/navigation';
  import { applicationStore } from '$lib/stores/applicationStore';

  export let campaignId;
  export let onSuccess = undefined;
  export let onCancel = () => {};

  let reviewUrl = '';
  let formError = '';
  let isSubmitting = false;
  let error;

  // Subscribe to the error from the store
  $: error = $applicationStore.error;

  function handleChange(e) {
    reviewUrl = e.target.value;
    
    // Clear error when typing
    if (formError) {
      formError = '';
    }
  }
  
  function validateForm() {
    if (!reviewUrl.trim()) {
      formError = "리뷰 URL을 입력해주세요";
      return false;
    } 
    
    // Basic URL validation
    if (!/^(http|https):\/\/[^ "]+$/.test(reviewUrl)) {
      formError = "유효한 URL 형식이 아닙니다";
      return false;
    }
    
    return true;
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
      isSubmitting = true;
      
      try {
        const result = await applicationStore.submitReview(campaignId, { reviewUrl });
        if (result) {
          if (onSuccess) {
            onSuccess(result);
          } else {
            navigate('/pc/blogger/applications');
          }
        }
      } catch (err) {
        console.error("Review submission error:", err);
      } finally {
        isSubmitting = false;
      }
    }
  }
</script>

<div class="bg-white p-6 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-4 text-sky-800">리뷰 제출하기</h2>
  <p class="mb-6 text-gray-600">
    블로그에 작성한 리뷰 URL을 입력해주세요. 승인된 후에는 수정이 불가능하므로 정확한 URL을 입력해주세요.
  </p>
  
  {#if error}
    <div class="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
      <p class="font-medium">제출 중 오류가 발생했습니다</p>
      <p>{error}</p>
    </div>
  {/if}
  
  <form on:submit={handleSubmit}>
    <div class="mb-6">
      <label for="reviewUrl" class="block mb-2 text-sm font-medium text-gray-700">
        블로그 리뷰 URL
      </label>
      <input
        type="text"
        id="reviewUrl"
        bind:value={reviewUrl}
        on:input={handleChange}
        class="w-full px-3 py-2 border {formError ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="https://blog.naver.com/yourblog/123456789"
      />
      {#if formError}
        <p class="mt-1 text-sm text-red-600">{formError}</p>
      {/if}
      <p class="mt-1 text-xs text-gray-500">
        네이버 블로그, 티스토리, 브런치 등 어떤 블로그 플랫폼이든 리뷰가 작성된 페이지의 정확한 URL을 입력해주세요.
      </p>
    </div>
    
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        on:click={onCancel}
        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        취소
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        class="px-4 py-2 rounded-md text-white {
          isSubmitting ? 'bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'
        } focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        {#if isSubmitting}
          <span class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            제출 중...
          </span>
        {:else}
          리뷰 제출하기
        {/if}
      </button>
    </div>
  </form>
</div>
