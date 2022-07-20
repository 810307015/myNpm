import { DrawImageProps, DrawTextProps } from './typing';


/**
 * 绘制图片
 * @param param0 
 * @returns 
 */
export const drawImage = ({
  ctx,
  url,
  x,
  y,
  w,
  h
}: DrawImageProps) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      ctx.drawImage(image, x, y, w, h);
      resolve(1);
    };
    image.onerror = (e) => reject(e);
  })
};

/**
 * 绘制文字，是否带背景色或者边框
 * @param param0 
 */
export const drawText = ({
  ctx,
  text,
  x,
  y,
  fontSize,
  fontWeight,
  fontFamily = 'serif',
  color,
  container = false,
  containerRender,
}: DrawTextProps) => {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const textWidth = ctx.measureText(text).width;
  let nX = x,
      nY = y;
  if(container && containerRender) {
    const position = containerRender?.({ ctx, x, y, textWidth, fontSize });
    nX = position.x;
    nY = position.y;
  }
  ctx.fillStyle = color;
  ctx.fillText(text, nX, nY);
};