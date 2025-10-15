# QQ群成员页面结构分析文档

## 页面概览

- **页面URL**: `https://qun.qq.com/member.html#gid={群号}`
- **主表格ID**: `groupMember`
- **数据结构**: 多tbody分段加载
- **测试群组成员总数**: 示例群组约1400+人

## HTML结构分析

### 表格整体结构

```html
<table id="groupMember">
  <tbody>
    <!-- 表头行 -->
    <tr>
      <th>复选框列</th>
      <th>空列</th>
      <th>成员</th>
      <th>群昵称</th>
      <th>QQ号</th>
      <th>性别</th>
      <th>Q龄</th>
      <th>入群时间</th>
      <th>最后发言</th>
      <th>操作列</th>
    </tr>
    <!-- 数据行 -->
  </tbody>
  <tbody>
    <!-- 更多数据行... -->
  </tbody>
  <!-- 多个tbody，每个包含约20条数据 -->
</table>
```

### 关键特征

1. **多tbody分段**: 表格包含多个`<tbody>`元素（示例中约60-70个），总共上千行数据
2. **懒加载机制**: 数据通过多个tbody分批加载，避免单次加载过多DOM
3. **表头**: 第一个tbody的第一行包含`<th>`元素作为表头

## 数据行结构详解

### 完整的TR元素结构

```html
<tr class="mb mb{QQ号}">
  <td class="td-right">
    <!-- 复选框（可能为空或包含checkbox） -->
  </td>

  <td class="td-no">
    <!-- 序号，如: 1, 2, 3... -->
  </td>

  <td class="td-user-nick">
    <!-- 成员信息区 -->
    <!-- 群主标识（如果是群主） -->
    <a class="group-master-a">
      <i class="icon-group-master"></i>
    </a>

    <!-- 管理员标识（如果是管理员） -->
    <a class="group-admin-a">
      <i class="icon-group-admin"></i>
    </a>

    <!-- 头像 -->
    <img class=""
         src="//q4.qlogo.cn/g?b=qq&nk={QQ号}&s=140"
         id="useIcon{QQ号}">

    <!-- 昵称 -->
    <span>用户昵称</span>
  </td>

  <td class="td-card">
    <!-- 群昵称/群名片 -->
    <span>
      <span class="group-card group-card{QQ号}">
        群名片示例
      </span>
      <input class="member-card"
             id="member-card{QQ号}"
             value="群名片示例"
             type="text"
             data-old="群名片示例"
             data-id="{QQ号}">
    </span>
  </td>

  <td>
    <!-- QQ号 -->
    123456789
  </td>

  <td>
    <!-- 性别: 男/女/未知 -->
    男
  </td>

  <td>
    <!-- Q龄: 格式为"X年" -->
    10年
  </td>

  <td>
    <!-- 入群时间: YYYY/MM/DD -->
    2025/01/01
  </td>

  <td>
    <!-- 最后发言: YYYY/MM/DD -->
    2025/01/15
  </td>

  <td class="td-delete">
    <!-- 操作按钮区（删除等） -->
  </td>
</tr>
```

## 数据字段映射

### 可提取的数据字段

| 字段名 | 数据位置 | CSS选择器 | 数据类型 | 说明 |
|--------|----------|-----------|----------|------|
| 序号 | td[1] | `.td-no` | Number | 成员在列表中的序号 |
| QQ昵称 | td[2] span | `.td-user-nick span` | String | 用户的QQ昵称 |
| 头像URL | td[2] img.src | `.td-user-nick img` | String | 格式: `//q4.qlogo.cn/g?b=qq&nk={QQ号}&s=140` |
| QQ号 | td[2] img.id / td[4] | `.td-user-nick img[id]` | String | 从`useIcon{QQ号}`中提取或直接从第5列获取 |
| 是否群主 | td[2] .icon-group-master | `.icon-group-master` | Boolean | 存在该元素则为true |
| 是否管理员 | td[2] .icon-group-admin | `.icon-group-admin` | Boolean | 存在该元素则为true |
| 群昵称/群名片 | td[3] | `.td-card .group-card` | String | 用户在该群的名片，可能为空 |
| QQ号 | td[4] | 第5列文本内容 | String | QQ号码 |
| 性别 | td[5] | 第6列文本内容 | String | 男/女/未知 |
| Q龄 | td[6] | 第7列文本内容 | String | 格式: "X年" |
| 入群时间 | td[7] | 第8列文本内容 | String | 格式: YYYY/MM/DD |
| 最后发言 | td[8] | 第9列文本内容 | String | 格式: YYYY/MM/DD |

## 数据样本

### 样本1（群主）
```json
{
  "no": "1",
  "nickname": "用户A",
  "avatarUrl": "https://q4.qlogo.cn/g?b=qq&nk=123456789&s=140",
  "qqNumber": "123456789",
  "isGroupOwner": true,
  "isAdmin": false,
  "groupCard": "技术部-张三",
  "gender": "男",
  "qAge": "15年",
  "joinTime": "2025/01/01",
  "lastSpeakTime": "2025/01/15"
}
```

