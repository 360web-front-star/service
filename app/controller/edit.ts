import { Controller } from "egg";

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;

    const  type = ctx.request.query.template;

    await ctx.render("edit/index.ejs", {
      data: {
        style: `/public/css/${type}.css`,
        script: `/public/js/${type}.js`
      }
    });
  }
}
