// sw.js - MDRT Tracker Service Worker (v2 - Force Update)
const CACHE_NAME = 'mdrt-app-v2';

// 安裝時立刻跳過等待，強制激活新版本
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 激活時自動清理舊版本的快取
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('刪除舊版快取:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 處理背景通知與點擊事件
self.addEventListener('push', function(event) {
    let data = { title: '🎉 團隊成交捷報！', body: '有隊友剛剛成功報單！' };
    if (event.data) {
        try { data = event.data.json(); } catch (e) { data.body = event.data.text(); }
    }
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

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
