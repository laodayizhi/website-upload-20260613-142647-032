(function () {
    function attachStream(video, streamUrl) {
        if (!video || !streamUrl) {
            return null;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            return null;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                } else {
                    hls.destroy();
                }
            });
            return hls;
        }

        video.src = streamUrl;
        return null;
    }

    window.setupPlayer = function (options) {
        var video = options && options.video;
        var trigger = options && options.trigger;
        var streamUrl = options && options.streamUrl;
        var attached = false;

        function startPlayback() {
            if (!video || !streamUrl) {
                return;
            }
            if (!attached) {
                attachStream(video, streamUrl);
                attached = true;
            }
            if (trigger) {
                trigger.classList.add("is-hidden");
            }
            video.setAttribute("controls", "controls");
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        if (trigger) {
            trigger.addEventListener("click", startPlayback);
        }
        if (video) {
            video.addEventListener("click", function () {
                if (!attached) {
                    startPlayback();
                }
            });
        }
    };
})();
