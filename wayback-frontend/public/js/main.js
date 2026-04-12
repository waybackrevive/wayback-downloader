var app = Elm.Main.init({
    flags: {
        year: new Date().getFullYear(),
        storage: JSON.parse(localStorage.getItem("storage"))
    }
})

app.ports.sendMessage.subscribe(function (message) {
    switch (message.action) {
        case "showModal":
        case "hideModal":
            $("#domain").popover("dispose");
            $("#" + message.id).modal();
            break;
        case "popoverMessage":
            $("#domain").popover("dispose");
            $("#domain").popover({
                title: message.popover.title,
                content: message.popover.content,
                placement: message.popover.placement,
            }).popover("show");
            setTimeout(function () {
                $("#domain").popover("dispose");
            }, 2000);
            break;
        case "resetCaptcha":
            hcaptcha.reset();
            break;
        case "getCaptchaResponse":
            app.ports.messageReceiver.send(hcaptcha.getResponse());
            break;
        case "stripeRedirect":
            // Redirect to Whop checkout URL (now handled via Browser.Navigation.load in Elm)
            if (message.id && message.id.startsWith("http")) {
                window.location.href = message.id;
            }
            break;
        default:
            break;
    }
});

app.ports.loadCaptcha.subscribe(async function () {
    requestAnimationFrame(function () {
        try { hcaptcha.remove(); } catch (Exception) { }
        hcaptcha.render('h-captcha', { sitekey: '50598e3f-06d1-4fa7-a038-1ee9315ba701' })
    })
});

app.ports.save.subscribe(storage => {
    localStorage.setItem('storage', JSON.stringify(storage))
    app.ports.load.send(storage)
})
