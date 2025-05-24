// JSON 데이터 처리 헬퍼 함수

/**
 * 문자열을 JSON 배열로 파싱
 */
export function parseJsonArray(jsonString) {
  if (!jsonString) return [];
  
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('JSON 파싱 오류:', error);
    return [];
  }
}

/**
 * 배열을 JSON 문자열로 변환
 */
export function stringifyJsonArray(array) {
  if (!Array.isArray(array)) return JSON.stringify([]);
  return JSON.stringify(array);
}

/**
 * 엔티티의 JSON 필드를 파싱하여 배열로 변환
 */
export function processEntityJsonFields(entity, jsonFields = []) {
  if (!entity) return entity;
  
  const processed = { ...entity };
  
  jsonFields.forEach(field => {
    if (processed[field]) {
      processed[field] = parseJsonArray(processed[field]);
    }
  });
  
  return processed;
}

/**
 * 엔티티 저장 전 JSON 필드를 문자열로 변환
 */
export function prepareEntityJsonFields(data, jsonFields = []) {
  if (!data) return data;
  
  const prepared = { ...data };
  
  jsonFields.forEach(field => {
    if (prepared[field]) {
      prepared[field] = stringifyJsonArray(prepared[field]);
    }
  });
  
  return prepared;
}
