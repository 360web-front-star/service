import { Controller } from "egg";

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    await ctx.render("edit/index.ejs", {
      data: {
        style: "/public/css/resume.css",
        script: "/public/js/resume.js"
      }
    });
  }
}
