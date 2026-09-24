import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './styles.css';
import { attendanceApi, authApi, studentsApi } from './services/api';

const initialStudents = [
  { id: 1, name: 'Ananya Reddy', email: 'ananya@example.com', phone: '+91 98765 43210', rollNo: 'CS-301', course: 'Computer Science', year: '3rd Year', status: 'Active' },
  { id: 2, name: 'Rahul Kumar', email: 'rahul@example.com', phone: '+91 98765 43211', rollNo: 'IT-204', course: 'Information Technology', year: '2nd Year', status: 'Active' },
  { id: 3, name: 'Sneha Sharma', email: 'sneha@example.com', phone: '+91 98765 43212', rollNo: 'CS-401', course: 'Computer Science', year: '4th Year', status: 'Active' },
  { id: 4, name: 'Arjun Prakash', email: 'arjun@example.com', phone: '+91 98765 43213', rollNo: 'EC-102', course: 'Electronics', year: '1st Year', status: 'Active' },
  { id: 5, name: 'Divya Nair', email: 'divya@example.com', phone: '+91 98765 43214', rollNo: 'IT-305', course: 'Information Technology', year: '3rd Year', status: 'Active' },
];

const getStudents = () => JSON.parse(localStorage.getItem('students') || 'null') || initialStudents;
const getAttendance = () => JSON.parse(localStorage.getItem('attendance') || 'null') || {};
const apiUnavailable = (error) => !error.response;
const responseData = (response) => response.data || {};
const normalizeStudent = (student) => ({ ...student, id: student.id || student._id });
const getGreeting = () => {
  const hour = Number(new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    hour12: false,
  }).format(new Date()));
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const greeting = getGreeting();
  return <div className="app-shell">
    <aside className="sidebar">
      <Link className="brand" to="/" aria-label="Go to dashboard"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M20 4 34 10v9c0 8.6-5.8 14.8-14 17-8.2-2.2-14-8.4-14-17v-9l14-6Z" fill="none" stroke="currentColor" strokeWidth="2.5"/><path d="m12 20 5 5 11-11" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg></span><span>Student<br /><b>Attendance</b><small>MANAGEMENT SYSTEM</small></span></Link>
      <div className="user-card"><div className="avatar">AP</div><div><b>Admin User</b><small>Administrator</small></div></div>
      <nav className="side-nav">
        <p className="nav-label">MENU</p>
        <NavLink to="/" end><span className="nav-icon">⌂</span><span>Dashboard</span></NavLink>
        <NavLink to="/students"><span className="nav-icon">♙</span><span>Students</span></NavLink>
        <NavLink to="/attendance"><span className="nav-icon">✓</span><span>Attendance</span></NavLink>
      </nav>
      <button className="logout" onClick={() => { sessionStorage.removeItem('attendance-auth'); sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); navigate('/login'); }}>↪ <span>Logout</span></button>
    </aside>
    <section className="content"><header><div><h2>{greeting}, Admin! <span className="wave">👋</span></h2><p>Here’s what’s happening with your students today.</p></div><div className="header-actions"><span className="bell">♧</span><div className="mini-avatar">AP</div></div></header>{children}</section>
  </div>;
};

const Dashboard = () => {
  const students = getStudents();
  const attendance = getAttendance();
  const present = Object.values(attendance).filter((x) => x === 'Present').length;
  return <main className="dashboard-page">
    <div className="stats">
      <Stat icon="♙" color="blue" label="Total Students" value={students.length} note="+12% from last month" />
      <Stat icon="✓" color="green" label="Present Today" value={present} note={`${students.length ? Math.round((present / students.length) * 100) : 0}% attendance rate`} />
      <Stat icon="!" color="orange" label="Absent Today" value={Math.max(students.length - present, 0)} note={`${students.length ? Math.round(((students.length - present) / students.length) * 100) : 0}% of total students`} />
      <Stat icon="◷" color="purple" label="Avg. Attendance" value="87.5%" note="+3.2% from last month" />
    </div>
    <div className="grid-two"><div className="panel chart-panel"><div className="panel-title"><div><h3>Attendance Overview</h3><p>Weekly attendance statistics</p></div><select><option>This Week</option><option>This Month</option></select></div><div className="chart"><div className="bars">{[64,76,55,82,68,91,72].map((h, i) => <div className="bar-group" key={i}><div className="bar" style={{ height: `${h}%` }}></div><small>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</small></div>)}</div></div></div>
      <div className="panel"><div className="panel-title"><div><h3>Recent Activity</h3><p>Latest attendance updates</p></div><Link to="/attendance" className="view-link">View all</Link></div><Activity name="Ananya Reddy" text="marked present" time="2 mins ago" /><Activity name="Rahul Kumar" text="marked absent" time="18 mins ago" absent /><Activity name="Sneha Sharma" text="marked present" time="35 mins ago" /><Activity name="Arjun Prakash" text="marked late" time="1 hour ago" late /></div></div>
    <div className="panel quick-panel"><div><h3>Quick Actions</h3><p>Manage your attendance easily</p></div><div className="quick-actions"><Link to="/students" className="action blue-action">＋ <span>Add New Student</span></Link><Link to="/attendance" className="action green-action">✓ <span>Mark Attendance</span></Link><Link to="/students" className="action purple-action">▤ <span>View Reports</span></Link></div></div>
  </main>;
};

