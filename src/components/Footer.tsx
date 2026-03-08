export function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} 校园教师工作平台（示例前端）</span>
      <span className="footer-right">后续可接入学校统一账号系统与教务平台</span>
    </footer>
  );
}

