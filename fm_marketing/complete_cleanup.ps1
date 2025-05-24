# 완전한 프로젝트 정리 및 설치 스크립트

Write-Host "🚀 FM마케팅 프로젝트 완전 정리 시작..." -ForegroundColor Green

# 1. 기존 설치 파일들 완전 삭제
Write-Host "🗑️ 기존 설치 파일들 삭제 중..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Path "node_modules" -Recurse -Force
    Write-Host "✅ node_modules 삭제" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Remove-Item -Path "package-lock.json" -Force
    Write-Host "✅ package-lock.json 삭제" -ForegroundColor Green
}

# 2. TypeORM 관련 파일들 삭제
Write-Host "🗑️ TypeORM 관련 파일들 삭제 중..." -ForegroundColor Yellow

$typeormFiles = @(
    "src/lib/server/entities",
    "src/lib/server/data-source.js",
    "src/lib/server/data-source-unified.js",
    "src/lib/server/database-init.js",
    "src/lib/server/database-init.ts",
    "src/lib/server/seed.js",
    "src/lib/server/seed.ts",
    "src/lib/server/auth-unified.js",
    "src/lib/server/entities-simple",
    "src/lib/server/database-no-decorators.js",
    "src/lib/server/database-simple.js",
    "src/lib/server/simple-db.js",
    "src/lib/server/fallback-database.js",
    "typeorm.config.ts",
    "test-db-connection.js",
    "scripts"
)

foreach ($file in $typeormFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Recurse -Force
        Write-Host "✅ $file 삭제" -ForegroundColor Green
    }
}

# 3. npm 캐시 정리
Write-Host "🧹 npm 캐시 정리 중..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✅ npm 캐시 정리 완료" -ForegroundColor Green

# 4. 패키지 설치 (여러 방법 시도)
Write-Host "📦 패키지 설치 중..." -ForegroundColor Yellow

# 첫 번째 시도: legacy-peer-deps
Write-Host "첫 번째 시도: --legacy-peer-deps" -ForegroundColor Cyan
npm install --legacy-peer-deps 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ --legacy-peer-deps로 설치 성공!" -ForegroundColor Green
} else {
    Write-Host "❌ 첫 번째 시도 실패, 두 번째 시도..." -ForegroundColor Red

    # 두 번째 시도: force
    Write-Host "두 번째 시도: --force" -ForegroundColor Cyan
    npm install --force 2>$null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ --force로 설치 성공!" -ForegroundColor Green
    } else {
        Write-Host "❌ 두 번째 시도도 실패, 세 번째 시도..." -ForegroundColor Red

        # 세 번째 시도: 기본 설치
        Write-Host "세 번째 시도: 기본 설치" -ForegroundColor Cyan
        npm install 2>$null

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ 기본 설치 성공!" -ForegroundColor Green
        } else {
            Write-Host "❌ 모든 설치 시도 실패" -ForegroundColor Red
            Write-Host "수동으로 해결이 필요합니다." -ForegroundColor Yellow
            exit 1
        }
    }
}

# 5. MySQL2 연결 테스트
Write-Host "🔍 MySQL2 연결 테스트 중..." -ForegroundColor Yellow
if (Test-Path "test-mysql2.js") {
    node test-mysql2.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MySQL2 연결 테스트 성공!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ MySQL2 연결 테스트 실패" -ForegroundColor Yellow
        Write-Host ".env 파일의 데이터베이스 설정을 확인하세요." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ test-mysql2.js 파일이 없습니다." -ForegroundColor Yellow
}

Write-Host "" -ForegroundColor White
Write-Host "🎉 프로젝트 정리 완료!" -ForegroundColor Green
Write-Host "이제 다음 명령어로 개발 서버를 시작하세요:" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White
Write-Host "📝 확인사항:" -ForegroundColor Cyan
Write-Host "1. .env 파일에 데이터베이스 설정이 올바른지 확인" -ForegroundColor White
Write-Host "2. MySQL 서버가 실행 중인지 확인" -ForegroundColor White
Write-Host "3. 네트워크 연결 확인" -ForegroundColor White