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


export const drawText = ({
  ctx,
  text,
  x,
  y,
  fontSize,
  fontWeight,
  fontFamily = 'serif',
  color,
  stroke,
  strokeWidth = 0,
}: DrawTextProps) => {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  if(stroke) {
    ctx.fillStyle = color;
  } else {

  }
};