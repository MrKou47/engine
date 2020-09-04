import { Engine } from "../../Engine";
import { BufferUsage } from "./enums/BufferUsage";
import { VertexDeclaration } from "./VertexDeclaration";
import { HardwareRenderer } from "../../HardwareRenderer";
import { BufferUtil } from "./BufferUtil";
import { SetDataOptions } from "./enums/SetDataOptions";

/**
 * 顶点缓冲。
 */
export class VertexBuffer {
  _glBufferUsage: number;

  /** 顶点声明。*/
  public declaration: VertexDeclaration;

  private _hardwareRenderer: HardwareRenderer;
  private _nativeBuffer: WebGLBuffer;
  private _engine: Engine;
  private _length: number;
  private _bufferUsage: BufferUsage;

  /**
   * 引擎。
   */
  get engine(): Engine {
    return this._engine;
  }

  /**
   * 长度,以字节为单位。
   */
  get length(): number {
    return this._length;
  }

  /**
   * 顶点缓冲用途
   */
  get bufferUsage(): BufferUsage {
    return this._bufferUsage;
  }

  /**
   * 创建顶点缓冲。
   * @param length - 长度，字节为单位
   * @param bufferUsage - 顶点缓冲用途
   * @param engine - 引擎
   */
  constructor(length: number, bufferUsage: BufferUsage = BufferUsage.Static, engine?: Engine) {
    engine = engine || Engine._getDefaultEngine();
    this._engine = engine;
    this._length = length;
    this._bufferUsage = bufferUsage;

    const hardwareRenderer = engine._hardwareRenderer;
    const gl: WebGLRenderingContext & WebGL2RenderingContext = hardwareRenderer.gl;
    const glBufferUsage = BufferUtil._getGLBufferUsage(gl, bufferUsage);

    this._nativeBuffer = gl.createBuffer();
    this._hardwareRenderer = hardwareRenderer;
    this._glBufferUsage = glBufferUsage;

    this.bind();
    gl.bufferData(gl.ARRAY_BUFFER, length, glBufferUsage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  /**
   * 绑定。
   */
  bind(): void {
    const gl: WebGLRenderingContext & WebGL2RenderingContext = this._hardwareRenderer.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._nativeBuffer);
  }

  /**
   * 设置顶点数据。
   * @param data - 顶点数据
   */
  setData(data: ArrayBuffer | ArrayBufferView): void;

  /**
   * 设置顶点数据。
   * @param data - 顶点数据
   * @param bufferByteOffset - 缓冲偏移，以字节为单位
   */
  setData(data: ArrayBuffer | ArrayBufferView, bufferByteOffset: number): void;

  /**
   * 设置顶点数据。
   * @param data - 顶点数据
   * @param bufferByteOffset - 缓冲偏移，以字节为单位
   * @param dataOffset - 数据偏移
   * @param dataLength - 数据长度
   */
  setData(data: ArrayBuffer | ArrayBufferView, bufferByteOffset: number, dataOffset: number, dataLength: number): void;

  /**
   * 设置顶点数据。
   * @param data - 顶点数据
   * @param bufferByteOffset - 缓冲偏移，以字节为单位
   * @param dataOffset - 数据偏移
   * @param dataLength - 数据长度
   * @param options - 操作选项
   */
  setData(
    data: ArrayBuffer | ArrayBufferView,
    bufferByteOffset: number,
    dataOffset: number,
    dataLength: number,
    options: SetDataOptions
  ): void;

  setData(
    data: ArrayBuffer | ArrayBufferView,
    bufferByteOffset: number = 0,
    dataOffset: number = 0,
    dataLength?: number,
    options: SetDataOptions = SetDataOptions.None
  ): void {
    const gl: WebGLRenderingContext & WebGL2RenderingContext = this._hardwareRenderer.gl;
    const isWebGL2: boolean = this._hardwareRenderer.isWebGL2;
    this.bind();

    if (options === SetDataOptions.Discard) {
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._length, this._glBufferUsage);
    }

    if (dataOffset !== 0 || dataLength < data.byteLength) {
      const isArrayBufferView = (<ArrayBufferView>data).byteOffset !== undefined;
      if (isWebGL2 && isArrayBufferView) {
        gl.bufferSubData(gl.ARRAY_BUFFER, bufferByteOffset, <ArrayBufferView>data, dataOffset, dataLength);
      } else {
        const byteSize = (<Uint8Array>data).BYTES_PER_ELEMENT || 1; //TypeArray is BYTES_PER_ELEMENT , unTypeArray is 1
        const subData = new Uint8Array(
          isArrayBufferView ? (<ArrayBufferView>data).buffer : <ArrayBuffer>data,
          dataOffset * byteSize,
          dataLength * byteSize
        );
        gl.bufferSubData(gl.ARRAY_BUFFER, bufferByteOffset, subData);
      }
    } else {
      gl.bufferSubData(gl.ARRAY_BUFFER, bufferByteOffset, data);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  /**
   * 获取顶点数据。
   * @param data - 顶点输出数据
   */
  getData(data: ArrayBufferView): void;

  /**
   * 获取顶点数据。
   * @param data - 顶点输出数据
   * @param bufferByteOffset - 缓冲读取偏移，以字节为单位
   */
  getData(data: ArrayBufferView, bufferByteOffset: number): void;

  /**
   * 获取顶点数据。
   * @param data - 顶点输出数据
   * @param bufferByteOffset - 缓冲读取偏移，以字节为单位
   * @param dataOffset - 输出偏移
   * @param dataLength - 输出长度
   */
  getData(data: ArrayBufferView, bufferByteOffset: number, dataOffset: number, dataLength: number): void;

  getData(data: ArrayBufferView, bufferByteOffset: number = 0, dataOffset: number = 0, dataLength?: number): void {
    const isWebGL2: boolean = this._hardwareRenderer.isWebGL2;

    if (isWebGL2) {
      const gl: WebGLRenderingContext & WebGL2RenderingContext = this._hardwareRenderer.gl;
      this.bind();
      gl.getBufferSubData(gl.ARRAY_BUFFER, bufferByteOffset, data, dataOffset, dataLength);
    } else {
      throw "IndexBuffer is write-only on WebGL1.0 platforms.";
    }
  }

  /**
   * 销毁。
   */
  destroy(): void {
    const gl: WebGLRenderingContext & WebGL2RenderingContext = this._hardwareRenderer.gl;
    gl.deleteBuffer(this._nativeBuffer);
    this._nativeBuffer = null;
    this._engine = null;
    this._hardwareRenderer = null;
  }

  /**
   * @deprecated
   */
  get semanticList() {
    const semanticList = [];
    for (let i = 0; i < this.declaration.elements.length; i++) {
      const semantic = this.declaration.elements[i].semantic;
      semanticList.push(semantic);
    }
    return semanticList;
  }

  /**
   * @deprecated
   */
  resize(dataLength: number) {
    this.bind();
    const gl: WebGLRenderingContext & WebGL2RenderingContext = this._hardwareRenderer.gl;
    gl.bufferData(gl.ARRAY_BUFFER, dataLength, this._glBufferUsage);
    this._length = dataLength;
  }
}