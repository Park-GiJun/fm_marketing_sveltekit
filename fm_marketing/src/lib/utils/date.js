// src/lib/utils/date.js

/**
 * 날짜 포맷팅 유틸리티 함수들
 */

/**
 * 한국어 날짜 포맷 (YYYY.MM.DD)
 */
export function formatKoreanDate(date) {
	if (!date) return '';
	
	const d = new Date(date);
	if (isNaN(d.getTime())) return '';
	
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	
	return `${year}.${month}.${day}`;
}

/**
 * 한국어 날짜시간 포맷 (YYYY.MM.DD HH:mm)
 */
export function formatKoreanDateTime(date) {
	if (!date) return '';
	
	const d = new Date(date);
	if (isNaN(d.getTime())) return '';
	
	const datePart = formatKoreanDate(d);
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	
	return `${datePart} ${hours}:${minutes}`;
}

/**
 * 상대적 시간 표시 (몇 분 전, 몇 시간 전 등)
 */
export function getRelativeTime(date) {
	if (!date) return '';
	
	const d = new Date(date);
	if (isNaN(d.getTime())) return '';
	
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffSecs = Math.floor(diffMs / 1000);
	const diffMins = Math.floor(diffSecs / 60);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);
	const diffWeeks = Math.floor(diffDays / 7);
	const diffMonths = Math.floor(diffDays / 30);
	const diffYears = Math.floor(diffDays / 365);
	
	if (diffSecs < 30) {
		return '방금 전';
	} else if (diffSecs < 60) {
		return `${diffSecs}초 전`;
	} else if (diffMins < 60) {
		return `${diffMins}분 전`;
	} else if (diffHours < 24) {
		return `${diffHours}시간 전`;
	} else if (diffDays < 7) {
		return `${diffDays}일 전`;
	} else if (diffWeeks < 4) {
		return `${diffWeeks}주 전`;
	} else if (diffMonths < 12) {
		return `${diffMonths}개월 전`;
	} else {
		return `${diffYears}년 전`;
	}
}

/**
 * D-Day 계산 (양수: 남은 일수, 음수: 지난 일수, 0: 오늘)
 */
export function getDDay(targetDate) {
	if (!targetDate) return null;
	
	const target = new Date(targetDate);
	if (isNaN(target.getTime())) return null;
	
	const today = new Date();
	const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
	
	const diffMs = targetStart.getTime() - todayStart.getTime();
	const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
	
	return diffDays;
}

/**
 * D-Day 텍스트 포맷팅
 */
export function formatDDay(targetDate) {
	const dDay = getDDay(targetDate);
	
	if (dDay === null) return '';
	
	if (dDay > 0) {
		return `D-${dDay}`;
	} else if (dDay < 0) {
		return `D+${Math.abs(dDay)}`;
	} else {
		return 'D-Day';
	}
}

/**
 * 기간 표시 (시작일 ~ 종료일)
 */
export function formatDateRange(startDate, endDate, separator = ' ~ ') {
	const start = formatKoreanDate(startDate);
	const end = formatKoreanDate(endDate);
	
	if (!start && !end) return '';
	if (!start) return end;
	if (!end) return start;
	
	return `${start}${separator}${end}`;
}

/**
 * 날짜가 범위 내에 있는지 확인
 */
export function isDateInRange(date, startDate, endDate) {
	if (!date) return false;
	
	const d = new Date(date);
	const start = startDate ? new Date(startDate) : null;
	const end = endDate ? new Date(endDate) : null;
	
	if (start && d < start) return false;
	if (end && d > end) return false;
	
	return true;
}

/**
 * 오늘인지 확인
 */
export function isToday(date) {
	if (!date) return false;
	
	const d = new Date(date);
	const today = new Date();
	
	return d.getFullYear() === today.getFullYear() &&
		   d.getMonth() === today.getMonth() &&
		   d.getDate() === today.getDate();
}

/**
 * 어제인지 확인
 */
export function isYesterday(date) {
	if (!date) return false;
	
	const d = new Date(date);
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	
	return d.getFullYear() === yesterday.getFullYear() &&
		   d.getMonth() === yesterday.getMonth() &&
		   d.getDate() === yesterday.getDate();
}

/**
 * 이번 주인지 확인
 */
export function isThisWeek(date) {
	if (!date) return false;
	
	const d = new Date(date);
	const today = new Date();
	
	// 이번 주 시작일 (월요일)
	const startOfWeek = new Date(today);
	startOfWeek.setDate(today.getDate() - today.getDay() + 1);
	startOfWeek.setHours(0, 0, 0, 0);
	
	// 이번 주 종료일 (일요일)
	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 6);
	endOfWeek.setHours(23, 59, 59, 999);
	
	return d >= startOfWeek && d <= endOfWeek;
}

/**
 * 나이 계산
 */
export function calculateAge(birthDate) {
	if (!birthDate) return null;
	
	const birth = new Date(birthDate);
	const today = new Date();
	
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();
	
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	
	return age;
}

/**
 * 월의 첫 번째 날
 */
export function getFirstDayOfMonth(date = new Date()) {
	const d = new Date(date);
	return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * 월의 마지막 날
 */
export function getLastDayOfMonth(date = new Date()) {
	const d = new Date(date);
	return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * 주어진 날짜에서 N일 더하기/빼기
 */
export function addDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

/**
 * 주어진 날짜에서 N개월 더하기/빼기
 */
export function addMonths(date, months) {
	const result = new Date(date);
	result.setMonth(result.getMonth() + months);
	return result;
}

/**
 * 날짜 유효성 검사
 */
export function isValidDate(date) {
	if (!date) return false;
	const d = new Date(date);
	return !isNaN(d.getTime());
}

/**
 * ISO 문자열을 한국 시간대로 변환
 */
export function toKoreanTime(isoString) {
	if (!isoString) return null;
	
	const date = new Date(isoString);
	if (isNaN(date.getTime())) return null;
	
	// UTC+9 (한국 시간)
	const koreanTime = new Date(date.getTime() + (9 * 60 * 60 * 1000));
	return koreanTime;
}

/**
 * 시간 포맷팅 (HH:mm)
 */
export function formatTime(date) {
	if (!date) return '';
	
	const d = new Date(date);
	if (isNaN(d.getTime())) return '';
	
	const hours = String(d.getHours()).padStart(2, '0');
	const minutes = String(d.getMinutes()).padStart(2, '0');
	
	return `${hours}:${minutes}`;
}

/**
 * 요일 이름 가져오기
 */
export function getDayName(date, short = false) {
	if (!date) return '';
	
	const d = new Date(date);
	if (isNaN(d.getTime())) return '';
	
	const days = short 
		? ['일', '월', '화', '수', '목', '금', '토']
		: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
	
	return days[d.getDay()];
}

/**
 * 월 이름 가져오기
 */
export function getMonthName(date, short = false) {
	if (!date) return '';
	
	const d = new Date(date);
	if (isNaN(d.getTime())) return '';
	
	const months = short 
		? ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
		: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
	
	return months[d.getMonth()];
}

/**
 * 날짜 차이 계산 (일 단위)
 */
export function getDaysDifference(date1, date2) {
	if (!date1 || !date2) return null;
	
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	
	if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
	
	const diffTime = Math.abs(d2.getTime() - d1.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	
	return diffDays;
}
