import { Controller } from "egg";
import * as cheerio from "cheerio";

export default class UpdateController extends Controller {
  public async html() {
    const { ctx } = this;
    const type = ctx.request.body.type;
    const html = ctx.request.body.html;

    const $ = cheerio.load(html, {
      decodeEntities: false
    });
    const res = await this.service.update.html(type, $.html());
    ctx.body = res;
  }

  public async image() {
  }
}
