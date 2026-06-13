(function () {
    function setupPlayer(shell) {
        var video = shell.querySelector('.video-player');
        var button = shell.querySelector('.play-overlay');
        var status = shell.querySelector('[data-player-status]');
        if (!video || !button) {
            return;
        }
        var source = video.getAttribute('data-src');
        var prepared = false;
        function setStatus(text) {
            if (status) {
                status.textContent = text || '';
            }
        }
        function playVideo() {
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    setStatus('浏览器已阻止自动播放，请再次点击播放按钮。');
                    shell.classList.remove('ready');
                });
            }
        }
        function prepare() {
            if (!source) {
                setStatus('当前视频暂不可播放。');
                return;
            }
            shell.classList.add('ready');
            setStatus('正在加载视频...');
            if (prepared) {
                playVideo();
                return;
            }
            prepared = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.addEventListener('loadedmetadata', playVideo, { once: true });
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setStatus('视频已就绪。');
                    playVideo();
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus('视频加载异常，请刷新后重试。');
                        shell.classList.remove('ready');
                    }
                });
                window.__movieHlsInstances = window.__movieHlsInstances || [];
                window.__movieHlsInstances.push(hls);
                return;
            }
            video.src = source;
            playVideo();
        }
        button.addEventListener('click', prepare);
        video.addEventListener('click', function () {
            if (!prepared) {
                prepare();
            }
        });
        video.addEventListener('playing', function () {
            shell.classList.add('ready');
            setStatus('');
        });
        video.addEventListener('pause', function () {
            if (prepared && video.currentTime === 0) {
                shell.classList.remove('ready');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
    });
}());
