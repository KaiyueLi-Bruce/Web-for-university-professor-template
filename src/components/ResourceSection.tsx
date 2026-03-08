const resources = [
  {
    title: '班级管理',
    description: '花名册、座位表、学生情况记录，一处集中管理。',
    action: '进入班级管理'
  },
  {
    title: '成绩与评语',
    description: '录入平时成绩、考试成绩及学生评语，支持导出报表。',
    action: '管理成绩'
  },
  {
    title: '作业与测验',
    description: '布置作业、在线收集与批改，自动统计完成情况。',
    action: '布置新作业'
  },
  {
    title: '家校沟通',
    description: '统一查看家长留言和系统通知，方便及时反馈。',
    action: '查看家长留言'
  }
];

export function ResourceSection() {
  return (
    <section className="section">
      <div className="section-header">
        <h2>常用功能快捷入口</h2>
        <span className="section-tip">后续可与后台接口打通，点击跳转到真实功能页面</span>
      </div>
      <div className="resource-grid">
        {resources.map((item) => (
          <article key={item.title} className="resource-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button className="link-button">{item.action}</button>
          </article>
        ))}
      </div>
    </section>
  );
}

