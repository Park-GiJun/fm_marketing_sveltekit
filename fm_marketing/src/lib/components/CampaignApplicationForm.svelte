
<script>
  import { navigate } from '$app/navigation';
  import { applicationStore } from '$lib/stores/applicationStore';

  export let campaignId;
  export let onSuccess = undefined;
  export let onCancel = () => {};

  let formData = {
    blogUrl: '',
    reason: ''
  };
  let formErrors = {};
  let isSubmitting = false;
  let error;

  // Subscribe to the error from the store
  $: error = $applicationStore.error;

  function handleChange(e) {
    const { name, value } = e.target;
    formData[name] = value;
    
    // Clear specific field error when typing
    if (formErrors[name]) {
      delete formErrors[name];
      formErrors = formErrors; // Trigger reactivity
    }
  }
  
  function validateForm() {
    const errors = {};
    
    if (!formData.blogUrl.trim()) {
      errors.blogUrl = "블로그 URL을 입력해주세요";
    } else if (!/^(http|https):\/\/[^ "]+$/.test(formData.blogUrl)) {
      errors.blogUrl = "유효한 URL 형식이 아닙니다";
    }
    
    if (!formData.reason.trim()) {
      errors.reason = "지원 이유를 입력해주세요";
    } else if (formData.reason.length < 30) {
      errors.reason = "지원 이유는 최소 30자 이상 작성해주세요";
    }
    
    formErrors = errors;
    return Object.keys(errors).length === 0;
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
      isSubmitting = true;
      
      try {
        const result = await applicationStore.applyToCampaign(campaignId, formData);
        if (result) {
          if (onSuccess) {
            onSuccess(result);
          } else {
            navigate('/pc/blogger/applications');
          }
        }
      } catch (err) {
        console.error("Application submission error:", err);
      } finally {
        isSubmitting = false;
      }
    }
  }
</script>

<div class="bg-white p-6 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-6 text-sky-800">캠페인 지원하기</h2>
  
  {#if error}
    <div class="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
      <p class="font-medium">지원 중 오류가 발생했습니다</p>
      <p>{error}</p>
    </div>
  {/if}
  
  <form on:submit={handleSubmit}>
    <div class="mb-4">
      <label for="blogUrl" class="block mb-2 text-sm font-medium text-gray-700">
        블로그 URL
      </label>
      <input
        type="text"
        id="blogUrl"
        name="blogUrl"
        value={formData.blogUrl}
        on:input={handleChange}
        class="w-full px-3 py-2 border {formErrors.blogUrl ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="https://blog.naver.com/yourblog"
      />
      {#if formErrors.blogUrl}
        <p class="mt-1 text-sm text-red-600">{formErrors.blogUrl}</p>
      {/if}
    </div>
    
    <div class="mb-6">
      <label for="reason" class="block mb-2 text-sm font-medium text-gray-700">
        지원 이유
      </label>
      <textarea
        id="reason"
        name="reason"
        value={formData.reason}
        on:input={handleChange}
        rows="6"
        class="w-full px-3 py-2 border {formErrors.reason ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="이 캠페인에 지원하게 된 이유와 블로그 활동 내역을 자세히 작성해주세요..."
      ></textarea>
      {#if formErrors.reason}
        <p class="mt-1 text-sm text-red-600">{formErrors.reason}</p>
      {/if}
      <p class="mt-1 text-xs text-gray-500">
        최소 30자 이상 작성해주세요. 지원 이유와 블로그 활동 경험을 상세히 기술할수록
        지원 승인율이 높아집니다.
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
          지원하기
        {/if}
      </button>
    </div>
  </form>
</div>
