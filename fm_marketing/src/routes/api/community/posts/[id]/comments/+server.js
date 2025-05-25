// 댓글 목록 조회/생성 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params }) {
	try {
		const { id: postId } = params;

		// 댓글 조회 (부모-자식 관계 포함)
		const comments = await executeQuery(`
			SELECT c.*, u.nickname, u.profile_image
			FROM comments c
			LEFT JOIN users u ON c.author_id = u.id
			WHERE c.post_id = ? AND c.is_deleted = 0
			ORDER BY 
				CASE WHEN c.parent_id IS NULL THEN c.id ELSE c.parent_id END ASC,
				c.parent_id IS NULL DESC,
				c.created_at ASC
		`, [parseInt(postId)]);

		// 댓글을 계층 구조로 변환
		const parentComments = comments.filter(c => !c.parent_id);
		const childComments = comments.filter(c => c.parent_id);

		const result = parentComments.map(parent => ({
			...parent,
			postId: parent.post_id,
			parentId: parent.parent_id,
			authorId: parent.author_id,
			isDeleted: !!parent.is_deleted,
			createdAt: parent.created_at,
			updatedAt: parent.updated_at,
			author: {
				id: parent.author_id,
				nickname: parent.nickname || '익명',
				profileImage: parent.profile_image || '/images/default-avatar.jpg'
			},
			children: childComments
				.filter(child => child.parent_id === parent.id)
				.map(child => ({
					...child,
					postId: child.post_id,
					parentId: child.parent_id,
					authorId: child.author_id,
					isDeleted: !!child.is_deleted,
					createdAt: child.created_at,
					updatedAt: child.updated_at,
					author: {
						id: child.author_id,
						nickname: child.nickname || '익명',
						profileImage: child.profile_image || '/images/default-avatar.jpg'
					}
				}))
		}));

		return json(result);

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

		// 게시글 존재 확인
		const [post] = await executeQuery(`
			SELECT id FROM community_posts WHERE id = ? AND is_deleted = 0
		`, [parseInt(postId)]);

		if (!post) {
			return json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
		}

		// 부모 댓글 확인 (대댓글인 경우)
		if (parentId) {
			const [parentComment] = await executeQuery(`
				SELECT id FROM comments 
				WHERE id = ? AND post_id = ? AND is_deleted = 0
			`, [parseInt(parentId), parseInt(postId)]);

			if (!parentComment) {
				return json({ error: '부모 댓글을 찾을 수 없습니다.' }, { status: 404 });
			}
		}

		// 댓글 생성
		const result = await executeQuery(`
			INSERT INTO comments (post_id, parent_id, author_id, content)
			VALUES (?, ?, ?, ?)
		`, [
			parseInt(postId),
			parentId ? parseInt(parentId) : null,
			user.id,
			content.trim()
		]);

		// 작성자 정보와 함께 조회
		const [commentWithAuthor] = await executeQuery(`
			SELECT c.*, u.nickname, u.profile_image
			FROM comments c
			LEFT JOIN users u ON c.author_id = u.id
			WHERE c.id = ?
		`, [result.insertId]);

		return json({
			...commentWithAuthor,
			postId: commentWithAuthor.post_id,
			parentId: commentWithAuthor.parent_id,
			authorId: commentWithAuthor.author_id,
			isDeleted: !!commentWithAuthor.is_deleted,
			createdAt: commentWithAuthor.created_at,
			updatedAt: commentWithAuthor.updated_at,
			author: {
				id: commentWithAuthor.author_id,
				nickname: commentWithAuthor.nickname || user.nickname,
				profileImage: commentWithAuthor.profile_image || '/images/default-avatar.jpg'
			}
		}, { status: 201 });

	} catch (error) {
		console.error('댓글 작성 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
