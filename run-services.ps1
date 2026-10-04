<#
.SYNOPSIS
    Script hỗ trợ khởi chạy các microservices và frontend của hệ thống SOA đồ án tốt nghiệp.
    Mặc định khởi chạy qua profile HTTPS (cổng 700x) để đồng bộ hoàn toàn với Frontend.
#>

param(
    [string]$Service = ""
)

$rootDir = $PSScriptRoot

function Run-Auth {
    Write-Host "[SOA] Khởi chạy AuthService (HTTPS: 7001, HTTP: 5001)..." -ForegroundColor Cyan
    Set-Location "$rootDir\backend\Services\AuthService"
    dotnet run --launch-profile https
}

function Run-SinhVien {
    Write-Host "[SOA] Khởi chạy SinhVienService (HTTPS: 7005, HTTP: 5005)..." -ForegroundColor Green
    Set-Location "$rootDir\backend\Services\SinhVienService"
    dotnet run --launch-profile https
}

function Run-DeTai {
    Write-Host "[SOA] Khởi chạy DeTaiService (HTTPS: 7003, HTTP: 5003)..." -ForegroundColor Yellow
    Set-Location "$rootDir\backend\Services\DeTaiService"
    dotnet run --launch-profile https
}

function Run-GiangVien {
    Write-Host "[SOA] Khởi chạy GiangVienService (HTTPS: 7004, HTTP: 5004)..." -ForegroundColor Magenta
    Set-Location "$rootDir\backend\Services\GiangVienService"
    dotnet run --launch-profile https
}

function Run-DangKy {
    Write-Host "[SOA] Khởi chạy DangKyService (HTTPS: 7002, HTTP: 5002)..." -ForegroundColor Red
    Set-Location "$rootDir\backend\Services\DangKyService"
    dotnet run --launch-profile https
}

function Run-Frontend {
    Write-Host "[SOA] Khởi chạy Frontend React (HTTP: 5173)..." -ForegroundColor Blue
    Set-Location "$rootDir\frontend\giuaky-SOA"
    npm run dev
}

function Run-All-Windows {
    Write-Host "[SOA] Đang mở từng service trên cửa sổ PowerShell riêng biệt..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend\Services\AuthService'; Write-Host '--- AuthService :7001 ---' -ForegroundColor Cyan; dotnet run --launch-profile https"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend\Services\SinhVienService'; Write-Host '--- SinhVienService :7005 ---' -ForegroundColor Green; dotnet run --launch-profile https"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend\Services\DeTaiService'; Write-Host '--- DeTaiService :7003 ---' -ForegroundColor Yellow; dotnet run --launch-profile https"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend\giuaky-SOA'; Write-Host '--- Frontend :5173 ---' -ForegroundColor Blue; npm run dev"
}

switch ($Service.ToLower()) {
    "auth"      { Run-Auth }
    "sinhvien"  { Run-SinhVien }
    "detai"     { Run-DeTai }
    "giangvien" { Run-GiangVien }
    "dangky"    { Run-DangKy }
    "frontend"  { Run-Frontend }
    "all"       { Run-All-Windows }
    default {
        Write-Host "==========================================================" -ForegroundColor Cyan
        Write-Host " HỆ THỐNG SOA - QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP - HTTPS RUNNER" -ForegroundColor Cyan
        Write-Host "==========================================================" -ForegroundColor Cyan
        Write-Host "1. Chạy AuthService        (:7001)"
        Write-Host "2. Chạy SinhVienService    (:7005)"
        Write-Host "3. Chạy DeTaiService       (:7003)"
        Write-Host "4. Chạy GiangVienService   (:7004)"
        Write-Host "5. Chạy DangKyService      (:7002)"
        Write-Host "6. Chạy Frontend React     (:5173)"
        Write-Host "7. Chạy Tất cả (Mỗi service 1 cửa sổ riêng)"
        Write-Host "0. Thoát"
        Write-Host "----------------------------------------------------------"
        $choice = Read-Host "Nhập lựa chọn của bạn (0-7)"

        switch ($choice) {
            "1" { Run-Auth }
            "2" { Run-SinhVien }
            "3" { Run-DeTai }
            "4" { Run-GiangVien }
            "5" { Run-DangKy }
            "6" { Run-Frontend }
            "7" { Run-All-Windows }
            default { Write-Host "Đã thoát." }
        }
    }
}
