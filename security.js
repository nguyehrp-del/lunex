(function() {
    // 1. Chống chuột phải (Anti Right-Click)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // 2. Chống F12 và các phím tắt Developer Tools (Anti-DevTools)
    document.onkeydown = function(e) {
        if (event.keyCode == 123) { // F12
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { // Ctrl+Shift+I
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { // Ctrl+Shift+C
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { // Ctrl+Shift+J
            return false;
        }
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { // Ctrl+U (View Source)
            return false;
        }
    }

    // 3. Vòng lặp debugger vô hạn (Làm đứng tab nếu cố mở F12)
    setInterval(function() {
        var before = new Date().getTime();
        debugger;
        var after = new Date().getTime();
        if (after - before > 100) {
            document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:20%;'>🚫 Hệ thống đã phát hiện hành vi khả nghi! Cảnh báo chống Hack/Dump!</h1>";
        }
    }, 1000);

    // 4. Chống bôi đen (Anti-Select)
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        input, textarea {
            -webkit-user-select: text !important;
            -khtml-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
    `;
    document.head.appendChild(style);

    // Xoá console log
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
})();
