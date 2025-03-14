document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const heightLiquid = document.getElementById('heightLiquid');
    const heightValue = document.getElementById('heightValue');
    const childHeightInput = document.getElementById('childHeight');
    const measureBtn = document.getElementById('measureBtn');
    const meterScale = document.querySelector('.meter-scale');
    
    // 身高范围设置
    const MIN_HEIGHT = 40;  // 最小身高 (cm)
    const MAX_HEIGHT = 250; // 最大身高 (cm)
    const RANGE = MAX_HEIGHT - MIN_HEIGHT;
    
    // 生成刻度
    generateScale();
    
    // 初始化测量计
    updateMeter(parseFloat(childHeightInput.value) || 0);
    
    // 按钮点击事件
    measureBtn.addEventListener('click', function() {
        const height = parseFloat(childHeightInput.value);
        if (isNaN(height) || height < MIN_HEIGHT || height > MAX_HEIGHT) {
            alert(`请输入有效的身高值 (${MIN_HEIGHT}-${MAX_HEIGHT}cm)`);
            return;
        }
        
        updateMeter(height);
        updateResults(height);
    });
    
    // 生成刻度线
    function generateScale() {
        // 清空现有刻度
        meterScale.innerHTML = '';
        
        // 每10cm一个主刻度，每1cm一个次刻度
        for (let h = MIN_HEIGHT; h <= MAX_HEIGHT; h++) {
            const isMajor = h % 10 === 0;
            const mark = document.createElement('div');
            mark.className = 'scale-mark';
            mark.setAttribute('data-height', h);
            
            // 计算位置百分比 (从底部开始)
            // 确保与updateMeter中的百分比计算方式一致
            const percentage = Math.max(0, Math.min(100, ((h - MIN_HEIGHT) / RANGE) * 100));
            mark.style.bottom = `${percentage}%`;
            
            // 创建刻度线
            const line = document.createElement('div');
            line.className = isMajor ? 'scale-line major' : 'scale-line';
            mark.appendChild(line);
            
            // 只在主刻度添加数值
            if (isMajor) {
                const value = document.createElement('div');
                value.className = 'scale-value';
                value.textContent = `${h}`;
                mark.appendChild(value);
            }
            
            meterScale.appendChild(mark);
        }
    }
    
    // 更新测量计显示
    function updateMeter(height) {
        // 计算液体高度百分比
        const percentage = Math.max(0, Math.min(100, ((height - MIN_HEIGHT) / RANGE) * 100));
        
        // 动画更新液体高度
        heightLiquid.style.height = `${percentage}%`;
        
        // 更新显示的数值 - 移到测量计外部显示
        heightValue.textContent = `${height.toFixed(1)}cm`;
        heightValue.style.color = '#0066cc';
        
        // 更新刻度线颜色 - 已达到的显示蓝色，未达到的显示灰色
        const scaleMarks = document.querySelectorAll('.scale-mark');
        scaleMarks.forEach(mark => {
            const markHeight = parseInt(mark.getAttribute('data-height'));
            const line = mark.querySelector('.scale-line');
            const value = mark.querySelector('.scale-value');
            
            if (markHeight <= height) {
                // 已达到的刻度
                line.style.backgroundColor = markHeight % 10 === 0 ? '#0066cc' : '#66ccff';
                if (value) value.style.color = '#0066cc';
            } else {
                // 未达到的刻度
                line.style.backgroundColor = markHeight % 10 === 0 ? '#666' : '#aaa';
                if (value) value.style.color = '#444';
            }
        });
        
        // 添加引导线 - 指示当前高度
        const guideLineId = 'height-guide-line';
        let guideLine = document.getElementById(guideLineId);
        
        if (!guideLine) {
            guideLine = document.createElement('div');
            guideLine.id = guideLineId;
            guideLine.className = 'height-guide-line';
            meterScale.appendChild(guideLine);
        }
        
        guideLine.style.bottom = `${percentage}%`;
        guideLine.style.display = 'block';
    }
});