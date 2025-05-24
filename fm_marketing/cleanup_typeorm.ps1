# TypeORM 관련 파일들 삭제 스크립트

Write-Host "🗑️ TypeORM 관련 파일들을 삭제합니다..." -ForegroundColor Yellow

# TypeORM 엔티티 폴더 삭제
if (Test-Path "src/lib/server/entities") {
    Remove-Item -Path "src/lib/server/entities" -Recurse -Force
    Write-Host "✅ TypeORM 엔티티 폴더 삭제 완료" -ForegroundColor Green
}

# TypeORM 설정 파일들 삭제
$typeormFiles = @(
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
    "typeorm.config.ts"
)

foreach ($file in $typeormFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Recurse -Force
        Write-Host "✅ $file 삭제 완료" -ForegroundColor Green
    }
}

# TypeORM 더미 파일들 삭제
$dummyFiles = @(
    "src/lib/server/simple-db.js",
    "src/lib/server/fallback-database.js"
)

foreach ($file in $dummyFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "✅ $file 삭제 완료" -ForegroundColor Green
    }
}

# 테스트 스크립트들 정리
$testFiles = @(
    "test-db-connection.js",
    "scripts/test-simple.js",
    "scripts/test-connection.js",
    "scripts/test-db-connection.js",
    "scripts/setup-db.js"
)

foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Remove-Item -Path $file -Force
        Write-Host "✅ $file 삭제 완료" -ForegroundColor Green
    }
}

# package.json에서 TypeORM 의존성 제거 안내
Write-Host "" -ForegroundColor White
Write-Host "📝 다음 명령어로 TypeORM 관련 패키지를 제거하세요:" -ForegroundColor Cyan
Write-Host "npm uninstall typeorm reflect-metadata mysql2" -ForegroundColor Yellow
Write-Host "npm uninstall @types/mysql2 ts-node" -ForegroundColor Yellow

Write-Host "" -ForegroundColor White
Write-Host "🔧 그리고 다음 명령어로 MySQL2만 설치하세요:" -ForegroundColor Cyan
Write-Host "npm install mysql2" -ForegroundColor Yellow

Write-Host "" -ForegroundColor White
Write-Host "✅ TypeORM 파일 정리 완료!" -ForegroundColor Green
Write-Host "이제 MySQL2 방식으로만 작동합니다." -ForegroundColor Green