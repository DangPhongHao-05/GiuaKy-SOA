# 🎓 Hệ thống quản lý đồ án tốt nghiệp

> **Giữa kỳ — Kiến trúc hướng dịch vụ (SOA)**

Hệ thống quản lý đồ án tốt nghiệp cho sinh viên, được xây dựng theo kiến trúc **Service-Oriented Architecture (SOA)**.

Hệ thống được phân chia thành các dịch vụ độc lập. Các dịch vụ giao tiếp và trao đổi dữ liệu thông qua **HTTP/REST API**.

---

## 1. Mục tiêu

- Xây dựng hệ thống quản lý đồ án tốt nghiệp cho sinh viên.
- Áp dụng kiến trúc hướng dịch vụ (**SOA**).
- Xây dựng các dịch vụ độc lập và có khả năng tái sử dụng.
- Các dịch vụ giao tiếp với nhau thông qua **HTTP/REST**.
- Thực hiện các chức năng CRUD cơ bản.
- Xây dựng giao diện quản lý bằng React TypeScript.

---

## 2. Kiến trúc hệ thống

```text
                         ┌─────────────────────┐
                         │       Frontend      │
                         │   React + TypeScript│
                         └──────────┬──────────┘
                                    │
                              HTTP / REST
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
 ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
 │   AuthService   │       │ SinhVienService │       │ GiangVienService│
 │      :5001      │       │      :5005      │       │      :5004      │
 └─────────────────┘       └─────────────────┘       └─────────────────┘
          │                         │                         │
          ▼                         ▼                         ▼
      AuthDB                  SinhVienDB               GiangVienDB


          ┌─────────────────────────┼─────────────────────────┐
          │                         │
          ▼                         ▼
 ┌─────────────────┐       ┌─────────────────┐
 │  DeTaiService   │       │  DangKyService  │
 │      :5003      │       │      :5002      │
 └─────────────────┘       └────────┬────────┘
          │                         │
          ▼                         ▼
      DeTaiDB                   DangKyDB
```

Các service hoạt động độc lập và trao đổi dữ liệu thông qua **HTTP/REST API** thay vì truy cập trực tiếp cơ sở dữ liệu của service khác.

---

## 3. Công nghệ sử dụng

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server
- REST API
- JSON

### Frontend

- React
- TypeScript
- HTML
- CSS
- Axios

### Công cụ

- Visual Studio
- Visual Studio Code
- Git
- GitHub
- SQL Server Management Studio

---

## 4. Các Service

| Service          | Chức năng                      | Port |
| ---------------- | ------------------------------ | ---: |
| SinhVienService  | Quản lý sinh viên              | 5005 |
| GiangVienService | Quản lý giảng viên             | 5004 |
| DeTaiService     | Quản lý đề tài                 | 5003 |
| DangKyService    | Quản lý đăng ký đề tài         | 5002 |
| AuthService      | Đăng nhập, xác thực người dùng | 5001 |

\*Lưu ý: nếu dùng https// chuyển sang cổng 700x tương ứng
Ví dụ Auth http://localhost:5001/ -> https://localhost:7001/

---

## 5. Database

Hệ thống sử dụng **SQL Server**.

Mỗi service có một database riêng về mặt logic:

```text
AuthDB
└── TAIKHOAN

SinhVienDB
└── SINHVIEN

GiangVienDB
└── GIANGVIEN

DeTaiDB
└── DETAI

DangKyDB
└── DANGKY
```

Các service không truy cập trực tiếp database của service khác.

Khi cần lấy thông tin từ service khác, service sẽ gửi request thông qua **HTTP/REST API**.

---

## 6. Cấu trúc thư mục

```text
GiuaKy-SOA/
│
├── Backend/
│   ├── DoAnTotNghiep.sln
│   │
│   ├── AuthService/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Data/
│   │   ├── Services/
│   │   └── AuthService.csproj
│   │
│   ├── SinhVienService/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Data/
│   │   ├── Services/
│   │   └── SinhVienService.csproj
│   │
│   ├── GiangVienService/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Data/
│   │   ├── Services/
│   │   └── GiangVienService.csproj
│   │
│   ├── DeTaiService/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Data/
│   │   ├── Services/
│   │   └── DeTaiService.csproj
│   │
│   └── DangKyService/
│       ├── Controllers/
│       ├── Models/
│       ├── Data/
│       ├── Services/
│       └── DangKyService.csproj
│
├── Frontend/
│   └── React-TypeScript/
│
├── Database/
│   ├── AuthDB.sql
│   ├── SinhVienDB.sql
│   ├── GiangVienDB.sql
│   ├── DeTaiDB.sql
│   └── DangKyDB.sql
│
├── .gitignore
│
└── README.md
```

---

## 7. Yêu cầu môi trường

Cần cài đặt:

- .NET SDK
- Node.js
- npm
- SQL Server
- SQL Server Management Studio
- Visual Studio
- Visual Studio Code
- Git

Kiểm tra .NET:

```bash
dotnet --version
```

Kiểm tra Node.js:

```bash
node --version
```

Kiểm tra npm:

```bash
npm --version
```

Kiểm tra Git:

```bash
git --version
```

---

## 8. Cài đặt và chạy Backend

### Bước 1: Clone repository

```bash
git clone <repository-url>
```

Di chuyển vào thư mục project:

```bash
cd GiuaKy-SOA
```

### Bước 2: Cấu hình Database

Mở SQL Server Management Studio và chạy các file SQL trong thư mục:

```text
Database/
```

Cập nhật connection string trong từng service nếu cần.

### Bước 3: Restore package

Tại thư mục Backend:

```bash
cd Backend
dotnet restore
```

### Bước 4: Build project

```bash
dotnet build
```

### Bước 5: Chạy các Service

Có thể chạy từng service:

```bash
dotnet run --project AuthService
```

```bash
dotnet run --project SinhVienService
```

```bash
dotnet run --project GiangVienService
```

```bash
dotnet run --project DeTaiService
```

```bash
dotnet run --project DangKyService
```

Hoặc sử dụng **Visual Studio → Configure Startup Projects → Multiple startup projects** để chạy nhiều service cùng lúc.

---

## 9. Cài đặt và chạy Frontend

Di chuyển vào thư mục Frontend:

```bash
cd Frontend/React-TypeScript
```

Cài đặt thư viện:

```bash
npm install
```

Chạy frontend:

```bash
npm run dev
```

Frontend sẽ kết nối đến các Backend Service thông qua REST API.

---

## 10. Phân công

| Thành viên            | Công việc                   |
| --------------------- | --------------------------- |
| Đặng Phong Hào        | AuthService                 |
| Tô Hoàng Hào          | SinhVienService             |
| Bùi Thế Sơn           | GiangVienService + Frontend |
| Phạm Hoàng An Khang   | DeTaiService                |
| Nguyễn Trần Thiên Bảo | DangKyService               |

> Phân công có thể được điều chỉnh trong quá trình thực hiện dự án.
