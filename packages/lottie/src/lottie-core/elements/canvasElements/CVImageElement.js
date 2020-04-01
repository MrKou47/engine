import { extendPrototype } from "../../utils/functionExtensions";
import BaseElement from "../BaseElement";
import TransformElement from "../helpers/TransformElement";
import CVBaseElement from "./CVBaseElement";
import HierarchyElement from "../helpers/HierarchyElement";
import FrameElement from "../helpers/FrameElement";
import RenderableElement from "../helpers/RenderableElement";
import { createTag } from "../../utils/helpers/html_elements";
import SVGShapeElement from "../../elements/svgElements/SVGShapeElement";
import IImageElement from "../ImageElement";

function CVImageElement(data, globalData, comp) {
  this.assetData = globalData.getAssetData(data.refId);
  this.img = globalData.imageLoader.getImage(this.assetData);
  this.initElement(data, globalData, comp);
}
extendPrototype(
  [BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement],
  CVImageElement
);

CVImageElement.prototype.initElement = SVGShapeElement.prototype.initElement;
CVImageElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame;

CVImageElement.prototype.createContent = function() {
  if (this.img.width && (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height)) {
    var canvas = createTag("canvas");
    canvas.width = this.assetData.w;
    canvas.height = this.assetData.h;
    var ctx = canvas.getContext("2d");

    var imgW = this.img.width;
    var imgH = this.img.height;
    var imgRel = imgW / imgH;
    var canvasRel = this.assetData.w / this.assetData.h;
    var widthCrop, heightCrop;
    var par = this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio;
    if ((imgRel > canvasRel && par === "xMidYMid slice") || (imgRel < canvasRel && par !== "xMidYMid slice")) {
      heightCrop = imgH;
      widthCrop = heightCrop * canvasRel;
    } else {
      widthCrop = imgW;
      heightCrop = widthCrop / canvasRel;
    }
    ctx.drawImage(
      this.img,
      (imgW - widthCrop) / 2,
      (imgH - heightCrop) / 2,
      widthCrop,
      heightCrop,
      0,
      0,
      this.assetData.w,
      this.assetData.h
    );
    this.img = canvas;
  }
};

CVImageElement.prototype.renderInnerContent = function(parentMatrix) {
  this.canvasContext.drawImage(this.img, 0, 0);
};

CVImageElement.prototype.destroy = function() {
  this.img = null;
};

export default CVImageElement;