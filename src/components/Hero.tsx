export function Hero() {
  const today = new Date();
  const hours = today.getHours();
  const greeting =
    hours < 11 ? '早上好' : hours < 14 ? '中午好' : hours < 18 ? '下午好' : '晚上好';

  const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <section className="hero">
      <div>
        <div className="hero-tag">本周教学总览</div>
        <h1 className="hero-title">
          {greeting}，张老师
          <span className="hero-emoji"> 👋</span>
        </h1>
        <p className="hero-text">
          这里帮你快速查看今日课程安排、待办事项和校园通知，让备课与班级管理更高效。
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary">查看本周课表</button>
          <button className="btn btn-ghost">录入成绩</button>
        </div>
      </div>
      <div className="hero-card">
        <div className="hero-card-title">今天概览</div>
        <div className="hero-card-date">
          {today.getMonth() + 1} 月 {today.getDate()} 日 · 星期
          {weekdayNames[today.getDay()]}
        </div>
        <ul className="hero-card-list">
          <li>
            <span>上课节数</span>
            <strong>4 节</strong>
          </li>
          <li>
            <span>待批改作业</span>
            <strong>2 班</strong>
          </li>
          <li>
            <span>家长留言</span>
            <strong>3 条</strong>
          </li>
        </ul>
      </div>
    </section>
  );
}

