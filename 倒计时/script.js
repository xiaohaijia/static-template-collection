// 全局变量
let togetherDate = null;
let birthday1 = null;
let birthday2 = null;
let selectedMood = null;
let currentTheme = 'default'; // 添加主题全局变量

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    loadData();
    
    // 设置事件监听器
    document.getElementById('save-dates').addEventListener('click', saveDates);
    document.getElementById('save-mood').addEventListener('click', saveMood);
    document.getElementById('add-goal').addEventListener('click', addGoal);
    document.getElementById('add-event').addEventListener('click', addCustomEvent);
    document.getElementById('save-letter').addEventListener('click', saveLetter);
    document.getElementById('reset-data').addEventListener('click', resetData);
    document.getElementById('close-notification').addEventListener('click', closeNotification);
    document.getElementById('memory-upload').addEventListener('change', uploadMemory);
    document.getElementById('import-data').addEventListener('change', importData);
    document.getElementById('export-data').addEventListener('click', exportData);
    
    // 设置表情选择事件
    document.querySelectorAll('.emoji').forEach(emoji => {
        emoji.addEventListener('click', function() {
            document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
            this.classList.add('selected');
            selectedMood = this.getAttribute('data-mood');
        });
    });
    
    // 设置主题选择器事件
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function() {
            const themeId = this.getAttribute('data-theme');
            changeTheme(themeId);
            // 更新选中状态
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // 加载主题
    loadTheme();
    
    // 启动计时器
    if (togetherDate) {
        startCounter();
        updateUpcomingEvents();
        updateMilestones();
    }
});