### 样本2（普通成员）
```json
{
  "no": "2",
  "nickname": "用户B",
  "avatarUrl": "https://q4.qlogo.cn/g?b=qq&nk=987654321&s=140",
  "qqNumber": "987654321",
  "isGroupOwner": false,
  "isAdmin": false,
  "groupCard": "市场部-李四",
  "gender": "女",
  "qAge": "8年",
  "joinTime": "2025/01/05",
  "lastSpeakTime": "2025/01/14"
}
```

### 样本3（无群名片）
```json
{
  "no": "3",
  "nickname": "用户C",
  "avatarUrl": "https://q4.qlogo.cn/g?b=qq&nk=555666777&s=140",
  "qqNumber": "555666777",
  "isGroupOwner": false,
  "isAdmin": false,
  "groupCard": "",
  "gender": "男",
  "qAge": "3年",
  "joinTime": "2025/01/10",
  "lastSpeakTime": "2025/01/12"
}
```

## 遍历策略建议

### 方案1: 遍历所有tbody
```javascript
const table = document.querySelector('#groupMember');
const tbodies = table.querySelectorAll('tbody');
const members = [];

tbodies.forEach(tbody => {
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    // 跳过表头行
    if (row.querySelector('th')) return;

    const cells = row.querySelectorAll('td');
    if (cells.length === 0) return;

    // 提取数据...
  });
});
```

### 方案2: 直接选择所有数据行
```javascript
const table = document.querySelector('#groupMember');
const allRows = table.querySelectorAll('tbody tr:not(:has(th))');

allRows.forEach(row => {
  const cells = row.querySelectorAll('td');
  // 提取数据...
});
```

## 数据提取完整代码示例

```javascript
function extractAllMembers() {
  const table = document.querySelector('#groupMember');
  if (!table) return [];

  const members = [];
  const tbodies = table.querySelectorAll('tbody');

  tbodies.forEach(tbody => {
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
      // 跳过表头行
      if (row.querySelector('th')) return;

      const cells = row.querySelectorAll('td');
      if (cells.length < 10) return;

      const member = {
        // 序号
        no: cells[1]?.textContent.trim() || '',

        // 成员基本信息
        nickname: cells[2]?.querySelector('span')?.textContent.trim() || '',
        avatarUrl: cells[2]?.querySelector('img')?.src || '',
        qqNumber: cells[4]?.textContent.trim() || '',

        // 角色标识
        isGroupOwner: cells[2]?.querySelector('.icon-group-master') !== null,
        isAdmin: cells[2]?.querySelector('.icon-group-admin') !== null,

        // 群内信息
        groupCard: cells[3]?.querySelector('.group-card')?.textContent.trim().replace(/\s+/g, ' ') || '',
        gender: cells[5]?.textContent.trim() || '',
        qAge: cells[6]?.textContent.trim() || '',
        joinTime: cells[7]?.textContent.trim() || '',
        lastSpeakTime: cells[8]?.textContent.trim() || ''
      };

      members.push(member);
    });
  });

  return members;
}

// 使用示例
const allMembers = extractAllMembers();
console.log(`共提取 ${allMembers.length} 位群成员`);
```

## 注意事项

1. **多tbody结构**: 必须遍历所有tbody，不能只处理第一个
2. **表头过滤**: 第一个tbody包含表头行（含有`<th>`），需要在遍历时跳过
3. **空值处理**: 群名片可能为空，需要做容错处理
4. **头像URL**: 使用`//`开头，需要补充协议（https:）
5. **QQ号提取**: 可以从img的id属性或第5列直接获取，建议使用第5列（更直接）
6. **角色识别**: 通过检查`.icon-group-master`和`.icon-group-admin`判断
7. **特殊字符**: 群名片中可能包含`&nbsp;`等HTML实体，需要适当处理
8. **性别值**: 可能的值为"男"、"女"、"未知"
9. **Q龄格式**: 统一为"X年"格式，新号可能为"0年"

## 统计信息

- **总tbody数**: 根据群成员数量动态生成（示例：60-70个）
- **总成员数**: 取决于具体群组（示例：1000-2000人）
- **群主数**: 1人
- **管理员数**: 0-多人
- **平均每tbody行数**: 约20-21行

## Excel导出建议字段

建议导出的Excel表格列：

1. 序号
2. QQ号
3. QQ昵称
4. 群昵称/群名片
5. 性别
6. Q龄
7. 入群时间
8. 最后发言时间
9. 是否群主
10. 是否管理员
11. 头像URL

---

**文档生成时间**: 2025-10-15
**分析工具**: Chrome DevTools MCP
**页面版本**: QQ群成员管理页面
