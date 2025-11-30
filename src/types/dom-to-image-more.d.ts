// src/types/dom-to-image-more.d.ts   (or wherever you keep types)

declare module 'dom-to-image-more' {
  interface DomToImageOptions {
    quality?: number;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    filter?: (node: HTMLElement) => boolean;
    cacheBust?: boolean;
  }

  function toPng(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
  function toJpeg(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
  function toBlob(node: HTMLElement, options?: DomToImageOptions): Promise<Blob | null>;
  function toPixelData(node: HTMLElement, options?: DomToImageOptions): Promise<Uint8ClampedArray>;
  function toSvg(node: HTMLElement, options?: DomToImageOptions): Promise<string>;

  export { toPng, toJpeg, toBlob, toPixelData, toSvg };
  export default {
    toPng,
    toJpeg,
    toBlob,
    toPixelData,
    toSvg,
  };
}
