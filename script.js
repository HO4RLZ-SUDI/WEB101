    // --- Countdown Timer Logic ---
    const countdown = () => {
        // ตั้งค่าวันเป้าหมาย (ปี, เดือน(0-11), วัน, ชั่วโมง, นาที, วินาที)
        // ตัวอย่าง: 1 กันยายน 2568 เวลา 09:00:00
        const countDate = new Date('September 1, 2025 09:00:00').getTime();
        const now = new Date().getTime();
        const gap = countDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);
        const textMinute = Math.floor((gap % hour) / minute);
        const textSecond = Math.floor((gap % minute) / second);

        document.getElementById('days').innerText = textDay < 10 ? '0' + textDay : textDay;
        document.getElementById('hours').innerText = textHour < 10 ? '0' + textHour : textHour;
        document.getElementById('minutes').innerText = textMinute < 10 ? '0' + textMinute : textMinute;
        document.getElementById('seconds').innerText = textSecond < 10 ? '0' + textSecond : textSecond;
        
        if (gap < 0) {
            document.getElementById('countdown-timer').innerHTML = '<h3 style="color:white;width:100%;">เปิดรับสมัครแล้ว!</h3>';
        }
    };
    setInterval(countdown, 1000);

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // ปิดอันอื่นที่เปิดอยู่ (ถ้าต้องการให้เปิดได้ทีละอัน)
            faqItems.forEach(otherItem => {
                if(otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // เปิด/ปิดอันที่คลิก
            item.classList.toggle('active');
        });
    });

