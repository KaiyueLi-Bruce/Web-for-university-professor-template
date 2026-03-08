const lessons = [
  {
    time: '08:00 - 08:45',
    subject: '九年级（1）班 数学',
    room: '教学楼 3F · 305',
    type: '讲授新课'
  },
  {
    time: '09:00 - 09:45',
    subject: '九年级（2）班 数学',
    room: '教学楼 3F · 307',
    type: '练习与讲评'
  },
  {
    time: '10:10 - 10:55',
    subject: '九年级（3）班 数学',
    room: '教学楼 4F · 402',
    type: '复习巩固'
  },
  {
    time: '14:00 - 14:45',
    subject: '班会课',
    room: '九年级（1）班教室',
    type: '班级管理'
  }
];

export function TodaySchedule() {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>今日课程安排</h2>
        <button className="link-button">查看完整课表</button>
      </div>
      <ul className="schedule-list">
        {lessons.map((lesson) => (
          <li key={lesson.time} className="schedule-item">
            <div className="schedule-time">{lesson.time}</div>
            <div className="schedule-main">
              <div className="schedule-subject">{lesson.subject}</div>
              <div className="schedule-meta">
                <span>{lesson.room}</span>
                <span className="schedule-tag">{lesson.type}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

