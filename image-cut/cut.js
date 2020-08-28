#!/usr/bin/env node
const Jimp = require('jimp');
const path = require('path');

/**
 * url 目标图片，需要裁减的图片
 * files 裁剪过后的文件路径，根据文件路径的个数平均切成n等份
 * isVertical 是否纵向均切，默认为true，false就是横向切图
 */
const clipImage = (url, files, isVertical = true) => {
  console.log('开始裁剪图片')
  const startTime = +new Date();
  Jimp.read(url, async (err, image) => {
    if(err) {
      console.log(err);
      return;
    }
    const { bitmap = {} } = image;
    const { width, height } = bitmap;
    const len = files.length;
    const delta = isVertical ? (height / len) : (width / len);
    async function cropVerticalOne(i) {
      const file = files[i];
      const _image = image.clone();
      await _image.crop(0, delta * i, width, delta)
                  .quality(40)
                 .write(file);
      if(i < len - 1) {
        await cropVerticalOne(i + 1);
      }           
    }
    async function cropHorizontalOne(i) {
      const file = files[i];
      const _image = image.clone();
      await _image.crop(delta * i, 0, delta, height)
                 .write(file);
      if(i < len - 1) {
        await cropHorizontalOne(i + 1);
      }         
    }
    isVertical ? await cropVerticalOne(0) : await cropHorizontalOne(0);
    console.log('裁剪结束，耗费时长：', +new Date() - startTime);
  })
}
const args = process.argv || [];
const [, , file = '', count = 2, isHorizontal] = args;
if(!file || !/[.png|.jpeg|.bmp|.gif|.tiff]$/.test(file)) {
  console.log(`请给一个合法的图片路径，图片格式只支持bmp/png/gif/jpeg/tiff`);
}
const number = Number(count);
const index = file.lastIndexOf('.');
const fileName = file.slice(0, index);
const isVertical = isHorizontal !== 'true';
const files = new Array(number).fill(0).map((item, index) => path.resolve(process.cwd(), `${fileName}_${index + 1}.png`));
clipImage(path.resolve(process.cwd(), file), files, isVertical);