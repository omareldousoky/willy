import { Image } from 'Shared/redux/document/types'

const print = (selectionArray: Image[]) => {
  const frame = document.createElement('iframe')
  frame.style.height = '0'
  frame.style.width = '0'
  frame.style.visibility = 'hidden'
  const container = document.createElement('div')
  selectionArray.forEach((img) => {
    const imgcontainer = document.createElement('div')
    imgcontainer.style.width = '100%'
    const imageurl = document.createElement('img')
    imageurl.src = img.url
    imgcontainer.appendChild(imageurl)
    container.appendChild(imgcontainer)
  })
  const externalDoc = new Blob(
    [
      `<html>
      <body>
      <style>
        @page {
          size: A4;
        }
        @media print{
          html, body {
            width: 210mm;
            height: 297mm;
          }
          *{
            page-break-after: always;
          }
          img{ 
            max-width: 210mm;
            max-height: 297mm;
          }
         }
      </style>
      ${container.innerHTML}</body></html>`,
    ],
    {
      type: 'text/html',
    }
  )
  frame.onload = () => {
    try {
      frame.contentWindow && frame.contentWindow.print()
    } catch (e) {
      console.log(e)
    }
  }
  frame.src = URL.createObjectURL(externalDoc)
  document.body.appendChild(frame)
  frame.addEventListener('afterprint', () => {
    frame.parentNode?.removeChild(frame)
  })
}
export default print
