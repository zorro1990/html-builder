document.addEventListener('DOMContentLoaded', function() {
    // 密码验证相关元素
    const authContainer = document.getElementById('authContainer');
    const appContainer = document.getElementById('appContainer');
    const passwordInput = document.getElementById('passwordInput');
    const verifyBtn = document.getElementById('verifyBtn');
    const authMessage = document.getElementById('authMessage');
    
    // HTML编辑器相关元素
    const htmlInput = document.getElementById('htmlInput');
    const previewFrame = document.getElementById('previewFrame');
    const publishBtn = document.getElementById('publishBtn');
    const publishedLinkContainer = document.getElementById('publishedLinkContainer');
    const publishedLink = document.getElementById('publishedLink');
    const publishedLinkInput = document.getElementById('publishedLinkInput');

    // 检查本地存储中是否有验证状态
    const isAuthenticated = localStorage.getItem('staticHtmlAuth') === 'true';
    if (isAuthenticated) {
        showApp();
    }

    // 密码验证功能
    if (verifyBtn) {
        verifyBtn.addEventListener('click', () => {
            verifyPassword();
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyPassword();
            }
        });
    }

    function verifyPassword() {
        const password = passwordInput.value.trim();
        if (!password) {
            authMessage.textContent = '请输入密码';
            return;
        }

        // 调用真实的API进行密码验证
        verifyBtn.disabled = true;
        verifyBtn.textContent = '验证中...';
        authMessage.textContent = '';
        
        fetch('https://html-builder-blond.vercel.app/api/verify-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('staticHtmlAuth', 'true');
                showApp();
            } else {
                authMessage.textContent = data.error || '密码错误，请重试';
                passwordInput.value = '';
                passwordInput.focus();
            }
        })
        .catch(error => {
            console.error('验证错误:', error);
            authMessage.textContent = '网络错误，请重试';
        })
        .finally(() => {
            verifyBtn.disabled = false;
            verifyBtn.textContent = '验证';
        });
    }

    function showApp() {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
    }

    // Function to update the preview iframe
    function updatePreview() {
        const rawHtml = htmlInput.value;
        // Sanitize the HTML before rendering
        // Ensure DOMPurify is loaded, otherwise this will throw an error
        // You might want to add a check here if DOMPurify is available
        if (typeof DOMPurify === 'undefined') {
            console.error('DOMPurify is not loaded!');
            previewFrame.srcdoc = '<p style="color:red;">Error: DOMPurify library not loaded. Cannot preview HTML safely.</p>';
            return;
        }
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        previewFrame.srcdoc = cleanHtml;
    }

    // Update preview on input change
    if (htmlInput) {
        htmlInput.addEventListener('input', updatePreview);
    }

    // 修改发布功能
    if (publishBtn) {
        publishBtn.addEventListener('click', () => {
            const rawHtml = htmlInput.value;
            if (!rawHtml.trim()) {
                alert('请输入HTML内容');
                return;
            }
            
            if (typeof DOMPurify === 'undefined') {
                alert('错误：DOMPurify 未加载，无法安全发布。');
                return;
            }
            
            const cleanHtmlToPublish = DOMPurify.sanitize(rawHtml);
            
            publishBtn.disabled = true;
            publishBtn.textContent = '发布中...';
            publishedLinkContainer.style.display = 'none';

            fetch('/api/publish-html', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ htmlContent: cleanHtmlToPublish })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    publishedLink.href = data.viewUrl;
                    publishedLink.textContent = data.viewUrl;
                    publishedLinkInput.value = data.viewUrl;
                    publishedLinkContainer.style.display = 'block';
                    alert('发布成功！');
                } else {
                    alert('发布失败：' + (data.error || '未知错误'));
                }
            })
            .catch(error => {
                console.error('发布错误:', error);
                alert('发布失败：网络错误');
            })
            .finally(() => {
                publishBtn.disabled = false;
                publishBtn.textContent = '发布';
            });
        });
    }

    console.log('StaticHTML Publisher script loaded and initialized.');
    if (typeof DOMPurify !== 'undefined') {
        console.log('DOMPurify is available.');
    } else {
        console.warn('DOMPurify is NOT available. HTML sanitization will not work.');
    }
});