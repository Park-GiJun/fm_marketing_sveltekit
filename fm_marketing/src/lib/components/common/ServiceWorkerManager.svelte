<!-- src/lib/components/common/ServiceWorkerManager.svelte -->
<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { notificationStore } from '$lib/stores/notificationStore.js';
  
  let swRegistration = null;
  let updateAvailable = false;
  
  // 서비스 워커 등록
  async function registerServiceWorker() {
    if (!browser || !('serviceWorker' in navigator)) {
      console.log('Service Worker가 지원되지 않습니다.');
      return;
    }
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      swRegistration = registration;
      
      console.log('Service Worker 등록 성공:', registration.scope);
      
      // 업데이트 확인
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            updateAvailable = true;
            console.log('새로운 업데이트가 있습니다.');
          }
        });
      });
      
      // 푸시 알림 설정
      await setupPushNotifications(registration);
      
    } catch (error) {
      console.error('Service Worker 등록 실패:', error);
    }
  }
  
  // 푸시 알림 설정
  async function setupPushNotifications(registration) {
    if (!('PushManager' in window)) {
      console.log('Push API가 지원되지 않습니다.');
      return;
    }
    
    try {
      // 기존 구독 확인
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        console.log('기존 푸시 구독이 있습니다.');
        return;
      }
      
      // 푸시 알림 권한이 있는 경우에만 구독
      if (Notification.permission === 'granted') {
        await subscribeToPush(registration);
      }
      
    } catch (error) {
      console.error('푸시 알림 설정 실패:', error);
    }
  }
  
  // 푸시 구독
  async function subscribeToPush(registration) {
    try {
      // VAPID 키 (실제 운영 환경에서는 서버에서 받아와야 함)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0stCfNkG3jx_wfSU6nb-LsRQ-3Z-NLJb-6tJ7T7H_6tBJ0m-2bAUNK8M';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });
      
      console.log('푸시 구독 성공:', subscription);
      
      // 서버에 구독 정보 전송 (실제 구현 필요)
      await sendSubscriptionToServer(subscription);
      
    } catch (error) {
      console.error('푸시 구독 실패:', error);
    }
  }
  
  // VAPID 키 변환
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  // 서버로 구독 정보 전송
  async function sendSubscriptionToServer(subscription) {
    try {
      // 실제 구현에서는 API 엔드포인트로 전송
      console.log('구독 정보를 서버로 전송:', subscription);
      
      // 임시로 localStorage에 저장
      localStorage.setItem('pushSubscription', JSON.stringify(subscription));
      
    } catch (error) {
      console.error('구독 정보 전송 실패:', error);
    }
  }
  
  // 업데이트 적용
  function applyUpdate() {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      updateAvailable = false;
      window.location.reload();
    }
  }
  
  // 실시간 알림 시뮬레이션 (개발용)
  function simulateRealtimeNotifications() {
    if (!browser) return;
    
    // 10초마다 랜덤하게 알림 생성
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% 확률
        notificationStore.simulateRealTimeNotification();
      }
    }, 10000);
  }
  
  onMount(() => {
    registerServiceWorker();
    
    // 개발 환경에서만 실시간 알림 시뮬레이션
    if (import.meta.env.DEV) {
      simulateRealtimeNotifications();
    }
  });
</script>

<!-- 업데이트 알림 -->
{#if updateAvailable}
  <div class="update-notification">
    <div class="update-content">
      <span class="update-text">새로운 업데이트가 있습니다.</span>
      <button class="update-button" on:click={applyUpdate}>
        업데이트
      </button>
    </div>
  </div>
{/if}

<style>
  .update-notification {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    z-index: 9999;
    background-color: #1f2937;
    color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    animation: slideUp 0.3s ease-out;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .update-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
  
  .update-text {
    font-size: 0.875rem;
  }
  
  .update-button {
    background-color: #5ce0c6;
    color: #1f2937;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .update-button:hover {
    background-color: #4bc0a9;
  }
  
  @media (max-width: 640px) {
    .update-notification {
      left: 0.5rem;
      right: 0.5rem;
    }
  }
</style>
