<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>One moment — MILLIONAIRE</title>
    <style>
        body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
               background:#0a0a0a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
        .box { text-align:center; padding:40px; max-width:400px; }
        .spinner { width:36px; height:36px; border:3px solid rgba(201,168,76,0.2); border-top-color:#C9A84C;
                   border-radius:50%; margin:0 auto 24px; animation:spin 0.8s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        h1 { color:#fff; font-size:18px; font-weight:600; margin:0 0 8px; }
        p { color:rgba(255,255,255,0.5); font-size:14px; margin:0; line-height:1.5; }
        a { color:#C9A84C; text-decoration:none; }
    </style>
</head>
<body>
    <div class="box">
        <div class="spinner"></div>
        <h1>Just a moment</h1>
        <p>We're doing some quick maintenance. This page will refresh automatically —
           <a href="/" id="retry-now">or click here</a>.</p>
    </div>
    <script>
        // Retries quietly in the background. Most real crashes here are the
        // server process restarting itself (a few seconds, handled
        // automatically) — by the time a person reads this sentence, the
        // site is very likely already back. Doubling delay each attempt
        // avoids hammering a server that's still genuinely down.
        let attempt = 0;
        function retry() {
            attempt++;
            fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
                .then(res => {
                    if (res.status < 500) { window.location.reload(); }
                    else { scheduleNext(); }
                })
                .catch(scheduleNext);
        }
        function scheduleNext() {
            const delay = Math.min(2000 * Math.pow(1.5, attempt), 15000);
            setTimeout(retry, delay);
        }
        scheduleNext();
        document.getElementById('retry-now').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.reload();
        });
    </script>
</body>
</html>
