// 파일 업로드 API - 이미지 전용
import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getUserFromRequest } from '$lib/server/auth.js';

const UPLOAD_DIR = 'static/uploads';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export async function POST({ request }) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'general'; // experience, community, profile, general

    if (!file || !(file instanceof File)) {
      return json({ error: '파일을 선택해주세요.' }, { status: 400 });
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return json({ error: '파일 크기는 5MB 이하여야 합니다.' }, { status: 400 });
    }

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return json({ error: '지원하지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)' }, { status: 400 });
    }

    // 업로드 디렉토리 생성
    const uploadPath = path.join(UPLOAD_DIR, type);
    const yearMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const finalPath = path.join(uploadPath, yearMonth);
    
    if (!existsSync(finalPath)) {
      await mkdir(finalPath, { recursive: true });
    }

    // 파일명 생성 (중복 방지)
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomSuffix}.${extension}`;
    const filePath = path.join(finalPath, fileName);

    // 파일 저장
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // 웹 접근 가능한 URL 생성
    const webUrl = `/${filePath.replace(/\\/g, '/')}`;

    return json({
      success: true,
      url: webUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return json({ error: '파일 업로드에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE({ url, request }) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const fileUrl = url.searchParams.get('url');
    
    if (!fileUrl) {
      return json({ error: '삭제할 파일 URL이 필요합니다.' }, { status: 400 });
    }

    // URL에서 실제 파일 경로 추출
    const filePath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
    
    try {
      const { unlink } = await import('fs/promises');
      await unlink(filePath);
      
      return json({ 
        success: true, 
        message: '파일이 삭제되었습니다.' 
      });
    } catch (error) {
      console.error('파일 삭제 오류:', error);
      return json({ 
        success: false, 
        message: '파일 삭제에 실패했습니다.' 
      });
    }

  } catch (error) {
    console.error('파일 삭제 API 오류:', error);
    return json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
