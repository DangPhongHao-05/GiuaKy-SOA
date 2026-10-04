import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowDownUp,
  BookOpen,
  Check,
  ChevronDown,
  CirclePlus,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  Mail,
  Pencil,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';

type Student = {
  id: number;
  maSv: string;
  hoTen: string;
  ngaySinh: string | null;
  lop: string | null;
  email: string | null;
  phone: string | null;
};

type StudentForm = Omit<Student, 'id'>;

const emptyForm: StudentForm = {
  maSv: '',
  hoTen: '',
  ngaySinh: '',
  lop: '',
  email: '',
  phone: '',
};

const apiUrl = '/api/SinhVien';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Đã xảy ra lỗi. Vui lòng thử lại.';
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadStudents() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Không thể tải danh sách (HTTP ${response.status}).`);
      setStudents(await response.json() as Student[]);
    } catch (loadError) {
      setError(`${getErrorMessage(loadError)} Hãy kiểm tra SinhVienService đang chạy tại http://localhost:5005.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStudents();
  }, []);

  const classes = useMemo(
    () => [...new Set(students.map((student) => student.lop).filter((value): value is string => Boolean(value)))].sort(),
    [students],
  );

  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    return students.filter((student) => {
      const matchesClass = selectedClass === 'all' || student.lop === selectedClass;
      const searchable = [student.maSv, student.hoTen, student.lop, student.email]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('vi');
      return matchesClass && searchable.includes(normalizedQuery);
    });
  }, [students, query, selectedClass]);

  function openCreateModal() {
    setEditingStudent(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(student: Student) {
    setEditingStudent(student);
    setForm({
      maSv: student.maSv,
      hoTen: student.hoTen,
      ngaySinh: student.ngaySinh?.slice(0, 10) ?? '',
      lop: student.lop ?? '',
      email: student.email ?? '',
      phone: student.phone ?? '',
    });
    setModalOpen(true);
  }

  async function saveStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload: StudentForm = {
      ...form,
      ngaySinh: form.ngaySinh || null,
      lop: (form.lop ?? '').trim() || null,
      email: (form.email ?? '').trim() || null,
      phone: (form.phone ?? '').trim() || null,
    };

    try {
      const response = await fetch(editingStudent ? `${apiUrl}/${editingStudent.id}` : apiUrl, {
        method: editingStudent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent ? { id: editingStudent.id, ...payload } : payload),
      });
      if (!response.ok) throw new Error(`Không thể lưu sinh viên (HTTP ${response.status}).`);
      setModalOpen(false);
      await loadStudents();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(student: Student) {
    if (!window.confirm(`Bạn có chắc muốn xóa sinh viên ${student.hoTen} (${student.maSv})?`)) return;
    setError('');
    try {
      const response = await fetch(`${apiUrl}/${student.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Không thể xóa sinh viên (HTTP ${response.status}).`);
      await loadStudents();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#students" aria-label="Trang quản lý sinh viên">
          <span className="brand-mark"><GraduationCap size={23} /></span>
          <span className="brand-copy"><strong>Uni<span>space</span></strong><small>CỔNG QUẢN TRỊ</small></span>
        </a>
        <div className="nav-label">TỔNG QUAN</div>
        <nav className="side-nav" aria-label="Điều hướng chính">
          <a className="nav-item" href="#overview"><LayoutDashboard size={18} /> Bảng điều khiển</a>
          <a className="nav-item active" href="#students"><Users size={18} /> Sinh viên <span className="nav-count">{students.length}</span></a>
          <a className="nav-item" href="#classes"><BookOpen size={18} /> Lớp học</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="support-card"><span className="support-icon"><ShieldCheck size={18} /></span><strong>Dữ liệu an toàn</strong><p>Thông tin sinh viên được quản lý tập trung.</p></div>
          <div className="user-profile"><div className="profile-avatar">AD</div><div><strong>Quản trị viên</strong><small>Phòng đào tạo</small></div><ChevronDown size={16} /></div>
        </div>
      </aside>

      <main className="main-content" id="students">
        <header className="topbar">
          <div className="breadcrumbs"><span>Quản lý đào tạo</span><span className="crumb-divider">/</span><strong>Sinh viên</strong></div>
          <div className="topbar-right"><span className="system-status"><span /> Hệ thống hoạt động</span><div className="topbar-avatar">AD</div></div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div><div className="eyebrow">QUẢN LÝ ĐÀO TẠO <span>·</span> DANH BẠ</div><h1>Sinh viên</h1><p>Quản lý hồ sơ và thông tin sinh viên của bạn.</p></div>
            <button className="primary-button" onClick={openCreateModal}><CirclePlus size={18} /> Thêm sinh viên</button>
          </div>

          <section className="stats-grid" aria-label="Thống kê sinh viên">
            <article className="stat-card"><div className="stat-icon blue"><Users size={19} /></div><div className="stat-caption">Tổng sinh viên</div><div className="stat-value">{students.length}<span> hồ sơ</span></div><div className="stat-foot"><span className="foot-dot blue-dot" /> Đang được quản lý</div></article>
            <article className="stat-card"><div className="stat-icon violet"><BookOpen size={19} /></div><div className="stat-caption">Lớp đang học</div><div className="stat-value">{classes.length}<span> lớp</span></div><div className="stat-foot"><span className="foot-dot violet-dot" /> Theo danh sách sinh viên</div></article>
            <article className="stat-card"><div className="stat-icon green"><Check size={19} /></div><div className="stat-caption">Có thông tin liên hệ</div><div className="stat-value">{students.filter((student) => student.email || student.phone).length}<span> sinh viên</span></div><div className="stat-foot"><span className="foot-dot green-dot" /> Email hoặc số điện thoại</div></article>
          </section>

          <section className="directory-card">
            <div className="directory-heading"><div><h2>Danh sách sinh viên</h2><p>Thông tin hồ sơ sinh viên trong hệ thống.</p></div><div className="record-count"><span>{filteredStudents.length}</span> kết quả</div></div>
            <div className="toolbar">
              <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, mã sinh viên..." aria-label="Tìm kiếm sinh viên" />{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Xóa tìm kiếm"><X size={15} /></button>}</label>
              <label className="filter-select"><span>Lớp:</span><select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}><option value="all">Tất cả lớp</option>{classes.map((className) => <option key={className} value={className}>{className}</option>)}</select><ChevronDown size={15} /></label>
              <button className="sort-button" type="button" onClick={() => setStudents((current) => [...current].reverse())}><ArrowDownUp size={16} /> Sắp xếp</button>
            </div>

            {error && <div className="alert-error" role="alert"><AlertCircle size={18} /><span>{error}</span><button onClick={() => setError('')} aria-label="Đóng thông báo"><X size={16} /></button></div>}
            <div className="table-wrap">
              <table>
                <thead><tr><th>SINH VIÊN</th><th>MÃ SINH VIÊN</th><th>LỚP</th><th>NGÀY SINH</th><th>LIÊN HỆ</th><th className="actions-heading">THAO TÁC</th></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan={6}><div className="table-state"><LoaderCircle className="spin" size={23} /> Đang tải danh sách...</div></td></tr> : filteredStudents.length === 0 ? <tr><td colSpan={6}><div className="table-state empty-state"><div className="empty-icon"><Users size={23} /></div><strong>{students.length ? 'Không tìm thấy sinh viên' : 'Chưa có dữ liệu sinh viên'}</strong><span>{students.length ? 'Thử thay đổi từ khóa hoặc bộ lọc.' : 'Thêm sinh viên đầu tiên để bắt đầu quản lý.'}</span>{!students.length && <button className="text-button" onClick={openCreateModal}>+ Thêm sinh viên</button>}</div></td></tr> : filteredStudents.map((student, index) => <tr key={student.id}>
                    <td><div className="student-cell"><div className={`student-avatar avatar-${index % 5}`}>{student.hoTen.trim().split(/\s+/).slice(-1)[0]?.charAt(0).toLocaleUpperCase('vi')}</div><div className="student-name"><strong>{student.hoTen}</strong><span>{student.email || 'Chưa cập nhật email'}</span></div></div></td>
                    <td><span className="student-code">{student.maSv}</span></td>
                    <td>{student.lop ? <span className="class-tag">{student.lop}</span> : <span className="muted">—</span>}</td>
                    <td>{student.ngaySinh ? new Date(student.ngaySinh).toLocaleDateString('vi-VN') : <span className="muted">—</span>}</td>
                    <td><span className="contact-cell">{student.phone ? <><Phone size={14} />{student.phone}</> : student.email ? <><Mail size={14} />Email</> : <span className="muted">—</span>}</span></td>
                    <td><div className="row-actions"><button className="icon-button" onClick={() => openEditModal(student)} aria-label={`Sửa ${student.hoTen}`} title="Chỉnh sửa"><Pencil size={16} /></button><button className="icon-button danger-action" onClick={() => void deleteStudent(student)} aria-label={`Xóa ${student.hoTen}`} title="Xóa"><Trash2 size={16} /></button></div></td>
                  </tr>)}
                </tbody>
              </table>
            </div>
            <div className="table-footer"><span>Hiển thị <strong>{filteredStudents.length}</strong> trên <strong>{students.length}</strong> sinh viên</span><span className="footer-note"><span className="foot-dot green-dot" /> Đồng bộ trực tiếp với hệ thống</span></div>
          </section>
          <footer className="page-footer">© 2025 Unispace <span>·</span> Hệ thống quản lý đào tạo</footer>
        </div>
      </main>

      {modalOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setModalOpen(false); }}>
        <section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-heading"><div><span className="modal-eyebrow">HỒ SƠ SINH VIÊN</span><h2 id="modal-title">{editingStudent ? 'Cập nhật thông tin' : 'Thêm sinh viên mới'}</h2><p>Nhập các thông tin bên dưới để {editingStudent ? 'cập nhật hồ sơ.' : 'tạo hồ sơ sinh viên.'}</p></div><button className="icon-button modal-close" type="button" onClick={() => setModalOpen(false)} aria-label="Đóng" disabled={saving}><X size={19} /></button></div>
          <form onSubmit={(event) => void saveStudent(event)}>
            <div className="form-grid">
              <label className="form-field"><span>Mã sinh viên <b>*</b></span><input required maxLength={50} value={form.maSv} onChange={(event) => setForm({ ...form, maSv: event.target.value })} placeholder="VD: SV2025001" /></label>
              <label className="form-field"><span>Họ và tên <b>*</b></span><input required maxLength={200} value={form.hoTen} onChange={(event) => setForm({ ...form, hoTen: event.target.value })} placeholder="Nhập họ và tên" /></label>
              <label className="form-field"><span>Ngày sinh</span><input type="date" value={form.ngaySinh ?? ''} onChange={(event) => setForm({ ...form, ngaySinh: event.target.value })} /></label>
              <label className="form-field"><span>Lớp</span><input maxLength={50} value={form.lop ?? ''} onChange={(event) => setForm({ ...form, lop: event.target.value })} placeholder="VD: CNTT K19" /></label>
              <label className="form-field"><span>Email</span><input type="email" value={form.email ?? ''} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="sinhvien@university.edu.vn" /></label>
              <label className="form-field"><span>Số điện thoại</span><input type="tel" value={form.phone ?? ''} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="090 123 4567" /></label>
            </div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)} disabled={saving}>Hủy</button><button type="submit" className="primary-button" disabled={saving}>{saving ? <><LoaderCircle className="spin" size={17} /> Đang lưu...</> : <><Check size={17} /> {editingStudent ? 'Lưu thay đổi' : 'Thêm sinh viên'}</>}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}

export default App;
