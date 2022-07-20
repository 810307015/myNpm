export type DrawImageProps = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  url: string;
  w: number;
  h: number;
};

export type ContainerRenderProps = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  textWidth: number;
  fontSize: number;
};

export type Position = {
  x: number;
  y: number;
};

export type DrawTextProps = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  text: string;
  fontSize:  number;
  fontWeight: number;
  fontFamily: string;
  color: string;
  container?: boolean;
  containerRender?: (props: ContainerRenderProps) => Position;
};