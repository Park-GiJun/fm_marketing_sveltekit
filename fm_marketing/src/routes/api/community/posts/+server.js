// 커뮤니티 게시글 목록 조회/생성 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { CommunityPost } from '$lib/server/entities/CommunityPost.js';
import { User } from '$lib/server/entities/User.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ url }) {
	try {
		const category = url.searchParams.get('category') || '';
		const sort = url.searchParams.get('sort') || 'latest';
		const search = url.searchParams.get('search') || '';
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '20');
		const offset = (page - 1) * limit;

		const dataSource = await getDataSource();
		const postRepository = dataSource.getRepository(CommunityPost);

		// 쿼리 빌더 생성
		let queryBuilder = postRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.author', 'author')
			.leftJoin('post.comments', 'comments')
			.addSelect('COUNT(comments.id)', 'commentCount')
			.where('post.isDeleted = :isDeleted', { isDeleted: false })
			.groupBy('post.id')
			.addGroupBy('author.id');

		// 카테고리 필터
		if (category && category !== '전체') {
			queryBuilder.andWhere('post.category = :category', { category });
		}

		// 검색어 필터
		if (search) {
			queryBuilder.andWhere('(post.title LIKE :search OR post.content LIKE :search)', 
				{ search: `%${search}%` });
		}

		// 정렬 조건
		switch (sort) {
			case 'latest':
				queryBuilder.orderBy('post.createdAt', 'DESC');
				break;
			case 'popular':
				queryBuilder.orderBy('post.views', 'DESC')
					.addOrderBy('post.likes', 'DESC');
				break;
			case 'comments':
				queryBuilder.orderBy('commentCount', 'DESC');
				break;
			default:
				queryBuilder.orderBy('post.createdAt', 'DESC');
		}

		// 총 개수 조회
		const totalQueryBuilder = postRepository
			.createQueryBuilder('post')
			.where('post.isDeleted = :isDeleted', { isDeleted: false });

		if (category && category !== '전체') {
			totalQueryBuilder.andWhere('post.category = :category', { category });
		}
		if (search) {
			totalQueryBuilder.andWhere('(post.title LIKE :search OR post.content LIKE :search)', 
				{ search: `%${search}%` });
		}

		const total = await totalQueryBuilder.getCount();

		// 데이터 조회
		const rawResults = await queryBuilder
			.offset(offset)
			.limit(limit)
			.getRawAndEntities();

		const posts = rawResults.entities.map((post, index) => ({
			...post,
			commentCount: parseInt(rawResults.raw[index].commentCount) || 0,
			authorName: post.author?.name || post.author?.nickname
		}));

		return json({
			posts,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		});

	} catch (error) {
		console.error('커뮤니티 게시글 목록 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const user = await getUserFromRequest(request);
		
		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const data = await request.json();
		const { title, content, category, tags, images } = data;

		// 필수 필드 검증
		if (!title || !content || !category) {
			return json({ error: '필수 정보를 모두 입력해주세요.' }, { status: 400 });
		}

		const dataSource = await getDataSource();
		const postRepository = dataSource.getRepository(CommunityPost);

		const post = postRepository.create({
			title,
			content,
			category,
			authorId: user.id,
			tags: tags || [],
			images: images || []
		});

		const savedPost = await postRepository.save(post);

		// 작성자 정보와 함께 반환
		const postWithAuthor = await postRepository.findOne({
			where: { id: savedPost.id },
			relations: ['author']
		});

		return json(postWithAuthor, { status: 201 });

	} catch (error) {
		console.error('커뮤니티 게시글 생성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