const Stat = ({ icon, color, label, value, note }) => <div className="stat"><span className={`stat-icon ${color}`}>{icon}</span><div><p>{label}</p><strong>{value}</strong><small className={color === 'orange' ? 'negative' : ''}>{note}</small></div></div>;
const Activity = ({ name, text, time, absent, late }) => <div className="activity"><span className={`activity-dot ${absent ? 'absent' : late ? 'late' : ''}`}>{absent ? '!' : late ? '◷' : '✓'}</span><div><b>{name}</b><span> {text}</span><small>{time}</small></div></div>;

const Students = () => {
  const emptyForm = { name: '', email: '', phone: '', rollNo: '', course: 'Computer Science', year: '1st Year', status: 'Active', parentName: '', parentPhone: '', parentEmail: '', address: '', photo: '', signature: '' };
  const [students, setStudents] = useState(getStudents);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    studentsApi.list({ limit: 100 }).then((response) => setStudents((responseData(response).students || []).map(normalizeStudent))).catch((requestError) => {
      setError(apiUnavailable(requestError) ? 'API unavailable. Showing local demo data.' : (requestError.response?.data?.message || 'Unable to load students.'));
    }).finally(() => setLoading(false));
  }, []);
  const filtered = useMemo(() => students.filter((s) => {
    const matchesSearch = `${s.name} ${s.email} ${s.course} ${s.rollNo || ''} ${s.phone || ''}`.toLowerCase().includes(query.toLowerCase());
    return matchesSearch && (statusFilter === 'All' || (s.status || 'Active') === statusFilter);
  }), [students, query, statusFilter]);
  const saveStudent = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = editingId ? await studentsApi.update(editingId, form) : await studentsApi.create(form);
      const savedStudent = responseData(response).student;
      const normalized = normalizeStudent(savedStudent);
      setStudents(editingId ? students.map((student) => student.id === editingId ? normalized : student) : [normalized, ...students]);
    } catch (requestError) {
      if (!apiUnavailable(requestError)) { setError(requestError.response?.data?.message || 'Unable to save student.'); return; }
      const next = editingId ? students.map((student) => student.id === editingId ? { ...student, ...form } : student) : [...students, { ...form, id: Date.now() }];
      setStudents(next); localStorage.setItem('students', JSON.stringify(next)); setError('API unavailable. Saved to local demo data.');
    }
    setForm(emptyForm); setEditingId(null); setShowForm(false);
  };
  const edit = (student) => { setForm({ ...emptyForm, ...student }); setEditingId(student.id); setShowForm(true); };
  const selectPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, photo: reader.result }));
    reader.readAsDataURL(file);
  };
  const selectSignature = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, signature: reader.result }));
    reader.readAsDataURL(file);
  };
  const remove = async (id) => {
    setError('');
    try { await studentsApi.remove(id); setStudents(students.filter((s) => s.id !== id)); }
    catch (requestError) {
      if (!apiUnavailable(requestError)) { setError(requestError.response?.data?.message || 'Unable to delete student.'); return; }
      const next = students.filter((s) => s.id !== id); setStudents(next); localStorage.setItem('students', JSON.stringify(next)); setError('API unavailable. Removed from local demo data.');
    }
  };
  return <main className="students-page"><div className="page-heading"><div><h1>Students</h1><p>Manage profiles, contact details and enrollment status</p></div><button className="primary" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }}>＋ Add Student</button></div>{loading && <div className="save-message">Loading students…</div>}{error && <div className="login-error">{error}</div>}
    <div className="student-summary"><div><b>{students.length}</b><span>Total enrolled</span></div><div><b>{students.filter((s) => (s.status || 'Active') === 'Active').length}</b><span>Active students</span></div><div><b>{new Set(students.map((s) => s.course)).size}</b><span>Departments</span></div><div><b>{students.filter((s) => !s.phone || !s.rollNo || !s.parentName || !s.address).length}</b><span>Profiles to complete</span></div></div>
    {showForm && <form className="panel student-form" onSubmit={saveStudent}><h3>{editingId ? 'Edit Student Profile' : 'Add New Student'}</h3><div className="form-section-title">Student photo, signature and details</div><label className="photo-upload"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectPhoto} />{form.photo ? <img src={form.photo} alt="Student preview" /> : <span className="photo-placeholder">＋<small>Upload photo</small></span>}<span className="photo-help">Photo · max 2 MB</span></label><label className="signature-upload"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectSignature} />{form.signature ? <img src={form.signature} alt="Student signature preview" /> : <span className="signature-placeholder">✎<small>Upload signature</small></span>}<span className="photo-help">Signature · max 2 MB</span></label><input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input required placeholder="Roll number" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} /><input required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input required placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}><option>Computer Science</option><option>Information Technology</option><option>Electronics</option><option>Mechanical Engineering</option><option>Civil Engineering</option></select><select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select><div className="form-section-title">Parent / guardian details</div><input placeholder="Parent / guardian full name" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} /><input placeholder="Parent phone number" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} /><input type="email" placeholder="Parent email address" value={form.parentEmail} onChange={(e) => setForm({ ...form, parentEmail: e.target.value })} /><div className="form-section-title">Full residential address</div><textarea className="address-field" rows="3" placeholder="House / flat no., street, village / city, district, state, PIN code" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /><button className="primary">{editingId ? 'Update Student' : 'Save Student'}</button></form>}
    <div className="panel table-panel"><div className="table-tools"><h3>All Students <span className="count">{filtered.length}</span></h3><div className="table-filters"><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option>All</option><option>Active</option><option>Inactive</option></select><input placeholder="⌕  Search name, roll no..." value={query} onChange={(e) => setQuery(e.target.value)} /></div></div><div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>ROLL NO.</th><th>CONTACT</th><th>COURSE / YEAR</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{filtered.map((s) => <tr key={s.id}><td><span className="table-avatar">{s.photo ? <img src={s.photo} alt="" /> : s.name.split(' ').map((x) => x[0]).join('')}</span><b>{s.name}</b></td><td>{s.rollNo || 'Not added'}</td><td><span>{s.email}</span><small className="phone-cell">{s.phone || 'Phone not added'}</small></td><td>{s.course}<small className="phone-cell">{s.year}</small></td><td><span className={`status-pill ${(s.status || 'Active').toLowerCase()}`}>{s.status || 'Active'}</span></td><td><button className="edit" onClick={() => edit(s)}>Edit</button><button className="delete" onClick={() => remove(s.id)}>Delete</button></td></tr>)}</tbody></table></div></div>
  </main>;
};

