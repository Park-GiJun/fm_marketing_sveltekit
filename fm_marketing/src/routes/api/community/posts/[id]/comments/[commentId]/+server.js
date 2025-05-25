// 댓글 수정/삭제 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function PUT({ params, request }) {
	try {
		const { id: postId, commentId } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const { content } = await request.json();

		if (!content || !content.trim()) {
			return json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 });
		}

		// 댓글 존재 확인 및 권한 체크
		const [comment] = await executeQuery(`
			SELECT id, author_id FROM comments 
			WHERE id = ? AND post_id = ? AND is_deleted = 0
		`, [parseInt(commentId), parseInt(postId)]);

		if (!comment) {
			return json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (user.role !== 'admin' && user.id !== comment.author_id) {
			return json({ error: '수정 권한이 없습니다.' }, { status: 403 });
		}

		// 댓글 수정
		await executeQuery(`
			UPDATE comments SET content = ? WHERE id = ?
		`, [content.trim(), parseInt(commentId)]);

		// 수정된 댓글 조회
		const [updatedComment] = await executeQuery(`
			SELECT c.*, u.nickname, u.profile_image
			FROM comments c
			LEFT JOIN users u ON c.author_id = u.id
			WHERE c.id = ?
		`, [parseInt(commentId)]);

		return json({
			...updatedComment,
			postId: updatedComment.post_id,
			parentId: updatedComment.parent_id,
			authorId: updatedComment.author_id,
			isDeleted: !!updatedComment.is_deleted,
			createdAt: updatedComment.created_at,
			updatedAt: updatedComment.updated_at,
			author: {
				id: updatedComment.author_id,
				nickname: updatedComment.nickname || '익명',
				profileImage: updatedComment.profile_image || '/images/default-avatar.jpg'
			}
		});

	} catch (error) {
		console.error('댓글 수정 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}

export async function DELETE({ params, request }) {
	try {
		const { id: postId, commentId } = params;
		const user = await getUserFromRequest(request);

		if (!user) {
			return json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		// 댓글 존재 확인 및 권한 체크
		const [comment] = await executeQuery(`
			SELECT id, author_id FROM comments 
			WHERE id = ? AND post_id = ? AND is_deleted = 0
		`, [parseInt(commentId), parseInt(postId)]);

		if (!comment) {
			return json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (user.role !== 'admin' && user.id !== comment.author_id) {
			return json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
		}

		// 소프트 삭제
		await executeQuery(`
			UPDATE comments SET is_deleted = 1 WHERE id = ?
		`, [parseInt(commentId)]);

		return json({ message: '댓글이 삭제되었습니다.' });

	} catch (error) {
		console.error('댓글 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
