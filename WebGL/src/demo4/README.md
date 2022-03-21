## 绘制渐变三角形：深入理解缓冲区

两种实现方式：
- 多个buffer，通过bindBuffer切换 —— index.js
- 单个buffer, 通过vertexAttribPointer 设置读取方式 —— once_buffer.js
