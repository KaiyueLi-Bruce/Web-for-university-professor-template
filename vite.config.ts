import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// 根据部署位置设置 base：这里假设部署到
// https://KaiyueLi-Bruce.github.io/Web-for-university-professor-template/
// 如有变动，可修改为对应的仓库名
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProd ? '/Web-for-university-professor-template/' : '/',
  plugins: [react()],
  server: {
    port: 5173
  }
});
