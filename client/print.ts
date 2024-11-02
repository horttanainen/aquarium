export const printFromCanvas = (
    canvas: OffscreenCanvas,
  ) => {

    const dataUriPromise = new Promise<string>((resolve) =>
        canvas.convertToBlob().then((blob) => {
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.addEventListener(
            'load',
            () => {
              resolve(reader.result as string)
            },
            false
          )
        })
      )

    dataUriPromise.then((imageUrl) => {
      const width = canvas.width
      const height = canvas.height
      const imgStyle = getImgStyle(width, height)

      printFromImgStyle(imageUrl, imgStyle)
    })
  }

  const getImgStyle = (width: number, height: number, scale = 1) => {
  return {
    originalWidth: width,
    originalHeight: height,
    width: width * scale,
    height: height * scale,
    scale,
    string: '+',
    style:
      'font-size: 1px; padding: ' +
      Math.floor((height * scale) / 2) +
      'px ' +
      Math.floor((width * scale) / 2) +
      'px; line-height: ' +
      height * scale +
      'px;',
  }
}
type ImgStyle = ReturnType<typeof getImgStyle>

const printFromImgStyle = (imgUrl: string, style: ImgStyle) => {
  console.log(
    '%c' + style.string,
    style.style +
      'background-image: url(' +
      imgUrl +
      '); background-size: ' +
      style.width +
      'px ' +
      style.height +
      'px; background-size: 100% 100%; background-repeat: norepeat; color: transparent;'
  )
}
