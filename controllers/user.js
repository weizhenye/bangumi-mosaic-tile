const UserModel = require('../models/user.js');

async function getHTML(ctx, username) {
  const data = await UserModel.get(username);
  if (!data) {
    // TODO: 404 page?
    ctx.throw(404);
  }
  await ctx.render('user', data);
}

module.exports = {
  getHTML,
};
