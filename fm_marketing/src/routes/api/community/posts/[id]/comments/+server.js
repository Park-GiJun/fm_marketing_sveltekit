// 댓글 목록 조회/생성 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { Comment } from '$lib/server/entities/Comment.js';
import { CommunityPost } from '$lib/server/entities/CommunityPost.js';
import { User } from '$lib/server/entities/User.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params }) {
	try {
		const { id: postId } = params;

		const dataSource = await getDataSource();
		const commentRepository = dataSource.getRepository(Comment);

		const comments = await commentRepository
			.createQueryBuilder('comment')
			.leftJoinAndSelect('comment.author', 'author')
			.leftJoinAndSelect('comment.children', 'children')
			.leftJoinAndSelect('children.author', 'childAuthor')
			.where('comment.postId = :postId', { postId: parseInt(postId) })
			.andWhere('comment.isDeleted = :isDeleted', { isDeleted: false })
			.andWhere('comment.parentId IS NULL') // 최상위 댓글만
			.orderBy('comment.createdAt', 'ASC')
			.addOrderBy('children.createdAt', 'ASC')
			.getMany();

		// 삭제되지 않은 대댓글만 필터링
		const filteredComments = comments.map(comment => ({
			...comment,
			children: comment.children?.filter(child => !child.isDeleted) || []
		}));

		return json(filteredComments);

	} catch (error) {
		console.error('댓글 목록 조회 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function POST({ params, request }) {
	try {
		const { id: postId } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const { content, parentId } = await request.json();

		if (!content || !content.trim()) {
			return json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 });
		}

		const dataSource = await getDataSource();
		const commentRepository = dataSource.getRepository(Comment);
		const postRepository = dataSource.getRepository(CommunityPost);

		// 게시글 존재 확인
		const post = await postRepository.findOne({
			where: { id: parseInt(postId), isDeleted: false }
		});

		if (!post) {
			return json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
		}

		// 부모 댓글 확인 (대댓글인 경우)
		if (parentId) {
			const parentComment = await commentRepository.findOne({
				where: { 
					id: parseInt(parentId), 
					postId: parseInt(postId),
					isDeleted: false 
				}
			});

			if (!parentComment) {
				return json({ error: '부모 댓글을 찾을 수 없습니다.' }, { status: 404 });
			}
		}

		// 댓글 생성
		const comment = commentRepository.create({
			postId: parseInt(postId),
			parentId: parentId ? parseInt(parentId) : null,
			authorId: user.id,
			content: content.trim()
		});

		const savedComment = await commentRepository.save(comment);

		// 작성자 정보와 함께 조회
		const commentWithAuthor = await commentRepository.findOne({
			where: { id: savedComment.id },
			relations: ['author']
		});

		return json(commentWithAuthor, { status: 201 });

	} catch (error) {
		console.error('댓글 작성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
