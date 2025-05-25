// 커뮤니티 게시글 상세 조회/수정/삭제 API - MySQL2 버전
import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database.js';
import { getUserFromRequest } from '$lib/server/auth.js';

export async function GET({ params }) {
	try {
		const { id } = params;

		// 게시글 상세 조회
		const [post] = await executeQuery(`
			SELECT p.*, u.nickname, u.profile_image
			FROM community_posts p
			LEFT JOIN users u ON p.author_id = u.id
			WHERE p.id = ? AND p.is_deleted = 0
		`, [parseInt(id)]);

		if (!post) {
			return json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
		}

		// 조회수 증가
		await executeQuery('UPDATE community_posts SET views = views + 1 WHERE id = ?', [parseInt(id)]);
		post.views += 1;

		// 댓글 수 조회
		const [commentCount] = await executeQuery(`
			SELECT COUNT(*) as count FROM comments 
			WHERE post_id = ? AND is_deleted = 0
		`, [parseInt(id)]);

		const result = {
			...post,
			images: post.images ? JSON.parse(post.images) : [],
			tags: post.tags ? JSON.parse(post.tags) : [],
			authorId: post.author_id,
			isPinned: !!post.is_pinned,
			isDeleted: !!post.is_deleted,
			createdAt: post.created_at,
			updatedAt: post.updated_at,
			commentCount: commentCount?.count || 0,
			author: {
				id: post.author_id,
				nickname: post.nickname || '익명',
				profileImage: post.profile_image || '/images/default-avatar.jpg'
			}
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

		// 게시글 존재 확인 및 권한 체크
		const [post] = await executeQuery(`
			SELECT id, author_id FROM community_posts 
			WHERE id = ? AND is_deleted = 0
		`, [parseInt(id)]);

		if (!post) {
			return json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (user.role !== 'admin' && user.id !== post.author_id) {
			return json({ error: '수정 권한이 없습니다.' }, { status: 403 });
		}

		const data = await request.json();
		const { title, content, category, tags, images } = data;

		// 게시글 수정
		await executeQuery(`
			UPDATE community_posts 
			SET title = ?, content = ?, category = ?, tags = ?, images = ?
			WHERE id = ?
		`, [
			title,
			content,
			category,
			JSON.stringify(tags || []),
			JSON.stringify(images || []),
			parseInt(id)
		]);

		// 수정된 게시글 조회
		const [updatedPost] = await executeQuery(`
			SELECT p.*, u.nickname, u.profile_image
			FROM community_posts p
			LEFT JOIN users u ON p.author_id = u.id
			WHERE p.id = ?
		`, [parseInt(id)]);

		return json({
			...updatedPost,
			images: updatedPost.images ? JSON.parse(updatedPost.images) : [],
			tags: updatedPost.tags ? JSON.parse(updatedPost.tags) : [],
			authorId: updatedPost.author_id,
			isPinned: !!updatedPost.is_pinned,
			isDeleted: !!updatedPost.is_deleted,
			createdAt: updatedPost.created_at,
			updatedAt: updatedPost.updated_at,
			author: {
				id: updatedPost.author_id,
				nickname: updatedPost.nickname || '익명',
				profileImage: updatedPost.profile_image || '/images/default-avatar.jpg'
			}
		});

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

		// 게시글 존재 확인 및 권한 체크
		const [post] = await executeQuery(`
			SELECT id, author_id FROM community_posts 
			WHERE id = ? AND is_deleted = 0
		`, [parseInt(id)]);

		if (!post) {
			return json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
		}

		if (user.role !== 'admin' && user.id !== post.author_id) {
			return json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
		}

		// 소프트 삭제
		await executeQuery(`
			UPDATE community_posts SET is_deleted = 1 WHERE id = ?
		`, [parseInt(id)]);

		return json({ message: '게시글이 삭제되었습니다.' });

	} catch (error) {
		console.error('커뮤니티 게시글 삭제 오류:', error);
		return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
	}
}
