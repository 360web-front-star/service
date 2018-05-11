import { Service } from "egg";
import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import * as crypto from "crypto";

export default class Update extends Service {
  public async html(type: string, html: string) {
    const { ctx } = this;
    const prmReadFile = util.promisify(fs.readFile);
    const prmWriteFile = util.promisify(fs.writeFile);

    const style = (await prmReadFile(
      path.resolve(__dirname, `../public/css/${type}.css`)
    )).toString();
    const script = (await prmReadFile(
      path.resolve(__dirname, `../public/js/${type}.js`)
    )).toString();

    const page = await ctx.renderView("layout/index.ejs", {
      data: {
        title: type,
        style,
        html,
        script
      }
    });

    const hash = crypto
      .createHash("md5")
      .update(new Date().toString())
      .digest("hex");

    await prmWriteFile(
      path.resolve(__dirname, `../public/pages/${hash}.html`),
      page
    );
    return `http://localhost:7001/public/pages/${hash}.html`;
  }

  public async image() {}
}
