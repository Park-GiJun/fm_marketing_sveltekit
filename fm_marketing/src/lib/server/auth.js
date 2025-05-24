// 인증 관련 서버 유틸리티
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dev } from '$app/environment';
import { getDataSource } from './data-source.js';
import { User } from './entities/User.js';

// JWT 시크릿 키 (실제 운영에서는 환경변수 사용)
const JWT_SECRET = dev ? 'dev-secret-key' : process.env.JWT_SECRET || 'fallback-secret-key';

/**
 * 비밀번호 해싱
 */
export async function hashPassword(password) {
	const salt = await bcrypt.genSalt(12);
	return bcrypt.hash(password, salt);
}

/**
 * 비밀번호 검증
 */
export async function verifyPassword(password, hashedPassword) {
	return bcrypt.compare(password, hashedPassword);
}

/**
 * JWT 토큰 생성
 */
export function generateToken(payload) {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: '7d',
		issuer: 'fm-marketing'
	});
}

/**
 * JWT 토큰 검증
 */
export function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
}

/**
 * 요청에서 사용자 정보 추출
 */
export async function getUserFromRequest(request) {
	const authHeader = request.headers.get('authorization');
	const cookieToken = request.headers.get('cookie')?.match(/token=([^;]+)/)?.[1];
	
	const token = authHeader?.replace('Bearer ', '') || cookieToken;
	
	if (!token) {
		return null;
	}

	const payload = verifyToken(token);
	if (!payload) {
		return null;
	}

	try {
		const dataSource = await getDataSource();
		const userRepository = dataSource.getRepository(User);
		
		const user = await userRepository.findOne({
			where: { 
				id: payload.userId,
				isActive: true
			},
			select: [
				'id', 'username', 'email', 'name', 'nickname', 
				'profileImage', 'points', 'level', 'role', 
				'isActive', 'isVerified'
			]
		});

		return user || null;
	} catch (error) {
		console.error('사용자 조회 오류:', error);
		return null;
	}
}

/**
 * 인증이 필요한 라우트를 위한 미들웨어
 */
export function requireAuth(handler) {
	return async (event) => {
		const user = await getUserFromRequest(event.request);
		
		if (!user) {
			return new Response(
				JSON.stringify({ error: '인증이 필요합니다.' }), 
				{ 
					status: 401,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		// 사용자 정보를 event.locals에 추가
		event.locals.user = user;
		
		return handler(event);
	};
}

/**
 * 관리자 권한이 필요한 라우트를 위한 미들웨어
 */
export function requireAdmin(handler) {
	return async (event) => {
		const user = await getUserFromRequest(event.request);
		
		if (!user || user.role !== 'admin') {
			return new Response(
				JSON.stringify({ error: '관리자 권한이 필요합니다.' }), 
				{ 
					status: 403,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		event.locals.user = user;
		return handler(event);
	};
}

/**
 * 이메일 유효성 검사
 */
export function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검사
 */
export function isValidPassword(password) {
	// 최소 8자, 최소 하나의 문자와 숫자
	return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

/**
 * 사용자명 유효성 검사
 */
export function isValidUsername(username) {
	// 3-20자, 영문자와 숫자, 언더스코어만 허용
	const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
	return usernameRegex.test(username);
}
