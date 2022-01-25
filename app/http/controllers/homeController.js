const Decoration = require('../../models/decoration')

function homeController() {
    return {
        async index(req, res) {
            const decorations = await Decoration.find()
            return res.render('home', { decorations: decorations })
        }
    }
}


module.exports = homeController;