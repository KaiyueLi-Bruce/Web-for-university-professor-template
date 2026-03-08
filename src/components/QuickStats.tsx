const stats = [
  { label: '本周授课班级', value: '5 个', trend: '+1 班', trendLabel: '较上周' },
  { label: '平均课堂出勤', value: '97%', trend: '+2%', trendLabel: '出勤提升' },
  { label: '作业按时提交', value: '92%', trend: '+5%', trendLabel: '作业完成率' },
  { label: '家校沟通记录', value: '8 条', trend: '本周新增', trendLabel: '' }
];

export function QuickStats() {
  return (
    <section className="section">
      <div className="section-header">
        <h2>教学数据一览</h2>
        <span className="section-tip">数据仅为示例，可后续改为真实统计</span>
      </div>
      <div className="stats-grid">
        {stats.map((item) => (
          <div key={item.label} className="stat-card">
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-trend">
              <span className="stat-trend-main">{item.trend}</span>
              {item.trendLabel && <span className="stat-trend-sub">{item.trendLabel}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

