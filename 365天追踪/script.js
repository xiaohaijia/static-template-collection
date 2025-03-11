document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const progressBar = document.getElementById('progressBar');
    const daysPassed = document.getElementById('daysPassed');
    const daysLeft = document.getElementById('daysLeft');
    const progressPercent = document.getElementById('progressPercent');

    // 创建365天的格子
    for (let i = 1; i <= 365; i++) {
        // 在创建天数格子的循环中添加提示框
        const day = document.createElement('div');
        day.className = 'day';
        
        // 添加提示框元素
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        day.appendChild(tooltip);
        
        // 添加环形进度条
        const progress = document.createElement('div');
        progress.className = 'day-progress';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100'); // 添加viewBox属性确保正确渲染
        
        // 修正圆形进度条参数
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        
        svg.innerHTML = `
            <circle class="bg" cx="50" cy="50" r="${radius}" />
            <circle class="progress" cx="50" cy="50" r="${radius}" 
                    stroke-dasharray="${circumference}" 
                    stroke-dashoffset="${circumference}" />
        `;
        progress.appendChild(svg);
        
        // 添加日期内容
        const content = document.createElement('div');
        content.className = 'day-content';
        content.textContent = i;
        
        day.appendChild(progress);
        day.appendChild(content);
        calendar.appendChild(day);
    }

    // 更新进度
    function updateProgress() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const currentDay = Math.floor(diff / oneDay);

        // 计算当天的时间进度
        const currentDate = new Date();
        const dayProgress = (currentDate.getHours() * 3600 + 
                           currentDate.getMinutes() * 60 + 
                           currentDate.getSeconds()) / (24 * 3600);

        // 更新统计信息
        daysPassed.textContent = currentDay;
        daysLeft.textContent = 365 - currentDay;
        const percent = (currentDay / 365 * 100).toFixed(1);
        progressPercent.textContent = `${percent}%`;
        progressBar.style.width = `${percent}%`;

        // 更新日历格子
        const days = document.querySelectorAll('.day');
        days.forEach((dayElement, index) => {
            const progressCircle = dayElement.querySelector('.progress');
            const tooltip = dayElement.querySelector('.tooltip');
            
            // 确保使用与创建时相同的半径值
            const radius = 40;
            const circumference = 2 * Math.PI * radius;
            
            // 计算该天的日期
            const dayDate = new Date(start);
            dayDate.setDate(dayDate.getDate() + index);
            const dateStr = dayDate.toLocaleDateString('zh-CN', { 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            });

            if (index < currentDay) {
                // 已过去的天数
                dayElement.classList.add('passed');
                progressCircle.style.strokeDashoffset = '0';
                tooltip.textContent = `${dateStr} - 已完成`;
            } else if (index === currentDay) {
                // 当前天数
                dayElement.classList.add('passed');
                const offset = circumference * (1 - dayProgress);
                progressCircle.style.strokeDashoffset = offset;
                const hours = Math.floor(dayProgress * 24);
                const minutes = Math.floor((dayProgress * 24 * 60) % 60);
                tooltip.textContent = `${dateStr} - 今天
当前时间：${hours}时${minutes}分
今日进度：${(dayProgress * 100).toFixed(1)}%`;
            } else {
                // 未来的天数
                progressCircle.style.strokeDashoffset = circumference;
                tooltip.textContent = `${dateStr} - 未开始`;
            }
        });
    }

    // 初始化进度
    updateProgress();

    // 每秒更新一次进度
    setInterval(updateProgress, 1000);
});