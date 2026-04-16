const figure = document.getElementById('tiltedCard');
const inner = document.getElementById('cardInner');
const caption = document.getElementById('caption');

const rotateAmplitude = 15; // 회전 강도
const scaleOnHover = 1.1;   // 호버 시 확대 배율

let lastY = 0;

figure.addEventListener('mousemove', (e) => {
    const rect = figure.getBoundingClientRect();
    
    // 마우스 위치 계산 (-1 ~ 1 범위)
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    // 1. 카드 회전 및 확대 적용
    inner.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${scaleOnHover})`;

    // 2. 툴팁 위치 및 회전 적용
    caption.style.opacity = '1';
    caption.style.left = `${e.clientX}px`;
    caption.style.top = `${e.clientY}px`;

    // 마우스 속도에 따른 툴팁 기울기 효과 (Spring 느낌)
    const velocityY = offsetY - lastY;
    caption.style.transform = `translate(-50%, -120%) rotate(${-velocityY * 0.5}deg)`;
    
    lastY = offsetY;
});

figure.addEventListener('mouseenter', () => {
    inner.style.transition = 'transform 0.1s ease-out'; // 움직일 때는 빠르게
});

figure.addEventListener('mouseleave', () => {
    // 마우스가 나갈 때 초기 상태로 복구
    inner.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    inner.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    
    caption.style.opacity = '0';
});