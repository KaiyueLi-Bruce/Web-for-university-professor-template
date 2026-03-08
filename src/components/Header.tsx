export function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <span className="logo-mark">校</span>
        <div>
          <div className="header-title">校园教师工作平台</div>
          <div className="header-subtitle">专注老师日常教学与班级管理</div>
        </div>
      </div>
      <nav className="header-nav">
        <button className="nav-item nav-item-active">主页</button>
        <button className="nav-item">课程</button>
        <button className="nav-item">班级</button>
        <button className="nav-item">设置</button>
      </nav>
      <div className="header-right">
        <div className="avatar">张</div>
        <div className="teacher-info">
          <div className="teacher-name">张老师</div>
          <div className="teacher-role">初三数学 · 班主任</div>
        </div>
      </div>
    </header>
  );
}