// 保存日期信息
function saveDates() {
    const togetherDateInput = document.getElementById('together-date').value;
    const birthday1Input = document.getElementById('birthday1').value;
    const birthday2Input = document.getElementById('birthday2').value;
    
    if (!togetherDateInput) {
        showNotification('请输入在一起的日期');
        return;
    }
    
    togetherDate = togetherDateInput;
    birthday1 = birthday1Input;
    birthday2 = birthday2Input;
    
    // 保存到本地存储
    localStorage.setItem('togetherDate', togetherDate);
    localStorage.setItem('birthday1', birthday1);
    localStorage.setItem('birthday2', birthday2);
    
    // 显示主内容
    document.getElementById('setup-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    
    // 启动计时器
    startCounter();
    updateUpcomingEvents();
    updateMilestones();
    
    showNotification('日期保存成功！');
}

// 加载保存的数据
function loadData() {
    // 加载日期信息
    togetherDate = localStorage.getItem('togetherDate');
    birthday1 = localStorage.getItem('birthday1');
    birthday2 = localStorage.getItem('birthday2');
    
    if (togetherDate) {
        document.getElementById('together-date').value = togetherDate;
        document.getElementById('setup-section').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }
    
    if (birthday1) {
        document.getElementById('birthday1').value = birthday1;
    }
    
    if (birthday2) {
        document.getElementById('birthday2').value = birthday2;
    }
    
    // 加载心情记录
    loadMoods();
    
    // 加载目标列表
    loadGoals();
    
    // 加载自定义事件
    loadCustomEvents();
    
    // 加载信件
    loadLetters();
    
    // 加载回忆照片
    loadMemories();
}

// 启动计时器
function startCounter() {
    updateCounter();
    setInterval(updateCounter, 1000);
}

// 更新计数器
function updateCounter() {
    if (!togetherDate) return;
    
    const startDate = new Date(togetherDate);
    const now = new Date();
    const diff = now - startDate;
    
    // 计算天数、小时、分钟和秒数
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // 更新显示
    document.getElementById('days-together').textContent = days;
    document.getElementById('hours-together').textContent = hours;
    document.getElementById('minutes-together').textContent = minutes;
    document.getElementById('seconds-together').textContent = seconds;
}

// 更新即将到来的纪念日
function updateUpcomingEvents() {
    if (!togetherDate) return;
    
    const eventsList = document.getElementById('upcoming-events-list');
    eventsList.innerHTML = '';
    
    const now = new Date();
    const events = [];
    
    // 添加在一起的纪念日（每月、每100天等）
    const startDate = new Date(togetherDate);
    
    // 下一个月纪念日
    const nextMonthDate = new Date(startDate);
    let monthCount = 0;
    while (nextMonthDate <= now) {
        nextMonthDate.setMonth(startDate.getMonth() + monthCount + 1);
        monthCount++;
    }
    events.push({
        name: `在一起${monthCount}个月纪念日`,
        date: nextMonthDate,
        daysLeft: Math.ceil((nextMonthDate - now) / (1000 * 60 * 60 * 24))
    });
    
    // 下一个100天纪念日
    const daysTogether = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const next100Days = Math.ceil(daysTogether / 100) * 100;
    const next100Date = new Date(startDate.getTime() + next100Days * 24 * 60 * 60 * 1000);
    events.push({
        name: `在一起${next100Days}天纪念日`,
        date: next100Date,
        daysLeft: Math.ceil((next100Date - now) / (1000 * 60 * 60 * 24))
    });
    
    // 添加生日
    if (birthday1) {
        const bday1 = new Date(birthday1);
        const nextBday1 = new Date(now.getFullYear(), bday1.getMonth(), bday1.getDate());
        if (nextBday1 < now) {
            nextBday1.setFullYear(now.getFullYear() + 1);
        }
        events.push({
            name: 'Ta的生日',
            date: nextBday1,
            daysLeft: Math.ceil((nextBday1 - now) / (1000 * 60 * 60 * 24))
        });
    }
    
    if (birthday2) {
        const bday2 = new Date(birthday2);
        const nextBday2 = new Date(now.getFullYear(), bday2.getMonth(), bday2.getDate());
        if (nextBday2 < now) {
            nextBday2.setFullYear(now.getFullYear() + 1);
        }
        events.push({
            name: '你的生日',
            date: nextBday2,
            daysLeft: Math.ceil((nextBday2 - now) / (1000 * 60 * 60 * 24))
        });
    }
    
    // 添加节假日
    const holidays = [
        { name: '情人节', month: 1, day: 14 },
        { name: '520', month: 4, day: 20 },
        { name: '七夕', month: 7, day: 7 }, // 注意：这是阳历的近似日期，实际应该使用农历
        { name: '圣诞节', month: 11, day: 25 }
    ];
    
    holidays.forEach(holiday => {
        const holidayDate = new Date(now.getFullYear(), holiday.month, holiday.day);
        if (holidayDate < now) {
            holidayDate.setFullYear(now.getFullYear() + 1);
        }
        events.push({
            name: holiday.name,
            date: holidayDate,
            daysLeft: Math.ceil((holidayDate - now) / (1000 * 60 * 60 * 24))
        });
    });
    
    // 添加自定义事件
    const customEvents = JSON.parse(localStorage.getItem('customEvents') || '[]');
    customEvents.forEach(event => {
        const eventDate = new Date(event.date);
        // 如果是周年纪念日，计算下一个周年
        if (event.isAnnual) {
            while (eventDate < now) {
                eventDate.setFullYear(eventDate.getFullYear() + 1);
            }
        } else if (eventDate < now) {
            // 如果是一次性事件且已经过去，则不显示
            return;
        }
        
        events.push({
            name: event.name,
            date: eventDate,
            daysLeft: Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24))
        });
    });
    
    // 按剩余天数排序
    events.sort((a, b) => a.daysLeft - b.daysLeft);
    
    // 只显示最近的5个事件
    events.slice(0, 5).forEach(event => {
        const li = document.createElement('li');
        const dateStr = event.date.toLocaleDateString('zh-CN');
        li.innerHTML = `<strong>${event.name}</strong>: ${dateStr} (还有${event.daysLeft}天)`;
        eventsList.appendChild(li);
    });
}

