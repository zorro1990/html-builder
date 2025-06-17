document.addEventListener('DOMContentLoaded', () => {
    const htmlInput = document.getElementById('htmlInput');
    const previewFrame = document.getElementById('previewFrame');
    const publishBtn = document.getElementById('publishBtn'); // Corrected ID
    const publishedLinkContainer = document.getElementById('publishedLinkContainer');
    const publishedLink = document.getElementById('publishedLink');
    const publishedLinkInput = document.getElementById('publishedLinkInput');

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

    // Placeholder for publish functionality
    if (publishBtn) { // Corrected variable name
        publishBtn.addEventListener('click', () => {
            const rawHtml = htmlInput.value;
            if (typeof DOMPurify === 'undefined') {
                alert('错误：DOMPurify 未加载，无法安全发布。');
                return;
            }
            const cleanHtmlToPublish = DOMPurify.sanitize(rawHtml);
            console.log('Publish button clicked. Clean HTML to publish:', cleanHtmlToPublish);
            // Simulate API call
            publishBtn.disabled = true;
            publishBtn.textContent = '发布中...';
            publishedLinkContainer.style.display = 'none';

            setTimeout(() => {
                // Simulate a successful response
                const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
                const fakeUrl = `https://your-publish-service.example.com/view/${uniqueId}`;

                publishedLink.href = fakeUrl;
                publishedLink.textContent = fakeUrl;
                publishedLinkInput.value = fakeUrl;
                publishedLinkContainer.style.display = 'block';

                publishBtn.disabled = false;
                publishBtn.textContent = '发布';
                alert('模拟发布成功！链接已显示。');

            }, 2000); // Simulate 2 seconds delay
        });
    }

    // Initial preview update if there's any default content (optional)
    // updatePreview(); 

    console.log('StaticHTML Publisher script loaded and initialized.');
    if (typeof DOMPurify !== 'undefined') {
        console.log('DOMPurify is available.');
    } else {
        console.warn('DOMPurify is NOT available. HTML sanitization will not work.');
    }
});