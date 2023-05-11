const FORM = {
    SW: null,
    init(){
        if ('serviceWorker' in navigator){
            //register service worker
            navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            }).then(registration => {
                FORM.SW = registration.installing ||
                    registration.waiting||
                    registration.active
                console.log('Service worker registered');
            })
        }
        else{
            console.log('Service Worker are not supported');
        }
    },
};

document.addEventListener('DOMContentLoaded', FORM.init);