// 更新爱情里程碑
function updateMilestones() {
    if (!togetherDate) return;
    
    const milestonesList = document.getElementById('milestones-list');
    milestonesList.innerHTML = '';
    
    const startDate = new Date(togetherDate);
    const now = new Date();
    const daysTogether = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    
    // 定义里程碑
    const milestones = [
        { days: 1, name: '在一起1天' },
        { days: 10, name: '在一起10天' },
        { days: 30, name: '在一起1个月' },
        { days: 100, name: '在一起100天' },
        { days: 365, name: '在一起1年' },
        { days: 500, name: '在一起500天' },
        { days: 730, name: '在一起2年' },
        { days: 1000, name: '在一起1000天' },
        { days: 1095, name: '在一起3年' },
        { days: 1460, name: '在一起4年' },
        { days: 1825, name: '在一起5年' },
        { days: 3650, name: '在一起10年' }
    ];
    
    // 过滤已达成的里程碑
    const achievedMilestones = milestones.filter(m => daysTogether >= m.days);
    const upcomingMilestones = milestones.filter(m => daysTogether < m.days)
                                        .slice(0, 3); // 只显示即将到来的3个里程碑
    
    // 显示已达成的里程碑
    if (achievedMilestones.length > 0) {
        const recentMilestones = achievedMilestones.slice(-3); // 只显示最近的3个已达成里程碑
        recentMilestones.forEach(milestone => {
            const li = document.createElement('li');
            const milestoneDate = new Date(startDate.getTime() + milestone.days * 24 * 60 * 60 * 1000);
            const dateStr = milestoneDate.toLocaleDateString('zh-CN');
            li.innerHTML = `<span>✓ ${milestone.name}</span> <span style="color: #999;">${dateStr}</span>`;
            milestonesList.appendChild(li);
        });
    }
    
    // 显示即将到来的里程碑
    upcomingMilestones.forEach(milestone => {
        const li = document.createElement('li');
        const milestoneDate = new Date(startDate.getTime() + milestone.days * 24 * 60 * 60 * 1000);
        const dateStr = milestoneDate.toLocaleDateString('zh-CN');
        const daysLeft = Math.ceil((milestoneDate - now) / (1000 * 60 * 60 * 24));
        li.innerHTML = `<span>${milestone.name}</span> <span style="color: #999;">${dateStr} (还有${daysLeft}天)</span>`;
        milestonesList.appendChild(li);
    });
}

// 保存心情记录
function saveMood() {
    const moodText = document.getElementById('mood-text').value.trim();
    
    if (!moodText) {
        showNotification('请输入心情内容');
        return;
    }
    
    if (!selectedMood) {
        showNotification('请选择一个表情');
        return;
    }
    
    const mood = {
        text: moodText,
        emoji: selectedMood,
        date: new Date().toISOString()
    };
    
    // 获取现有的心情记录
    const moods = JSON.parse(localStorage.getItem('moods') || '[]');
    moods.unshift(mood); // 添加到数组开头
    
    // 保存到本地存储
    localStorage.setItem('moods', JSON.stringify(moods));
    
    // 清空输入框和选择的表情
    document.getElementById('mood-text').value = '';
    document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
    selectedMood = null;
    
    // 更新显示
    loadMoods();
    
    showNotification('心情记录已保存');
}

// 加载心情记录
function loadMoods() {
    const moodHistory = document.getElementById('mood-history');
    moodHistory.innerHTML = '';
    
    const moods = JSON.parse(localStorage.getItem('moods') || '[]');
    
    moods.forEach(mood => {
        const moodDate = new Date(mood.date);
        const dateStr = moodDate.toLocaleDateString('zh-CN') + ' ' + moodDate.toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'});
        
        const moodEntry = document.createElement('div');
        moodEntry.className = 'mood-entry';
        moodEntry.innerHTML = `
            <div class="date">${dateStr}</div>
            <div>${getEmojiByMood(mood.emoji)} ${mood.text}</div>
        `;
        
        moodHistory.appendChild(moodEntry);
    });
}

