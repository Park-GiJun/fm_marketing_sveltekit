// 댓글 수정/삭제 API
import { json } from '@sveltejs/kit';
import { getDataSource } from '$lib/server/data-source.js';
import { Comment } from '$lib/server/entities/Comment.js';
import { User, UserRole } from '$lib/server/entities/User.js';
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

		const dataSource = await getDataSource();
		const commentRepository = dataSource.getRepository(Comment);

		// 댓글 존재 확인 및 권한 체크
		const comment = await commentRepository.findOne({
			where: { 
				id: parseInt(commentId),
				postId: parseInt(postId),
				isDeleted: false 
			},
			select: ['id', 'authorId', 'content']
		});

		if (!comment) {
			return json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (user.role !== UserRole.ADMIN && user.id !== comment.authorId) {
			return json({ error: '수정 권한이 없습니다.' }, { status: 403 });
		}

		// 댓글 수정
		await commentRepository.update(commentId, {
			content: content.trim()
		});

		const updatedComment = await commentRepository.findOne({
			where: { id: parseInt(commentId) },
			relations: ['author']
		});

		return json(updatedComment);

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

		const dataSource = await getDataSource();
		const commentRepository = dataSource.getRepository(Comment);

		// 댓글 존재 확인 및 권한 체크
		const comment = await commentRepository.findOne({
			where: { 
				id: parseInt(commentId),
				postId: parseInt(postId),
				isDeleted: false 
			},
			select: ['id', 'authorId']
		});

		if (!comment) {
			return json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (user.role !== UserRole.ADMIN && user.id !== comment.authorId) {
			return json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
		}

		// 소프트 삭제
		await commentRepository.update(commentId, { isDeleted: true });

		return json({ message: '댓글이 삭제되었습니다.' });

	} catch (error) {
		console.error('댓글 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
