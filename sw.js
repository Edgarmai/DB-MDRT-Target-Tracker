// sw.js - 處理背景通知與自動清除 Badge
self.addEventListener('push', function(event) {
    let data = { title: '🎉 團隊成交捷報！', body: '有隊友剛剛成功報單！' };
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 當使用者點擊通知開啟 App 時自動清除數字紅點
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/').then(() => {
            if ('clearAppBadge' in navigator) {
                return navigator.clearAppBadge();
            }
        })
    );
});
