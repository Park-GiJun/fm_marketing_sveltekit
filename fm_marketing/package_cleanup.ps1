# package.json 의존성 정리 스크립트

Write-Host "📦 TypeORM 관련 패키지 제거 중..." -ForegroundColor Yellow

# TypeORM 관련 패키지들 제거
$removePackages = @(
    "typeorm",
    "reflect-metadata",
    "@types/mysql2",
    "ts-node"
)

foreach ($package in $removePackages) {
    Write-Host "제거 중: $package" -ForegroundColor Red
    npm uninstall $package 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $package 제거 완료" -ForegroundColor Green
    }
}

Write-Host "" -ForegroundColor White
Write-Host "📦 필요한 패키지 설치 중..." -ForegroundColor Yellow

# MySQL2와 bcryptjs, jsonwebtoken 설치
$installPackages = @(
    "mysql2",
    "bcryptjs",
    "jsonwebtoken",
    "dotenv"
)

foreach ($package in $installPackages) {
    Write-Host "설치 중: $package" -ForegroundColor Green
    npm install $package
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $package 설치 완료" -ForegroundColor Green
    }
}

Write-Host "" -ForegroundColor White
Write-Host "🔧 개발 의존성 설치 중..." -ForegroundColor Yellow

# 개발 의존성 설치
$devPackages = @(
    "@types/bcryptjs",
    "@types/jsonwebtoken"
)

foreach ($package in $devPackages) {
    Write-Host "설치 중: $package (dev)" -ForegroundColor Cyan
    npm install --save-dev $package
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $package 설치 완료" -ForegroundColor Green
    }
}

Write-Host "" -ForegroundColor White
Write-Host "✅ 패키지 정리 완료!" -ForegroundColor Green
Write-Host "이제 MySQL2만 사용하는 깔끔한 프로젝트가 되었습니다." -ForegroundColor Green