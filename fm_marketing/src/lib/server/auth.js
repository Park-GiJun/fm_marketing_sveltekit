// MySQL2 기반 인증 유틸리티
import { findUser, createUser as dbCreateUser } from './database.js';

// JWT 시크릿 키
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-fm-marketing';

/**
 * 비밀번호 해싱
 */
export async function hashPassword(password) {
  try {
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  } catch (error) {
    console.error('bcrypt 로드 실패:', error);
    throw new Error('비밀번호 해싱 실패');
  }
}

/**
 * 비밀번호 검증
 */
export async function verifyPassword(password, hashedPassword) {
  try {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('bcrypt 로드 실패:', error);
    throw new Error('비밀번호 검증 실패');
  }
}

/**
 * JWT 토큰 생성
 */
export async function generateToken(payload) {
  try {
    const jwt = await import('jsonwebtoken');
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
      issuer: 'fm-marketing'
    });
  } catch (error) {
    console.error('JWT 로드 실패:', error);
    throw new Error('토큰 생성 실패');
  }
}

/**
 * JWT 토큰 검증
 */
export async function verifyToken(token) {
  try {
    const jwt = await import('jsonwebtoken');
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT 검증 실패:', error);
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

  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }

  try {
    const user = await findUser({ id: payload.userId });
    
    if (user) {
      // 비밀번호 해시 제거
      const { password_hash, ...userInfo } = user;
      return {
        ...userInfo,
        passwordHash: password_hash // 필요한 경우를 위해 다른 이름으로 유지
      };
    }
    
    return null;
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    return null;
  }
}

/**
 * 사용자 생성
 */
export async function createUser(userData) {
  try {
    return await dbCreateUser(userData);
  } catch (error) {
    console.error('사용자 생성 오류:', error);
    throw error;
  }
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
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

/**
 * 사용자명 유효성 검사
 */
export function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}
