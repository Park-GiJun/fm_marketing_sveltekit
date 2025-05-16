// src/lib/stores/communityStore.js
import { writable } from 'svelte/store';

function createCommunityStore() {
  const { subscribe, set, update } = writable({
    posts: [],
    loading: false,
    error: null
  });

  // 더미 커뮤니티 게시글 데이터
  const dummyPosts = [
    {
      id: 1,
      title: '지난 주말 서울 카페 체험단 다녀왔습니다!',
      content: '안녕하세요~ 지난 주말에 FM마케팅을 통해 서울 강남구에 있는 000 카페 체험단으로 다녀왔습니다. 분위기도 너무 좋고 커피 맛도 일품이었어요. 체험단 추천합니다!',
      author: {
        id: 1,
        nickname: '커피러버',
        profileImage: '/images/users/profile1.jpg'
      },
      category: '체험 후기',
      createdAt: '2025-05-18T14:30:00',
      updatedAt: null,
      likes: 24,
      views: 142,
      commentCount: 8,
      images: ['/images/community/cafe1.jpg', '/images/community/cafe2.jpg'],
      tags: ['카페', '서울', '체험단후기'],
      comments: [
        {
          id: 1,
          content: '와~ 정말 분위기 좋아 보이네요! 저도 신청해볼게요!',
          author: {
            id: 2,
            nickname: '맛집탐험가',
            profileImage: '/images/users/profile2.jpg'
          },
          createdAt: '2025-05-18T15:20:00',
          isDeleted: false
        },
        {
          id: 2,
          content: '사진 너무 예쁘게 찍으셨네요. 어떤 카메라 쓰시나요?',
          author: {
            id: 3,
            nickname: '사진작가',
            profileImage: '/images/users/profile3.jpg'
          },
          createdAt: '2025-05-18T16:45:00',
          isDeleted: false
        }
      ]
    },
    {
      id: 2,
      title: '체험단 신청할 때 팁 공유해요!',
      content: '안녕하세요! 저는 FM마케팅에서 체험단 활동을 1년 정도 하고 있는데요, 체험단 신청할 때 몇 가지 팁을 공유하려고 합니다. 첫째, 프로필을 상세하게 작성하세요. 둘째, 지원 이유를 구체적으로 적으세요. 셋째, 이전 체험 후기가 있다면 링크를 꼭 첨부하세요!',
      author: {
        id: 4,
        nickname: '체험왕',
        profileImage: '/images/users/profile4.jpg'
      },
      category: '정보 공유',
      createdAt: '2025-05-17T10:15:00',
      updatedAt: null,
      likes: 56,
      views: 230,
      commentCount: 12,
      images: [],
      tags: ['체험단', '팁', '정보공유'],
      comments: [
        {
          id: 3,
          content: '정말 유용한 정보 감사합니다! 저는 처음 도전해보려고 하는데 큰 도움이 되었어요.',
          author: {
            id: 5,
            nickname: '체험단초보',
            profileImage: '/images/users/profile5.jpg'
          },
          createdAt: '2025-05-17T11:30:00',
          isDeleted: false
        }
      ]
    },
    {
      id: 3,
      title: '인천 맛집 체험단 모집 중인가요?',
      content: '혹시 인천 지역 맛집 체험단 모집 중인 곳 있을까요? 인천에 거주 중인데 지역 맛집 체험단에 참여해보고 싶네요. 정보 부탁드립니다!',
      author: {
        id: 6,
        nickname: '인천사람',
        profileImage: '/images/users/profile6.jpg'
      },
      category: '질문',
      createdAt: '2025-05-16T18:20:00',
      updatedAt: null,
      likes: 8,
      views: 95,
      commentCount: 5,
      images: [],
      tags: ['인천', '맛집', '체험단모집'],
      comments: [
        {
          id: 4,
          content: '지금 인천 송도에 새로 오픈한 레스토랑 체험단 모집 중인 것 같던데요! 체험단 목록에서 확인해보세요.',
          author: {
            id: 7,
            nickname: '정보통',
            profileImage: '/images/users/profile7.jpg'
          },
          createdAt: '2025-05-16T19:10:00',
          isDeleted: false
        }
      ]
    },
    {
      id: 4,
      title: '뷰티 제품 체험단 후기 - 000 크림',
      content: '안녕하세요, 이번에 FM마케팅을 통해 000 브랜드의 신제품 크림을 체험해봤어요. 일주일 정도 사용해봤는데 확실히 피부가 촉촉해지는 느낌이에요. 사진과 함께 상세 후기 공유합니다!',
      author: {
        id: 8,
        nickname: '뷰티블로거',
        profileImage: '/images/users/profile8.jpg'
      },
      category: '체험 후기',
      createdAt: '2025-05-15T12:40:00',
      updatedAt: null,
      likes: 42,
      views: 188,
      commentCount: 15,
      images: ['/images/community/beauty1.jpg', '/images/community/beauty2.jpg', '/images/community/beauty3.jpg'],
      tags: ['뷰티', '스킨케어', '체험단후기'],
      comments: []
    },
    {
      id: 5,
      title: '체험단 활동 인증 방법 질문이요',
      content: '안녕하세요! 처음으로 체험단에 선정되었는데, 체험 후 인증은 어떻게 하는 건가요? 블로그에 포스팅하고 링크만 올리면 되나요? 아니면 여기 커뮤니티에도 후기를 올려야 하나요?',
      author: {
        id: 9,
        nickname: '체험단신입',
        profileImage: '/images/users/profile9.jpg'
      },
      category: '질문',
      createdAt: '2025-05-14T09:30:00',
      updatedAt: null,
      likes: 12,
      views: 103,
      commentCount: 7,
      images: [],
      tags: ['체험단', '인증방법', '질문'],
      comments: []
    }
  ];

  return {
    subscribe,
    
    // 커뮤니티 게시글 목록 불러오기
    fetchPosts: (category = null) => {
      update(state => ({ ...state, loading: true }));
      
      return new Promise((resolve) => {
        setTimeout(() => {
          let filteredPosts = [...dummyPosts];
          
          if (category) {
            filteredPosts = filteredPosts.filter(post => post.category === category);
          }
          
          // 최신순 정렬
          filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          update(state => ({
            ...state,
            posts: filteredPosts,
            loading: false
          }));
          
          resolve(filteredPosts);
        }, 500);
      });
    },
    
    // 게시글 상세 조회
    getPostById: (id) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const post = dummyPosts.find(p => p.id === parseInt(id));
          
          if (post) {
            // 조회수 증가 (실제로는 서버에서 처리)
            post.views += 1;
          }
          
          resolve(post);
        }, 300);
      });
    },
    
    // 게시글 작성
    createPost: (postData) => {
      update(state => ({ ...state, loading: true }));
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const newPost = {
            id: dummyPosts.length + 1,
            ...postData,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            likes: 0,
            views: 0,
            commentCount: 0,
            comments: []
          };
          
          dummyPosts.unshift(newPost);
          
          update(state => ({
            ...state,
            posts: [newPost, ...state.posts],
            loading: false
          }));
          
          resolve(newPost);
        }, 500);
      });
    },
    
    // 댓글 작성
    addComment: (postId, comment) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const post = dummyPosts.find(p => p.id === parseInt(postId));
          
          if (post) {
            const newComment = {
              id: post.comments.length + 1,
              ...comment,
              createdAt: new Date().toISOString(),
              isDeleted: false
            };
            
            post.comments.push(newComment);
            post.commentCount += 1;
            
            resolve(newComment);
          } else {
            resolve(null);
          }
        }, 300);
      });
    },
    
    // 게시글 좋아요
    likePost: (postId) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const post = dummyPosts.find(p => p.id === parseInt(postId));
          
          if (post) {
            post.likes += 1;
            resolve(post.likes);
          } else {
            resolve(null);
          }
        }, 200);
      });
    }
  };
}

export const communityStore = createCommunityStore();
