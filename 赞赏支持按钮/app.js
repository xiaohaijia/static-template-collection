const triggerBtn = document.querySelector('.trigger-btn');
const rewardBox = document.querySelector('.reward-box');
const radioBtns = document.querySelectorAll('input[name="payment"]');
const images = document.querySelectorAll('.reward-img');

//点击切换显示隐藏
triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    rewardBox.style.display = rewardBox.style.display === 'block' ? 'none' : 'block';
});

//切换支付方式
radioBtns.forEach(radio => {
    radio.addEventListener('change', () => {
        images.forEach(img => img.classList.remove('active'));
        document.querySelector(`.reward-img[alt="${radio.value === 'alipay' ? '支付宝' : '微信'}"]`)
            .classList.add('active');
    });
});

document.addEventListener('click', (e) => {
    if (!rewardBox.contains(e.target) && e.target !== triggerBtn) {
        rewardBox.style.display = 'none';
    }
});