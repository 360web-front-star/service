"use strict";

class V360 {
  constructor(options) {
    if (options) {
      this.edit = $(`${options.edit}`);
      this.editDoms = $(`${options.template}`).children();
    }

    // 类型
    this.type = {
      text: "text",
      textarea: "textarea",
      image: "image",
      images: "images",
      list: "list",
      link: "link",
      links: "links"
    };
    // 获取全部可编辑直接子元素
    this.bindEvent();
    this.bindClick();
    this.changeView();
  }

  bindEvent() {
    this.editDoms.each((_, ele) => {
      $(ele).click(that => {
        const current = $(that.currentTarget);
        if (!current.data().edit) {
          return;
        }
        let data = current.data().edit;
        this.renderControl(data);
      });
    });
  }

  /***
   * 通过class name 获取类型
   * @param className
   * @returns {*|string}
   */
  getType(className) {
    const type = className.split("-")[2];
    return type;
  }

  renderControl(data) {
    this.edit.html("");
    for (let className of Object.keys(data)) {
      const type = this.getType(className);
      if (type === this.type.text || type === this.type.link) {
        this.renderText(className, data[className]);
      } else if (type === this.type.textarea) {
        this.renderTextarea(className, data[className]);
      } else if (type === this.type.image) {
        this.renderImage(className, data[className]);
      } else if (
        type === this.type.images ||
        type === this.type.list ||
        type === this.type.links
      ) {
        this.renderList(className, data[className]);
      }
    }
  }

  renderText(className, data) {
    let controlHtml = this.edit.html();
    let controlItem = `<div class="edit-item-type">
        <h4 class="edit-item-title">${data}</h4>
        <input type="text" title=${data} class="${className}-control">
      </div>`;
    controlHtml += controlItem;
    this.edit.html(controlHtml);
  }

  renderImage(className, data) {
    let controlHtml = this.edit.html();
    let controlItem = `<div class="edit-item-type">
  <h4 class="edit-item-title">${data}</h4>
  <input type="text" title=${data} class="${className}-control">
   <input type="file" name="userPhoto" class="${className}-control-update"/>
</div>`;
    controlHtml += controlItem;
    this.edit.html(controlHtml);
  }

  renderTextarea(className, data) {
    let controlHtml = this.edit.html();
    let controlItem = `<div class="edit-item-type">
  <h4 class="edit-item-title">${data}</h4>
    <textarea cols="30" rows="10" class="${className}-control"></textarea>
  </div>`;
    controlHtml += controlItem;
    this.edit.html(controlHtml);
  }

  renderList(className, data) {
    let controlHtml = this.edit.html();
    const list = $(`.${className} li`);
    let controlItemH = `<div class="edit-item-type">
  <h4 class="edit-item-title">${data}</h4>`;

    list.each(index => {
      controlItemH += `
      <input type="text" title=${data}-${index} class="${className}-control-${index}">
      `;
    });
    controlHtml += controlItemH;
    this.edit.html(controlHtml);
  }

  changeView() {
    this.edit.on("input", ele => {
      const target = $(ele.target);
      const controlClass = target.attr("class");
      const controlVal = target.val();
      let viewClass = controlClass.substr(0, controlClass.length - 8);
      const viewTarget = $(`.${viewClass}`);

      switch (this.getType(viewClass)) {
        case this.type.image:
          viewTarget.attr("src", controlVal);
          break;
        case this.type.list:
          viewClass = controlClass.substr(0, controlClass.length - 10);
          // 控制第几个input
          const index = controlClass.substr(controlClass.length - 1, 1);
          $(`.${viewClass}`)
            .find("li")
            .eq(index)
            .text(controlVal);
          break;

        case this.type.images:
          viewClass = controlClass.substr(0, controlClass.length - 10);
          // ！！！安全验证！ xss注入
          // 控制第几个input
          const index2 = controlClass.substr(controlClass.length - 1, 1);
          $(`.${viewClass}`)
            .find("li img")
            .eq(index2)
            .attr("src", controlVal);
          break;

        case this.type.link:
          viewTarget.attr("href", controlVal);
          break;

        case this.type.links:
          viewClass = controlClass.substr(0, controlClass.length - 10);
          // ！！！安全验证！ xss注入
          // 控制第几个input
          const index3 = controlClass.substr(controlClass.length - 1, 1);
          $(`.${viewClass}`)
            .find("li a")
            .eq(index3)
            .attr("href", controlVal);
          break;

        default:
          viewTarget.text(controlVal);
          break;
      }
    });
  }

  // 上传图片
  bindClick() {
    this.edit.on("change", ele => {
      const target = $(ele.target);
      const targetClass = target.attr("class");
      const controlClass = targetClass.substring(0, targetClass.length - 7);
      const viewClass = controlClass.substring(0, controlClass.length - 8);
      console.log(viewClass);
      const file = $(`.${targetClass}`).prop("files")[0];
      const fileName = file.name;
      const formData = new FormData();
      formData.append("name", fileName);
      formData.append("image", file);
      $.ajax({
        url: "/update/image",
        data: formData,
        method: "POST",
        cache: false,
        contentType: false,
        processData: false
      })
        .done(data => {
          $(`.${controlClass}`).val(data);
          $(`.${viewClass}`).attr("src", data);
        })
        .fail(err => {
          console.log("err", err);
        });
    });
  }
}

new V360({
  edit: ".edit",
  template: ".template"
});

// 生成网页
$(".btn-finish").click(ele => {
  const html = $(".template").prop("outerHTML");
  const type = $(".template")
    .attr("class")
    .trim()
    .split(" ")
    .filter(ele => ele.includes("tep-name"))[0]
    .split("-")[2];

  $.ajax({
    url: "/update/html",
    method: "POST",
    data: { type, html }
  })
    .done(data => {
      window.location.replace(data);
    })
    .fail(err => {
      console.log(err);
    });
});
