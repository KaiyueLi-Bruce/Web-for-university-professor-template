const announcements = [
  {
    title: '期中考试命题与监考安排',
    from: '教务处',
    time: '昨天 16:20',
    tag: '教务通知'
  },
  {
    title: '九年级家长会时间与流程说明',
    from: '年级组',
    time: '昨天 09:15',
    tag: '年级通知'
  },
  {
    title: '信息化教学公开课报名',
    from: '教研组',
    time: '周一 14:00',
    tag: '教研活动'
  }
];

export function Announcements() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>校园通知</h2>
        <button className="link-button">全部通知</button>
      </div>
      <ul className="announcement-list">
        {announcements.map((item) => (
          <li key={item.title} className="announcement-item">
            <div className="announcement-main">
              <div className="announcement-title">{item.title}</div>
              <div className="announcement-meta">
                <span>{item.from}</span>
                <span>·</span>
                <span>{item.time}</span>
              </div>
            </div>
            <span className="announcement-tag">{item.tag}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

