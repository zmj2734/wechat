
$(function() {
    document.getElementById("update_app").addEventListener("tap", function() {
        $("#versions").hide();
        checkUpdate();
    })

    document.getElementById('close-ver').addEventListener('tap', function() {
        $("#versions").hide();
    });
    document.getElementById('plant').addEventListener('tap', function() {
        mui.openWindow({
            id: 'plat',
            url: '../static_url/introduction.html'
        });
    });


    document.getElementById('nor_que').addEventListener('tap', function() {
        mui.openWindow({
            id: 'normal_que',
            url: 'normal_que.html'
        });
    });
    document.getElementById('stipulate').addEventListener('tap', function() {
        mui.openWindow({
            id: 'stipulate',
            url: 'stipulate.html'
        });
    });
});