// 根据心情类型返回对应的表情
function getEmojiByMood(mood) {
    const emojis = {
        'happy': '😊',
        'love': '😍',
        'sad': '😢',
        'angry': '😠',
        'neutral': '😐'
    };
    
    return emojis[mood] || '😊';
}

// 添加目标
function addGoal() {
    const goalText = document.getElementById('goal-text').value.trim();
    
    if (!goalText) {
        showNotification('请输入目标内容');
        return;
    }
    
    const goal = {
        text: goalText,
        completed: false,
        date: new Date().toISOString()
    };
    
    // 获取现有的目标列表
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    goals.push(goal);
    
    // 保存到本地存储
    localStorage.setItem('goals', JSON.stringify(goals));
    
    // 清空输入框
    document.getElementById('goal-text').value = '';
    
    // 更新显示
    loadGoals();
    
    showNotification('目标已添加');
}

// 加载目标列表
function loadGoals() {
    const goalsList = document.getElementById('goals-list');
    goalsList.innerHTML = '';
    
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    
    goals.forEach((goal, index) => {
        const li = document.createElement('li');
        li.className = 'goal-item' + (goal.completed ? ' completed' : '');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = goal.completed;
        checkbox.addEventListener('change', function() {
            toggleGoalCompletion(index);
        });
        
        const span = document.createElement('span');
        span.textContent = goal.text;
        
        li.appendChild(checkbox);
        li.appendChild(span);
        goalsList.appendChild(li);
    });
}

// 切换目标完成状态
function toggleGoalCompletion(index) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    
    if (index >= 0 && index < goals.length) {
        goals[index].completed = !goals[index].completed;
        localStorage.setItem('goals', JSON.stringify(goals));
        loadGoals();
        
        if (goals[index].completed) {
            showNotification('恭喜完成一个目标！');
        }
    }
}

// 添加自定义事件
function addCustomEvent() {
    const eventName = document.getElementById('event-name').value.trim();
    const eventDate = document.getElementById('event-date').value;
    
    if (!eventName || !eventDate) {
        showNotification('请输入事件名称和日期');
        return;
    }
    
    const event = {
        name: eventName,
        date: eventDate,
        isAnnual: document.getElementById('event-annual') ? document.getElementById('event-annual').checked : false
    };
    
    // 获取现有的自定义事件
    const customEvents = JSON.parse(localStorage.getItem('customEvents') || '[]');
    customEvents.push(event);
    
    // 保存到本地存储
    localStorage.setItem('customEvents', JSON.stringify(customEvents));
    
    // 清空输入框
    document.getElementById('event-name').value = '';
    document.getElementById('event-date').value = '';
    if (document.getElementById('event-annual')) {
        document.getElementById('event-annual').checked = false;
    }
    
    // 更新显示
    loadCustomEvents();
    updateUpcomingEvents();
    
    showNotification('自定义事件已添加');
}

// 加载自定义事件
function loadCustomEvents() {
    const customEventsList = document.getElementById('custom-events-list');
    customEventsList.innerHTML = '';
    
    const customEvents = JSON.parse(localStorage.getItem('customEvents') || '[]');
    
    customEvents.forEach((event, index) => {
        const li = document.createElement('li');
        const dateObj = new Date(event.date);
        const dateStr = dateObj.toLocaleDateString('zh-CN');
        
        li.innerHTML = `
            <div>
                <strong>${event.name}</strong>: ${dateStr} 
                ${event.isAnnual ? '(每年)' : ''}
                <button class="btn btn-small delete-event" data-index="${index}">删除</button>
            </div>
        `;
        
        customEventsList.appendChild(li);
    });
    
    // 添加删除事件的监听器
    document.querySelectorAll('.delete-event').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteCustomEvent(index);
        });
    });
}

