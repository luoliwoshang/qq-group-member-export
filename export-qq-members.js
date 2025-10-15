(function() {
  'use strict';

  // 检查是否已经加载过脚本
  if (window.__QQ_MEMBER_EXPORTER_LOADED__) {
    console.log('🎉 QQ群成员导出脚本已经加载过了！');
    return;
  }
  window.__QQ_MEMBER_EXPORTER_LOADED__ = true;

  console.log('%c🚀 QQ群成员导出脚本已加载！', 'color: #00ff00; font-size: 16px; font-weight: bold;');
  console.log('%c✨ 准备创建导出按钮...', 'color: #00bfff; font-size: 14px;');

  // 数据提取函数
  function extractMembers() {
    const table = document.querySelector('#groupMember');
    if (!table) {
      console.error('❌ 未找到群成员表格！');
      return [];
    }

    const members = [];
    const tbodies = table.querySelectorAll('tbody');

    console.log(`📊 发现 ${tbodies.length} 个tbody区块`);

    tbodies.forEach((tbody, tbodyIndex) => {
      const rows = tbody.querySelectorAll('tr');

      rows.forEach((row, rowIndex) => {
        // 跳过表头行
        if (row.querySelector('th')) return;

        const cells = row.querySelectorAll('td');
        if (cells.length < 10) return;

        // 提取QQ号（第5列，index=4）
        const qqNumber = cells[4]?.textContent.trim() || '';

        // 提取群昵称（第4列，index=3）
        const groupCardElement = cells[3]?.querySelector('.group-card');
        let groupCard = '';
        if (groupCardElement) {
          groupCard = groupCardElement.textContent.trim().replace(/\s+/g, ' ');
          // 移除&nbsp;等HTML实体
          groupCard = groupCard.replace(/\u00A0/g, ' ').trim();
        }

        if (qqNumber) {
          members.push({
            qqNumber,
            groupCard
          });
        }
      });
    });

    console.log(`✅ 成功提取 ${members.length} 位群成员数据`);
    return members;
  }

  // CSV导出函数
  function exportToCSV(members) {
    if (members.length === 0) {
      alert('⚠️ 没有可导出的数据！');
      return;
    }

    // 创建CSV内容
    const csvRows = [];

    // 添加BOM以支持Excel正确显示中文
    csvRows.push('\uFEFF');

    // CSV标题
    csvRows.push('QQ号,群昵称');

    // 添加数据行
    members.forEach(member => {
      // 处理可能包含逗号的群昵称
      const groupCard = member.groupCard.includes(',')
        ? `"${member.groupCard}"`
        : member.groupCard;
      csvRows.push(`${member.qqNumber},${groupCard}`);
    });

    const csvContent = csvRows.join('\n');

    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // 生成文件名（包含时间戳）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `QQ群成员_${timestamp}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log(`🎊 成功导出 ${members.length} 条数据到文件: ${filename}`);

    // 显示成功提示
    showNotification(`🎉 成功导出 ${members.length} 条数据！`, 'success');
  }

  // 显示通知
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      padding: 15px 25px;
      background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
      color: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 999999;
      font-size: 14px;
      font-weight: bold;
      animation: slideIn 0.3s ease-out;
      backdrop-filter: blur(10px);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    @keyframes gradient {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    .qq-export-btn {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .qq-export-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6) !important;
    }

    .qq-export-btn:active {
      transform: translateY(0);
    }

    .github-link {
      transition: all 0.3s ease;
    }

    .github-link:hover {
      transform: scale(1.1) rotate(5deg);
    }
  `;
  document.head.appendChild(style);

  // 创建导出按钮容器
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-end;
  `;

  // 创建导出按钮
  const exportButton = document.createElement('button');
  exportButton.className = 'qq-export-btn';
  exportButton.innerHTML = `
    <span style="margin-right: 8px;">📊</span>
    <span>导出群成员</span>
  `;
  exportButton.style.cssText = `
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-size: 200% 200%;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    display: flex;
    align-items: center;
    animation: gradient 3s ease infinite;
    backdrop-filter: blur(10px);
  `;

  // 创建GitHub链接
  const githubLink = document.createElement('a');
  githubLink.className = 'github-link';
  githubLink.href = 'https://github.com/luoliwoshang';
  githubLink.target = '_blank';
  githubLink.innerHTML = `
    <div style="
      padding: 8px 16px;
      background: linear-gradient(135deg, #24292e 0%, #4a5568 100%);
      color: white;
      border-radius: 8px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    ">
      <svg height="16" width="16" viewBox="0 0 16 16" fill="white">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
      <span>by luoliwoshang</span>
    </div>
  `;

  // 按钮点击事件
  exportButton.addEventListener('click', () => {
    console.log('🔄 开始提取数据...');
    exportButton.disabled = true;
    exportButton.style.opacity = '0.6';
    exportButton.style.cursor = 'not-allowed';

    // 添加加载动画
    exportButton.innerHTML = `
      <span style="margin-right: 8px;">⏳</span>
      <span>导出中...</span>
    `;

    setTimeout(() => {
      const members = extractMembers();
      exportToCSV(members);

      // 恢复按钮状态
      exportButton.disabled = false;
      exportButton.style.opacity = '1';
      exportButton.style.cursor = 'pointer';
      exportButton.innerHTML = `
        <span style="margin-right: 8px;">📊</span>
        <span>导出群成员</span>
      `;
    }, 300);
  });

  // 组装UI
  container.appendChild(exportButton);
  container.appendChild(githubLink);
  document.body.appendChild(container);

  console.log('%c✅ 导出按钮已添加到页面右上角！', 'color: #00ff00; font-size: 14px; font-weight: bold;');
  console.log('%c💡 点击"导出群成员"按钮即可导出CSV文件', 'color: #ffa500; font-size: 12px;');
  console.log('%c📝 导出格式: QQ号,群昵称', 'color: #00bfff; font-size: 12px;');

  // 显示欢迎通知
  showNotification('✨ 导出工具已就绪！', 'info');
})();
