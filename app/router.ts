import { Application } from "egg";

export default (app: Application) => {
  const { controller, router } = app;

  router.get("/", controller.index.index);
  router.get("/edit", controller.edit.index);
  router.post("/update/html", controller.update.html);
  router.post("/update/image", controller.update.image);
};