// 删除自定义事件
function deleteCustomEvent(index) {
    const customEvents = JSON.parse(localStorage.getItem('customEvents') || '[]');
    
    if (index >= 0 && index < customEvents.length) {
        customEvents.splice(index, 1);
        localStorage.setItem('customEvents', JSON.stringify(customEvents));
        loadCustomEvents();
        updateUpcomingEvents();
        showNotification('事件已删除');
    }
}

// 保存信件
function saveLetter() {
    const letterText = document.getElementById('love-letter-text').value.trim();
    
    if (!letterText) {
        showNotification('请输入信件内容');
        return;
    }
    
    const letter = {
        text: letterText,
        date: new Date().toISOString()
    };
    
    // 获取现有的信件
    const letters = JSON.parse(localStorage.getItem('letters') || '[]');
    letters.unshift(letter);
    
    // 保存到本地存储
    localStorage.setItem('letters', JSON.stringify(letters));
    
    // 清空输入框
    document.getElementById('love-letter-text').value = '';
    
    // 更新显示
    loadLetters();
    
    showNotification('信件已保存');
}

// 加载信件
function loadLetters() {
    const savedLetters = document.getElementById('saved-letters');
    savedLetters.innerHTML = '';
    
    const letters = JSON.parse(localStorage.getItem('letters') || '[]');
    
    letters.forEach(letter => {
        const letterDate = new Date(letter.date);
        const dateStr = letterDate.toLocaleDateString('zh-CN');
        
        const letterEntry = document.createElement('div');
        letterEntry.className = 'letter-entry';
        letterEntry.innerHTML = `
            <div class="date">${dateStr}</div>
            <div>${letter.text.replace(/\n/g, '<br>')}</div>
        `;
        
        savedLetters.appendChild(letterEntry);
    });
}

// 上传回忆照片
function uploadMemory(event) {
    const file = event.target.files[0];
    
    if (!file || !file.type.startsWith('image/')) {
        showNotification('请选择图片文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const memory = {
            image: e.target.result,
            date: new Date().toISOString(),
            category: 'default' // 默认分类
        };
        
        // 获取现有的回忆照片
        const memories = JSON.parse(localStorage.getItem('memories') || '[]');
        memories.unshift(memory);
        
        // 保存到本地存储
        localStorage.setItem('memories', JSON.stringify(memories));
        
        // 更新显示
        loadMemories();
        
        showNotification('照片已上传');
    };
    
    reader.readAsDataURL(file);
}

// 加载回忆照片
function loadMemories() {
    const memoriesContainer = document.getElementById('memories-container');
    memoriesContainer.innerHTML = '';
    
    const memories = JSON.parse(localStorage.getItem('memories') || '[]');
    
    memories.forEach(memory => {
        const memoryDate = new Date(memory.date);
        const dateStr = memoryDate.toLocaleDateString('zh-CN');
        
        const memoryItem = document.createElement('div');
        memoryItem.className = 'memory-item';
        memoryItem.innerHTML = `
            <img src="${memory.image}" alt="回忆照片">
            <div class="memory-date">${dateStr}</div>
        `;
        
        // 添加点击放大效果
        memoryItem.addEventListener('click', function() {
            showMemoryModal(memory);
        });
        
        memoriesContainer.appendChild(memoryItem);
    });
}

