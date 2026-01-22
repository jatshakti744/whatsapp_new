module.exports = function (app) {
    app.use(require("./Users"))
    app.use(require("./BasicSetting"))
    app.use(require("./Mailtemplate"))
    app.use(require("./Smstemplate"))
    app.use(require("./Smsprovider"))
    app.use(require("./Clients"))
    app.use(require("./Dashboard"))
    app.use(require("./Whatschat"))
    app.use(require("./Whatstemplate"))

}