const Attendance = () => {
  const [students, setStudents] = useState(getStudents);
  const [records, setRecords] = useState(getAttendance);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [query, setQuery] = useState('');
  const [course, setCourse] = useState('All departments');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    studentsApi.list({ limit: 100 }).then((response) => setStudents((responseData(response).students || []).map(normalizeStudent))).catch((requestError) => {
      setError(apiUnavailable(requestError) ? 'API unavailable. Showing local demo data.' : (requestError.response?.data?.message || 'Unable to load students.'));
    });
    attendanceApi.list(date).then((response) => {
      setRecords(Object.fromEntries((responseData(response).records || []).map((record) => [record.student?._id || record.student, record.status])));
    }).catch((requestError) => {
      if (apiUnavailable(requestError)) setRecords(getAttendance());
      else setError(requestError.response?.data?.message || 'Unable to load attendance.');
    }).finally(() => setLoading(false));
  }, [date]);
  const update = (id, status) => { setRecords({ ...records, [id]: status }); setSaved(false); };
  const markAllPresent = () => { setRecords(Object.fromEntries(students.map((student) => [student.id, 'Present']))); setSaved(false); };
  const saveAttendance = async () => {
    setError('');
    try {
      await Promise.all(Object.entries(records).map(([student, status]) => attendanceApi.save({ student, date: `${date}T00:00:00.000Z`, status, notes })));
      setSaved(true);
    } catch (requestError) {
      if (!apiUnavailable(requestError)) { setError(requestError.response?.data?.message || 'Unable to save attendance.'); return; }
      localStorage.setItem('attendance', JSON.stringify(records)); localStorage.setItem('attendanceMeta', JSON.stringify({ date, notes })); setSaved(true); setError('API unavailable. Saved to local demo data.');
    }
  };
  const clearMarks = () => { setRecords({}); setSaved(false); };
  const departments = ['All departments', ...new Set(students.map((student) => student.course))];
  const filtered = students.filter((student) => `${student.name} ${student.rollNo || ''}`.toLowerCase().includes(query.toLowerCase()) && (course === 'All departments' || student.course === course));
  const presentCount = Object.values(records).filter((status) => status === 'Present').length;
  const absentCount = Object.values(records).filter((status) => status === 'Absent').length;
  const lateCount = Object.values(records).filter((status) => status === 'Late').length;
  return <main className="attendance-page"><div className="page-heading"><div><h1>Mark Attendance</h1><p>Choose a status for every student and save the daily record</p></div><label className="date-picker">Attendance date<input type="date" value={date} onChange={(e) => { setDate(e.target.value); setSaved(false); }} /></label></div>{loading && <div className="save-message">Loading attendance…</div>}{error && <div className="login-error">{error}</div>}<div className="attendance-summary-cards"><div className="summary-present"><b>{presentCount}</b><span>Present</span></div><div className="summary-absent"><b>{absentCount}</b><span>Absent</span></div><div className="summary-late"><b>{lateCount}</b><span>Late</span></div><div className="summary-unmarked"><b>{students.length - Object.keys(records).length}</b><span>Unmarked</span></div></div><div className="panel table-panel"><div className="attendance-toolbar"><div><h3>Student attendance</h3><p>{Object.keys(records).length} of {students.length} students marked</p></div><div className="attendance-actions"><button className="secondary-action" onClick={markAllPresent}>✓ Mark all present</button><button className="clear-action" onClick={clearMarks}>Clear marks</button><button className="primary save-attendance" onClick={saveAttendance}>Save Attendance</button></div></div><div className="attendance-filters"><input placeholder="⌕ Search student or roll no." value={query} onChange={(e) => setQuery(e.target.value)} /><select value={course} onChange={(e) => setCourse(e.target.value)}>{departments.map((department) => <option key={department}>{department}</option>)}</select></div><div className="attendance-list">{filtered.map((s) => <div className="attendance-row" key={s.id}><span className="table-avatar">{s.name.split(' ').map((x) => x[0]).join('')}</span><div className="student-info"><b>{s.name}</b><small>{s.rollNo || 'No roll number'} · {s.course}</small></div><div className="status-buttons"><button type="button" className={records[s.id] === 'Present' ? 'selected present' : ''} onClick={() => update(s.id, 'Present')}>✓ Present</button><button type="button" className={records[s.id] === 'Absent' ? 'selected absent' : ''} onClick={() => update(s.id, 'Absent')}>! Absent</button><button type="button" className={records[s.id] === 'Late' ? 'selected late' : ''} onClick={() => update(s.id, 'Late')}>◷ Late</button></div></div>)}</div><label className="attendance-notes">Notes for this date<textarea rows="2" placeholder="Optional notes, exam day, holiday, or class remarks..." value={notes} onChange={(e) => setNotes(e.target.value)} /></label>{saved && <div className="save-message">✓ Attendance saved successfully for {new Date(`${date}T00:00:00`).toLocaleDateString()}.</div>}</div></main>;
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const signIn = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password to continue.');
      return;
    }
    setError('');
    try {
      const response = await authApi.login({ email, password });
      sessionStorage.setItem('token', responseData(response).token);
      sessionStorage.setItem('user', JSON.stringify(responseData(response).user));
      sessionStorage.setItem('attendance-auth', 'true');
      navigate('/');
    } catch (requestError) {
      if (apiUnavailable(requestError)) {
        sessionStorage.setItem('attendance-auth', 'true');
        setError('API unavailable. Using local demo mode.');
        navigate('/');
      } else setError(requestError.response?.data?.message || 'Unable to sign in.');
    }
  };
  return <div className="login-page"><div className="login-card"><span className="brand-mark large">SA</span><h1>Welcome back</h1><p>Sign in to manage student attendance</p><form onSubmit={signIn}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" /></label>{error && <div className="login-error">{error}</div>}<button className="primary full" type="submit">Sign in</button></form><small>Demo mode — use any non-empty credentials</small></div></div>;
};

const ProtectedApp = () => (sessionStorage.getItem('token') || sessionStorage.getItem('attendance-auth') === 'true')
  ? <Layout><Routes><Route path="/" element={<Dashboard />} /><Route path="/students" element={<Students />} /><Route path="/attendance" element={<Attendance />} /></Routes></Layout>
  : <Navigate to="/login" replace />;

const App = () => (
  <BrowserRouter>
    <Routes><Route path="/login" element={<Login />} /><Route path="*" element={<ProtectedApp />} /></Routes>
  </BrowserRouter>
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
);