// 显示照片模态框
function showMemoryModal(memory) {
    // 创建模态框元素
    const modal = document.createElement('div');
    modal.className = 'memory-modal';
    modal.innerHTML = `
        <div class="memory-modal-content">
            <span class="close-modal">&times;</span>
            <img src="${memory.image}" alt="回忆照片">
            <div class="memory-modal-date">${new Date(memory.date).toLocaleDateString('zh-CN')}</div>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 添加关闭事件
    modal.querySelector('.close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// 重置数据
function resetData() {
    if (confirm('确定要重置所有数据吗？这将清除所有保存的信息！')) {
        localStorage.clear();
        showNotification('所有数据已重置');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// 显示通知
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notificationMessage.textContent = message;
    notification.style.display = 'block';
    
    // 3秒后自动关闭
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// 关闭通知
function closeNotification() {
    document.getElementById('notification').style.display = 'none';
}

// 设置主题选择器
function setupThemeSelector() {
    // 检查是否已经存在主题选择器，如果不存在则创建
    if (!document.getElementById('theme-selector')) {
        // 创建主题选择器容器
        const themeSelector = document.createElement('div');
        themeSelector.className = 'theme-selector';
        themeSelector.id = 'theme-selector';
        
        // 添加主题选项
        const themes = [
            { id: 'default', name: '默认主题', color: '#ff6b6b' },
            { id: 'blue', name: '蓝色主题', color: '#4e73df' },
            { id: 'green', name: '绿色主题', color: '#1cc88a' },
            { id: 'purple', name: '紫色主题', color: '#8a63d2' },
            { id: 'dark', name: '暗黑模式', color: '#343a40' }
        ];
        
        // 创建主题选择器标题
        const themeTitle = document.createElement('h3');
        themeTitle.textContent = '选择主题';
        themeSelector.appendChild(themeTitle);
        
        // 创建主题选项容器
        const themeOptions = document.createElement('div');
        themeOptions.className = 'theme-options';
        
        // 添加主题选项
        themes.forEach(theme => {
            const themeOption = document.createElement('div');
            themeOption.className = 'theme-option';
            themeOption.setAttribute('data-theme', theme.id);
            themeOption.style.backgroundColor = theme.color;
            themeOption.title = theme.name;
            
            // 如果是当前主题，添加选中标记
            if (theme.id === currentTheme) {
                themeOption.classList.add('active');
            }
            
            // 添加点击事件
            themeOption.addEventListener('click', function() {
                changeTheme(theme.id);
                // 更新选中状态
                document.querySelectorAll('.theme-option').forEach(option => {
                    option.classList.remove('active');
                });
                this.classList.add('active');
            });
            
            themeOptions.appendChild(themeOption);
        });
        
        themeSelector.appendChild(themeOptions);
        
        // 添加到页面
        const footer = document.querySelector('footer');
        footer.insertBefore(themeSelector, footer.firstChild);
    }
}

// 加载主题
function loadTheme() {
    // 从本地存储加载主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(currentTheme);
    }
}

// 切换主题
function changeTheme(themeId) {
    currentTheme = themeId;
    localStorage.setItem('theme', themeId);
    applyTheme(themeId);
    showNotification(`已切换到${getThemeName(themeId)}`);
}

// 获取主题名称
function getThemeName(themeId) {
    const themeNames = {
        'default': '默认主题',
        'blue': '蓝色主题',
        'green': '绿色主题',
        'purple': '紫色主题',
        'dark': '暗黑模式'
    };
    return themeNames[themeId] || '默认主题';
}

// 应用主题
function applyTheme(themeId) {
    // 移除之前的主题类
    document.body.classList.remove('theme-default', 'theme-blue', 'theme-green', 'theme-purple', 'theme-dark');
    // 添加新主题类
    document.body.classList.add(`theme-${themeId}`);
    
    // 应用主题颜色 - 更新为毛玻璃效果的颜色方案
    const themeColors = {
        'default': {
            primary: '#ff6b6b',
            background: 'rgba(255, 240, 240, 0.7)',
            card: 'rgba(255, 255, 255, 0.7)',
            text: '#333333',
            border: 'rgba(255, 107, 107, 0.2)',
            shadow: 'rgba(255, 107, 107, 0.2)'
        },
        'blue': {
            primary: '#4e73df',
            background: 'rgba(240, 245, 255, 0.7)',
            card: 'rgba(255, 255, 255, 0.7)',
            text: '#333333',
            border: 'rgba(78, 115, 223, 0.2)',
            shadow: 'rgba(78, 115, 223, 0.2)'
        },
        'green': {
            primary: '#1cc88a',
            background: 'rgba(240, 255, 245, 0.7)',
            card: 'rgba(255, 255, 255, 0.7)',
            text: '#333333',
            border: 'rgba(28, 200, 138, 0.2)',
            shadow: 'rgba(28, 200, 138, 0.2)'
        },
        'purple': {
            primary: '#8a63d2',
            background: 'rgba(245, 240, 255, 0.7)',
            card: 'rgba(255, 255, 255, 0.7)',
            text: '#333333',
            border: 'rgba(138, 99, 210, 0.2)',
            shadow: 'rgba(138, 99, 210, 0.2)'
        },
        'dark': {
            primary: '#6c5ce7',
            background: 'rgba(45, 52, 54, 0.8)',
            card: 'rgba(52, 58, 64, 0.7)',
            text: '#ffffff',
            border: 'rgba(108, 92, 231, 0.3)',
            shadow: 'rgba(0, 0, 0, 0.3)'
        }
    };
    
    // 获取当前主题的颜色
    const colors = themeColors[themeId] || themeColors.default;
    
    // 创建或更新CSS变量
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--background-color', colors.background);
    root.style.setProperty('--card-color', colors.card);
    root.style.setProperty('--text-color', colors.text);
    root.style.setProperty('--border-color', colors.border);
    root.style.setProperty('--shadow-color', colors.shadow);
}

// 设置数据导出功能
function setupDataExport() {
    // 检查是否已经存在导出按钮，如果不存在则创建
    if (!document.getElementById('export-data')) {
        // 创建导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.id = 'export-data';
        exportBtn.className = 'btn';
        exportBtn.textContent = '导出数据';
        exportBtn.addEventListener('click', exportData);
        
        // 添加到页面
        const resetBtn = document.getElementById('reset-data');
        resetBtn.parentNode.insertBefore(exportBtn, resetBtn);
        
        // 添加间距
        exportBtn.style.marginRight = '10px';
    }
}

// 导出数据
function exportData() {
    // 收集所有数据
    const data = {
        togetherDate: localStorage.getItem('togetherDate'),
        birthday1: localStorage.getItem('birthday1'),
        birthday2: localStorage.getItem('birthday2'),
        moods: JSON.parse(localStorage.getItem('moods') || '[]'),
        goals: JSON.parse(localStorage.getItem('goals') || '[]'),
        customEvents: JSON.parse(localStorage.getItem('customEvents') || '[]'),
        letters: JSON.parse(localStorage.getItem('letters') || '[]'),
        memories: JSON.parse(localStorage.getItem('memories') || '[]'),
        theme: localStorage.getItem('theme')
    };
    
    // 转换为JSON字符串
    const jsonData = JSON.stringify(data, null, 2);
    
    // 创建下载链接
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接元素
    const a = document.createElement('a');
    a.href = url;
    a.download = `爱情计时器数据备份_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
    
    showNotification('数据导出成功');
}

// 导入数据
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // 导入所有数据
            if (data.togetherDate) localStorage.setItem('togetherDate', data.togetherDate);
            if (data.birthday1) localStorage.setItem('birthday1', data.birthday1);
            if (data.birthday2) localStorage.setItem('birthday2', data.birthday2);
            if (data.moods) localStorage.setItem('moods', JSON.stringify(data.moods));
            if (data.goals) localStorage.setItem('goals', JSON.stringify(data.goals));
            if (data.customEvents) localStorage.setItem('customEvents', JSON.stringify(data.customEvents));
            if (data.letters) localStorage.setItem('letters', JSON.stringify(data.letters));
            if (data.memories) localStorage.setItem('memories', JSON.stringify(data.memories));
            if (data.theme) localStorage.setItem('theme', data.theme);
            
            showNotification('数据导入成功，即将刷新页面');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            showNotification('数据导入失败，请检查文件格式');
            console.error('导入数据错误:', error);
        }
    };
    
    reader.readAsText(file);
}