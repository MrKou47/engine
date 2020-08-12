import { SchemaResource } from "./SchemaResource";
import { Logger, ResourceManager } from "@alipay/o3-core";
import { PBRMaterial } from "@alipay/o3-pbr";
import { Texture } from "@alipay/o3-material";

import { TextureResource } from "./TextureResource";
import { isAsset, getAllGetters } from "../utils";
import { AssetConfig, LoadAttachedResourceResult } from "../types";

export class PBRMaterialResource extends SchemaResource {
  private configProps;

  load(resourceManager: ResourceManager, assetConfig: AssetConfig): Promise<PBRMaterialResource> {
    return new Promise((resolve) => {
      const assetObj = new PBRMaterial(assetConfig.name);
      this.configProps = assetConfig.props;

      for (let k in this.configProps) {
        if (!isAsset(this.configProps[k])) {
          assetObj[k] = this.configProps[k];
        }
      }
      this._resource = assetObj;
      this.setMeta();
      resolve(this);
    });
  }

  loadWithAttachedResources(
    resourceManager: ResourceManager,
    assetConfig: AssetConfig
  ): Promise<LoadAttachedResourceResult> {
    return new Promise((resolve, reject) => {
      let loadPromise;
      if (assetConfig.resource instanceof PBRMaterial) {
        loadPromise = new Promise((resolve) => {
          this._resource = assetConfig.resource;
          this.setMeta();
          resolve(this);
        });
      } else if (assetConfig.props) {
        loadPromise = this.load(resourceManager, assetConfig);
      } else {
        reject("Load PBRMaterial Error");
      }
      if (loadPromise) {
        loadPromise.then(() => {
          const result: any = {
            resources: [this],
            structure: {
              index: 0,
              props: {}
            }
          };

          const material = this._resource;
          getAllGetters(this._resource).forEach((attr) => {
            if (!(material[attr] instanceof Texture)) return;
            const textureResource = new TextureResource(this.resourceManager, material[attr]);
            this.attachedResources.push(textureResource);
            result.resources.push(textureResource);
            result.structure.props[attr] = {
              index: result.resources.length - 1
            };
          });
          resolve(result);
        });
      }
    });
  }

  setMeta() {
    if (this.resource) {
      this.meta.name = this.resource.name;
    }
  }

  getProps() {
    const result = {};
    const props = getAllGetters(this.resource);
    props.forEach((prop) => (result[prop] = this.resource[prop]));
    return result;
  }

  bind() {
    // 替换PBR材质中的纹理
    const resource = this._resource;
    Object.keys(this.configProps).forEach((attr) => {
      const value = this.configProps[attr];
      if (isAsset(value)) {
        const textureResource = this.resourceManager.get(value.id);
        if (textureResource && textureResource instanceof TextureResource) {
          resource[attr] = textureResource.resource;
          this._attachedResources.push(textureResource);
        } else {
          resource[attr] = null;
          Logger.warn(`PBRMaterialResource: ${this.meta.name} can't find asset "${attr}", which id is: ${value.id}`);
        }
      }
    });
  }
}