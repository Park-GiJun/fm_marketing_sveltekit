// 커뮤니티 게시글 상세 조회/수정/삭제 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { CommunityPost } from '$lib/server/entities/CommunityPost.js';
import { Comment } from '$lib/server/entities/Comment.js';
import { User, UserRole } from '$lib/server/entities/User.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params }) {
	try {
		const { id } = params;

		const dataSource = await getDataSource();
		const postRepository = dataSource.getRepository(CommunityPost);

		// 게시글 조회
		const post = await postRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.author', 'author')
			.leftJoinAndSelect('post.comments', 'comments')
			.leftJoinAndSelect('comments.author', 'commentAuthor')
			.where('post.id = :id', { id: parseInt(id) })
			.andWhere('post.isDeleted = :isDeleted', { isDeleted: false })
			.orderBy('comments.createdAt', 'ASC')
			.getOne();

		if (!post) {
			return json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
		}

		// 조회수 증가
		await postRepository.update(id, { 
			views: () => 'views + 1' 
		});
		post.views += 1;

		// 삭제되지 않은 댓글만 필터링
		const activeComments = post.comments?.filter(comment => !comment.isDeleted) || [];

		const result = {
			...post,
			comments: activeComments,
			commentCount: activeComments.length,
			authorName: post.author?.name || post.author?.nickname
		};

		return json(result);

	} catch (error) {
		console.error('커뮤니티 게시글 상세 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function PUT({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);
		
		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const dataSource = await getDataSource();
		const postRepository = dataSource.getRepository(CommunityPost);

		// 게시글 존재 확인 및 권한 체크
		const post = await postRepository.findOne({
			where: { id: parseInt(id), isDeleted: false },
			select: ['id', 'authorId']
		});

		if (!post) {
			return json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (user.role !== UserRole.ADMIN && user.id !== post.authorId) {
			return json({ error: '수정 권한이 없습니다.' }, { status: 403 });
		}

		const data = await request.json();
		const { title, content, category, tags, images } = data;

		// 업데이트 데이터 준비
		const updateData = {
			title,
			content,
			category,
			tags: tags || [],
			images: images || []
		};

		await postRepository.update(id, updateData);

		const updatedPost = await postRepository.findOne({
			where: { id: parseInt(id) },
			relations: ['author']
		});

		return json(updatedPost);

	} catch (error) {
		console.error('커뮤니티 게시글 수정 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function DELETE({ params, request }) {
	try {
		const { id } = params;
		const user = await getUserFromRequest(request);
		
		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const dataSource = await getDataSource();
		const postRepository = dataSource.getRepository(CommunityPost);

		// 게시글 존재 확인 및 권한 체크
		const post = await postRepository.findOne({
			where: { id: parseInt(id), isDeleted: false },
			select: ['id', 'authorId']
		});

		if (!post) {
			return json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (user.role !== UserRole.ADMIN && user.id !== post.authorId) {
			return json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
		}

		// 소프트 삭제 (실제 삭제 대신 isDeleted 플래그 설정)
		await postRepository.update(id, { isDeleted: true });

		return json({ message: '게시글이 삭제되었습니다.' });

	} catch (error) {
		console.error('커뮤니티 게시글 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
